import {
    Cpu, Cog, ArrowLeft, ArrowRight, HeartPulse, Zap, Droplets,
    Clock, Thermometer, RotateCw, Waves
} from "lucide-react";

import {
    COLORS, SemicircularGauge, StatusCard,
    SystemLoadCard, AlertsCard, StatusStrip, LiveMap
} from "./TelemetryWidgets";

import { MachineLocation3D } from "./location3d/MachineLocation3D";

import { freshnessFromStatus } from "./location3d/freshness";

import "./location3d/MachineLocation3D.light.css";

import {
    THRESHOLDS as T, readValues, machineHealth, systemLoad,
    buildAlerts, gpsPath, toLocalPosition, toTrajectory
} from "./machineTelemetry";


const ICON = 13;

const HEALTH_TONE = { nominal:"emerald", warning:"amber", critical:"red", nodata:"muted" };


// Default Varaha dashboard (used for every non-SCH machine): status
// ribbon, actuator gauges, location, system load and alerts.
export default function MachineDashboard({ detail }){

    const r = readValues(detail.values);
    const state = detail.telemetry_status;

    const deviceOn = state === "live" || state === "stale";
    const device = state === "live" ? { v:"ON", tone:"emerald" }
        : state === "stale" ? { v:"STALE", tone:"amber" }
        : state === "offline" ? { v:"OFF", tone:"red" }
        : { v:"UNKNOWN", tone:"muted" };

    const health = machineHealth(r);
    const load = systemLoad(r, deviceOn);
    const alerts = buildAlerts(r, detail.last_seen);

    const dirTone = r.direction === "FWD" ? "accent" : r.direction === "REV" ? "amber" : "muted";
    const pumpRunning = r.pumpStatus === "RUNNING";

    const h = detail.history;

    const sourceLabel = state === "live" ? "LIVE" : state === "stale" ? "STALE" : state === "offline" ? "OFFLINE" : "NO DATA";
    const sourceColor = state === "live" ? COLORS.ok : state === "stale" ? COLORS.warn : state === "offline" ? COLORS.crit : COLORS.nodata;

    return(

        <div className="ms-dash">

            {/* 1. SYSTEM STATUS RIBBON */}
            <div className="ms-ribbon">

                <StatusCard icon={<Cpu size={ICON} />} label="Device Status" value={device.v} tone={device.tone} pulse={state === "live"} />
                <StatusCard icon={<Cog size={ICON} />} label="Motor Status" value={r.motorStatus ?? "--"} tone={r.motorStatus === "RUNNING" ? "emerald" : r.motorStatus === "FAULT" ? "red" : "muted"} />
                <StatusCard icon={<ArrowLeft size={ICON} />} label="Left Motor Drive Direction" value={r.direction ?? "--"} tone={dirTone} />
                <StatusCard icon={<ArrowRight size={ICON} />} label="Right Motor Drive Direction" value={r.direction ?? "--"} tone={dirTone} />
                <StatusCard icon={<HeartPulse size={ICON} />} label="Machine Health" value={health === "nominal" ? "NOMINAL" : health === "nodata" ? "NODATA" : health.toUpperCase()} tone={HEALTH_TONE[health]} />
                <StatusCard icon={<Zap size={ICON} />} label="Common Voltage" subtitle="SHARED DC BUS" value={r.busVoltage !== undefined ? `${r.busVoltage.toFixed(1)} V` : "-- V"} tone="amber" />
                <StatusCard icon={<Droplets size={ICON} />} label="Pump Status" value={r.pumpStatus ?? "--"} tone={pumpRunning ? "accent" : "muted"} />
                <StatusCard icon={<Clock size={ICON} />} label="System Uptime" value={r.uptime ?? "--"} tone="muted" />

            </div>

            {/* 2. ACTUATOR TELEMETRY + MACHINE LOCATION */}
            <div className="ms-row">

                <section className="ms-panel ms-span-7 ms-tall">

                    <div className="ms-panel-head">
                        <div className="ms-panel-title"><span className="ms-tag">DUAL ACTUATORS</span><h3>Actuator Telemetry</h3></div>
                        <div className="ms-panel-key"><i style={{ background:COLORS.orange }} />DRIVE <em>|</em> <i style={{ background:COLORS.slate }} />PUMP</div>
                    </div>

                    <div className="ms-actuators">

                        <div className="ms-actuator">
                            <div className="ms-actuator-head">
                                <span style={{ color:COLORS.orange }}><Cog size={12} /> ACTUATOR 1 — DRIVE SYSTEM</span>
                                <em>{r.motorStatus ?? "TELEMETRY"}</em>
                            </div>
                            <div className="ms-gauges g4">
                                <SemicircularGauge label="Motor Temperature" value={r.motorTemp} unit="°C" min={0} max={60} warn={T.motorTempWarn} crit={T.motorTempCrit} icon={<Thermometer size={12} color={COLORS.ok} />} />
                                <SemicircularGauge label="Left Motor RPM" value={r.leftRpm} unit="RPM" min={0} max={2000} warn={T.rpmWarn} crit={T.rpmCrit} icon={<RotateCw size={12} color={COLORS.orange} />} />
                                <SemicircularGauge label="Right Motor RPM" value={r.rightRpm} unit="RPM" min={0} max={2000} warn={T.rpmWarn} crit={T.rpmCrit} icon={<RotateCw size={12} color={COLORS.orange} />} />
                                <SemicircularGauge label="Motor Current" value={r.motorCurrent} unit="A" min={0} max={6} warn={T.motorCurrentWarn} crit={T.motorCurrentCrit} decimals={2} icon={<Zap size={12} color={COLORS.orange} />} />
                            </div>
                        </div>

                        <div className="ms-actuator">
                            <div className="ms-actuator-head">
                                <span style={{ color:COLORS.slate }}><Droplets size={12} /> ACTUATOR 2 — EXTRACTION PUMP</span>
                                <em>{r.pumpStatus ?? "TELEMETRY"}</em>
                            </div>
                            <div className="ms-gauges g2">
                                <SemicircularGauge label="Pump Flow Rate" value={r.pumpFlow} unit="m³/h" min={0} max={10} warn={4.5} crit={5.5} icon={<Waves size={12} color={COLORS.slate} />} />
                                <SemicircularGauge label="Pump Current" value={r.pumpCurrent} unit="A" min={0} max={5} warn={3.5} crit={4.2} decimals={2} icon={<Zap size={12} color={COLORS.slate} />} />
                            </div>
                        </div>

                    </div>

                </section>

                <section className="ms-panel ms-span-5 ms-tall ms-loc-panel">

                    <div className="ms-location">

                        <MachineLocation3D
                            position={toLocalPosition(detail.values)}
                            trajectory={toTrajectory(h)}
                            distanceTravelledMetres={toLocalPosition(detail.values).distanceMetres}
                            orientation={{ rollDegrees: r.roll, pitchDegrees: r.pitch, yawDegrees: r.yaw }}
                            deviceId={detail.bot_id || detail.machine_code}
                            freshness={freshnessFromStatus(state, detail.age_seconds)}
                        />

                        {r.gpsLat !== undefined && r.gpsLng !== undefined && (
                            <LiveMap lat={r.gpsLat} lng={r.gpsLng} heading={r.heading} path={gpsPath(h)} />
                        )}

                    </div>

                </section>

            </div>

            {/* 3. SYSTEM LOAD + ALERTS */}
            <div className="ms-row">
                <div className="ms-span-6 ms-short"><SystemLoadCard load={load} /></div>
                <div className="ms-span-6 ms-short"><AlertsCard alerts={alerts} /></div>
            </div>

            <StatusStrip detail={detail} sourceLabel={sourceLabel} sourceColor={sourceColor} records={h.length} />

        </div>

    );

}
