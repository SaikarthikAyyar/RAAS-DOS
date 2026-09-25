# ====================================
# MQTT TELEMETRY HUB
# RAAS-DOS subscribes to the machines' MQTT broker directly (no
# intermediate API). Each machine's Raspberry Pi publishes a JSON packet
# about every 2 s to  devices/<botId>/telemetry.
#
# The broker keeps nothing (QoS 0, not retained), so this hub is only
# the LIVE picture: the latest packet per bot plus a short in-memory
# trail for charts. Whatever job execution needs to keep is persisted by
# services/telemetry_sync.py (last-known reading on the inventory row,
# sampled log while a machine is on a job).
#
# INTERIM SOURCE: until a subscribe-only broker user exists, the hub can
# instead RELAY the Varaha dashboard's own live API (the same data their
# dashboard shows). It is used only while MQTT_HOST is unset:
#   VARAHA_API_BASE_URL   default https://raas-dashboard-beta.vercel.app
#                         (set to "off" to disable the relay)
#   VARAHA_API_TOKEN      optional Bearer token
# Packets keep THEIR OWN timestamp, so a machine that stopped sending
# reads Offline instead of live.
#
# Configuration (environment) - leave MQTT_HOST unset to disable:
#   MQTT_HOST       broker host, e.g. xxxx.s1.eu.hivemq.cloud
#   MQTT_PORT       default 8883
#   MQTT_USERNAME / MQTT_PASSWORD   a subscribe-only broker user
#   MQTT_TOPIC      default devices/+/telemetry
#   MQTT_TLS        default true
# ====================================

import json
import logging
import os
import ssl
import threading
import time
from collections import deque

import paho.mqtt.client as mqtt
import requests
from datetime import datetime, timezone

logger = logging.getLogger("mqtt_telemetry")

HISTORY_POINTS = 300          # ~10 min at one packet / 2 s
PROCESS_INTERVAL_SECONDS = 2  # how often queued packets are handed to the DB sync
API_POLL_SECONDS = 3
DEFAULT_API_URL = "https://raas-dashboard-beta.vercel.app"


