# ====================================
# STORAGE CLIENT (Supabase Storage)
# Render's own filesystem is ephemeral - wiped on every redeploy, so
# every file this app ever saved to local disk (backend/uploads/...)
# was lost the moment the app next redeployed, while the DB row
# referencing it survived untouched. This module is the single place
# every upload path now goes through instead, storing bytes in the
# same Supabase project already used for the database - real
# persistent storage, not the app server's own disk.
#
# Plain REST calls via `requests`, matching email_relay_client.py's
# exact style, rather than adding the heavier supabase-py SDK for a
# handful of PUT/GET/DELETE calls.
#
# The bucket stays private (Supabase's default) - only this backend,
# holding the service-role key, ever calls Supabase directly. The
# frontend never sees a Supabase URL at all; every file is served back
# through this app's own /uploads/{key} proxy route (backend/main.py).
# ====================================

import os
import uuid
import requests

from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_STORAGE_BUCKET = os.getenv("SUPABASE_STORAGE_BUCKET", "raas-dos-uploads")


def _object_url(key):
    return f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_STORAGE_BUCKET}/{key}"


def _auth_headers():
    return {"Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}"}


def upload_object(key, content, content_type="application/octet-stream"):

    response = requests.put(
        _object_url(key),
        headers={
            **_auth_headers(),
            "Content-Type": content_type,
            "x-upsert": "true"
        },
        data=content,
        timeout=30
    )

    response.raise_for_status()


def download_object(key):

    # Confirmed via a real smoke test against this project's own bucket:
    # re-uploading to the same key (upsert) followed shortly by a GET
    # could return stale content from an EARLIER version, not just the
    # immediately-previous one - some caching layer between this
    # process and Supabase (not something Cache-Control headers alone
    # were observed to fix) was serving old responses keyed purely by
    # URL. A unique query-string param on every GET reliably defeated
    # it (verified 3/3 in a row) - real re-uploads to the same key DO
    # happen in this app (e.g. regenerating a Quote Release document
    # for the same quote/revision), so this isn't a hypothetical risk.
    response = requests.get(
        f"{_object_url(key)}?_cb={uuid.uuid4().hex}",
        headers={**_auth_headers(), "Cache-Control": "no-cache"},
        timeout=30
    )

    # Confirmed via a real smoke test against this project's own bucket:
    # a missing object comes back as a genuine HTTP 400 (not 404), with
    # the real "not found" status only visible inside the JSON body
    # ({"statusCode":"404","error":"not_found","code":"NoSuchKey"}) -
    # Supabase Storage's own REST quirk, not something documented
    # anywhere obvious. Checking the body's error code is what actually
    # distinguishes "this key doesn't exist" from a genuine failure
    # (bad auth, wrong bucket, a real 500) that should still raise.
    if response.status_code in (400, 404):

        try:
            body = response.json()
        except ValueError:
            body = {}

        if body.get("code") == "NoSuchKey" or str(body.get("statusCode")) == "404":
            return None

    response.raise_for_status()

    return response.content


def delete_object(key):

    # Best-effort - a storage-side delete failing must never block the
    # DB row's own delete, matching the existing os.remove() call
    # sites this replaces (none of them treated a missing/failed local
    # delete as fatal either).
    try:
        requests.delete(
            _object_url(key),
            headers=_auth_headers(),
            timeout=30
        )
    except requests.RequestException:
        pass
