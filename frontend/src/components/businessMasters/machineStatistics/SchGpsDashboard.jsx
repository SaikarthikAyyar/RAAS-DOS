import { COLORS, TimeSeriesChart, LiveMap } from "./TelemetryWidgets";

import { readValues, trend, gpsPath, totalDistanceMetres, formatAge } from "./machineTelemetry";


function StatBox({ label, value, unit, color }){

    const shown = value !== undefined && value !== null ? value : "--";

    return(

        <div className="ms-statbox">
            <span>{label}</span>
            <div>
                <b style={color ? { color } : undefined}>{shown}</b>
                {unit && value !== undefined && value !== null && <small>{unit}</small>}
            </div>
        </div>

    );

}


function InfoRow({ label, value, color }){

    return(

        <div className="ms-inforow">
            <span>{label}</span>
            <b style={color ? { color } : undefined}>{value !== undefined && value !== null ? value : "--"}</b>
        </div>

    );

}


// Varaha "SCH TRUCK GPS MONITORING" dashboard (used for SCH machines).
export default function SchGpsDashboard({ detail }){

    const r = readValues(detail.values);
    const h = detail.history;
    const state = detail.telemetry_status;

    const hasGps = r.gpsLat !== undefined && r.gpsLng !== undefined;
    const speedKmh = r.speedMps !== undefined ? (r.speedMps * 3.6).toFixed(1) : undefined;

    const path = gpsPath(h);
    const distanceM = totalDistanceMetres(path);
    const distanceKm = distanceM > 0 ? (distanceM / 1000).toFixed(2) : undefined;

    const isMoving = (r.speedMps ?? 0) > 0.5;
    const movement = !hasGps ? "UNKNOWN" : isMoving ? "MOVING" : "STOPPED";
    const movementColor = movement === "MOVING" ? COLORS.ok : movement === "STOPPED" ? COLORS.warn : COLORS.nodata;

    const fix = hasGps ? "FIX" : "NO FIX";
    const fixColor = hasGps ? COLORS.ok : COLORS.crit;

    const device = state === "live" ? { label:"DEVICE ONLINE", color:COLORS.ok }
        : state === "stale" ? { label:"DEVICE STALE", color:COLORS.warn }
        : { label:"DEVICE OFFLINE", color:COLORS.crit };

    const apiOk = !detail.error;

    const speedTrend = trend(h, ["speed"], 3.6);
    const headingTrend = trend(h, ["heading"]);
    const altitudeTrend = trend(h, ["gps_alt"]);

    const trends = [
        { title:"GPS SPEED", unit:"km/h", color:COLORS.orange, points:speedTrend },
        { title:"GPS HEADING", unit:"°", color:COLORS.warn, points:headingTrend },
        { title:"GPS ALTITUDE", unit:"m", color:COLORS.ok, points:altitudeTrend }
    ];

    return(

        <div className="ms-dash">

            {/* 1. INTERNAL HEADER */}
            <div className="ms-sch-head">

                <div className="ms-sch-id">
                    <div className="ms-sch-pin">📍</div>
                    <div>
                        <h1>SCH TRUCK GPS MONITORING</h1>
                        <p>{detail.bot_id || detail.machine_code}</p>
                    </div>
                </div>

                <div className="ms-sch-health">
                    <div className="ms-pills">
                        <span className="ms-pill-dot" style={{ color:device.color }}><i style={{ background:device.color }} />{device.label}</span>
                        <span className="ms-pill-dot" style={{ color:apiOk ? COLORS.orange : COLORS.crit }}><i style={{ background:apiOk ? COLORS.orange : COLORS.crit }} />{apiOk ? "TELEMETRY API CONNECTED" : "TELEMETRY API OFFLINE"}</span>
                    </div>
                    <div className="ms-sch-meta">
                        <span>LAST PACKET: <b>{formatAge(detail.age_seconds)}</b></span>
                        <span>RECORDS: <b>{h.length.toLocaleString()}</b></span>
                    </div>
                </div>

            </div>

            {/* 2. TOP KPI CARDS */}
            <div className="ms-kpis">
                <StatBox label="GPS STATUS" value={fix} color={fixColor} />
                <StatBox label="SPEED" value={speedKmh} unit="km/h" />
                <StatBox label="HEADING" value={r.heading} unit="°" />
                <StatBox label="SATELLITES" value={r.satellites} />
            </div>

            {/* 3. MAIN SPLIT (70/30) */}
            <div className="ms-sch-main">

                <div className="ms-sch-left">

                    <div className="ms-sch-map">
                        <LiveMap lat={r.gpsLat} lng={r.gpsLng} heading={r.heading} path={path} />
                    </div>

                    <div className="ms-panel ms-movement">
                        <h3 className="ms-cap">TRUCK MOVEMENT</h3>
                        <div className="ms-movement-grid">
                            <div className="ms-move-state">
                                <i style={{ background:movementColor }} />
                                <b style={{ color:movementColor }}>{movement}</b>
                            </div>
                            <div><span>Speed</span><b>{speedKmh !== undefined ? `${speedKmh} km/h` : "--"}</b></div>
                            <div><span>Distance</span><b>{distanceKm !== undefined ? `${distanceKm} km` : "--"}</b></div>
                        </div>
                    </div>

                </div>

                <div className="ms-sch-right">

                    <div className="ms-panel ms-gpsinfo">

                        <h3 className="ms-cap">GPS INFORMATION</h3>

                        {!hasGps ? (

                            <div className="ms-nogps">
                                <span>⦸</span>
                                <p>No valid GPS telemetry received.</p>
                                <small>Ensure sensor is online and has sky visibility.</small>
                            </div>

                        ) : (

                            <div className="ms-inforows">
                                <InfoRow label="STATUS" value={fix} color={fixColor} />
                                <InfoRow label="LATITUDE" value={r.gpsLat.toFixed(6)} />
                                <InfoRow label="LONGITUDE" value={r.gpsLng.toFixed(6)} />
                                <InfoRow label="ALTITUDE" value={r.gpsAlt !== undefined ? `${r.gpsAlt} m` : undefined} />
                                <InfoRow label="SPEED" value={speedKmh !== undefined ? `${speedKmh} km/h` : undefined} />
                                <InfoRow
                                    label="HEADING"
                                    value={
                                        <span>
                                            {r.heading !== undefined ? r.heading : "--"}°
                                            {r.heading !== undefined && <span style={{ display:"inline-block", marginLeft:6, color:COLORS.orange, transform:`rotate(${r.heading}deg)` }}>↑</span>}
                                        </span>
                                    }
                                />
                                <InfoRow label="SATELLITES" value={r.satellites} />
                                <InfoRow label="HDOP" value={r.hdop} />
                            </div>

                        )}

                    </div>

                </div>

            </div>

            {/* 4. BOTTOM TRENDS ROW */}
            <div className="ms-trends3">
                {trends.map(t=>(
                    <div key={t.title} className="ms-trend-box">
                        <TimeSeriesChart title={t.title} unit={t.unit} series={[{ name:t.title, color:t.color, points:t.points }]} />
                    </div>
                ))}
            </div>

        </div>

    );

}