class TelemetryHub:

    def __init__(self):
        self._lock = threading.RLock()
        self.latest = {}       # BOT_ID -> {"received_at": epoch, "packet": dict}
        self.history = {}      # BOT_ID -> deque[(epoch, packet)]
        self._pending = {}     # BOT_ID -> packet, drained by the sync worker
        self.client = None
        self.connected = False
        self.host = None
        self.port = 8883
        self.topic = "devices/+/telemetry"
        self.last_error = None
        self.packets = 0
        self._stop = threading.Event()
        self._worker = None
        self._on_batch = None
        self.mode = "off"          # mqtt | api | off
        self.api_url = None
        self._api_seeded = set()

    # ---------- configuration ----------

    @property
    def configured(self):
        return bool(self.host)

    def _load_config(self):
        self.host = (os.getenv("MQTT_HOST") or "").strip() or None
        self.port = int(os.getenv("MQTT_PORT") or 8883)
        self.topic = (os.getenv("MQTT_TOPIC") or "devices/+/telemetry").strip()

    # ---------- lifecycle ----------

    def start(self, on_batch=None):
        """Connect (non-blocking; paho reconnects on its own) and start
        the worker that hands packets to the DB sync."""

        self._on_batch = on_batch
        self._load_config()

        if not self.configured:
            api_url = (os.getenv("VARAHA_API_BASE_URL") or DEFAULT_API_URL).strip().rstrip("/")
            if api_url.lower() in ("", "off"):
                logger.info("Machine telemetry disabled (no MQTT_HOST, API relay off).")
                return
            self.mode = "api"
            self.api_url = api_url
            self._stop.clear()
            threading.Thread(target=self._api_loop, name="telemetry-api-relay", daemon=True).start()
            self._worker = threading.Thread(target=self._process_loop, name="telemetry-sync", daemon=True)
            self._worker.start()
            logger.info("MQTT_HOST not set - relaying live telemetry from %s", api_url)
            return

        self.mode = "mqtt"

        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="", clean_session=True)

        username = os.getenv("MQTT_USERNAME")
        if username:
            client.username_pw_set(username, os.getenv("MQTT_PASSWORD") or "")

        if (os.getenv("MQTT_TLS") or "true").lower() != "false":
            client.tls_set(cert_reqs=ssl.CERT_REQUIRED)

        client.on_connect = self._on_connect
        client.on_disconnect = self._on_disconnect
        client.on_message = self._on_message
        client.reconnect_delay_set(min_delay=1, max_delay=30)

        self.client = client

        try:
            client.connect_async(self.host, self.port, keepalive=30)
            client.loop_start()
        except Exception as error:  # never stop the app over telemetry
            self.last_error = f"{error.__class__.__name__}: {error}"
            logger.error("MQTT connect failed: %s", self.last_error)

        self._stop.clear()
        self._worker = threading.Thread(target=self._process_loop, name="telemetry-sync", daemon=True)
        self._worker.start()

    def stop(self):
        self._stop.set()
        if self.client:
            try:
                self.client.loop_stop()
                self.client.disconnect()
            except Exception:
                pass

    # ---------- paho callbacks ----------

    def _on_connect(self, client, userdata, flags, reason_code, properties=None):
        if reason_code == 0 or getattr(reason_code, "is_failure", False) is False:
            self.connected = True
            self.last_error = None
            client.subscribe(self.topic, qos=0)
            logger.info("MQTT connected, subscribed to %s", self.topic)
        else:
            self.connected = False
            self.last_error = f"connect refused: {reason_code}"
            logger.error("MQTT %s", self.last_error)

    def _on_disconnect(self, client, userdata, flags, reason_code, properties=None):
        self.connected = False
        if reason_code != 0:
            self.last_error = f"disconnected: {reason_code}"

    def _on_message(self, client, userdata, msg):
        try:
            packet = json.loads(msg.payload.decode("utf-8"))
        except Exception:
            return

        if not isinstance(packet, dict):
            return

        parts = msg.topic.split("/")
        topic_id = parts[1] if len(parts) >= 3 else parts[0]
        bot_id = str(packet.get("botId") or packet.get("deviceId") or topic_id).strip().upper()

        if not bot_id:
            return

        self.ingest(bot_id, packet)

    # ---------- storage (also used directly by tests) ----------

    def ingest(self, bot_id, packet, received_at=None):

        now = received_at if received_at is not None else time.time()

        with self._lock:
            self.latest[bot_id] = {"received_at": now, "packet": packet}
            trail = self.history.setdefault(bot_id, deque(maxlen=HISTORY_POINTS))
            trail.append((now, packet))
            self._pending[bot_id] = packet
            self.packets += 1

    def get_latest(self, bot_id):
        with self._lock:
            entry = self.latest.get((bot_id or "").upper())
            return dict(entry) if entry else None

    def known_bot_ids(self):
        with self._lock:
            return list(self.latest.keys())

    def get_history(self, bot_id, limit=HISTORY_POINTS):
        with self._lock:
            trail = self.history.get((bot_id or "").upper())
            return list(trail)[-limit:] if trail else []

    # ---------- interim API relay ----------

    @staticmethod
    def _packet_epoch(packet, fallback):
        try:
            text = str(packet.get("timestamp")).replace("Z", "+00:00")
            parsed = datetime.fromisoformat(text)
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=timezone.utc)
            return parsed.timestamp()
        except Exception:
            return fallback

    def _api_get(self, path):
        headers = {}
        token = os.getenv("VARAHA_API_TOKEN")
        if token:
            headers["Authorization"] = f"Bearer {token}"
        response = requests.get(self.api_url + path, headers=headers, timeout=15)
        response.raise_for_status()
        return response.json()

    def _seed_history(self, bot_id):
        # One-off: fill the in-memory trail so charts have history.
        try:
            rows = self._api_get(f"/api/telemetry/history/{bot_id}?limit={HISTORY_POINTS}").get("data") or []
        except Exception:
            return
        with self._lock:
            trail = self.history.setdefault(bot_id, deque(maxlen=HISTORY_POINTS))
            trail.clear()
            for row in rows:
                packet = row.get("rawPayload") if isinstance(row.get("rawPayload"), dict) else row
                trail.append((self._packet_epoch(packet, self._packet_epoch(row, time.time())), packet))
        self._api_seeded.add(bot_id)

    def _api_loop(self):
        while not self._stop.is_set():
            try:
                live = self._api_get("/api/telemetry/live").get("data") or {}
                self.connected = True
                self.last_error = None
                for bot_id, record in live.items():
                    bot_id = str(bot_id).upper()
                    packet = record.get("rawPayload") if isinstance(record.get("rawPayload"), dict) else record
                    at = self._packet_epoch(packet, self._packet_epoch(record, time.time()))
                    if bot_id not in self._api_seeded:
                        self._seed_history(bot_id)
                    with self._lock:
                        known = self.latest.get(bot_id)
                    if known and known["received_at"] >= at:
                        continue  # nothing new from this machine
                    self.ingest(bot_id, packet, received_at=at)
            except Exception as error:
                self.connected = False
                self.last_error = error.__class__.__name__
            self._stop.wait(API_POLL_SECONDS)

    def status(self):
        return {
            "mode": self.mode,
            "configured": self.configured or self.mode == "api",
            "connected": self.connected,
            "host": self.host or self.api_url,
            "topic": self.topic,
            "packets_received": self.packets,
            "bots_seen": len(self.latest),
            "last_error": self.last_error,
        }

    # ---------- worker ----------

    def _drain(self):
        with self._lock:
            batch, self._pending = self._pending, {}
        return batch

    def _process_loop(self):
        while not self._stop.wait(PROCESS_INTERVAL_SECONDS):
            batch = self._drain()
            if batch and self._on_batch:
                try:
                    self._on_batch(batch)
                except Exception:
                    logger.exception("telemetry sync failed")


hub = TelemetryHub()
