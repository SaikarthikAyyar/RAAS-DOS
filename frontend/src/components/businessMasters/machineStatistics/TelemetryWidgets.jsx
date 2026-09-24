import { useState, useEffect } from "react";

import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { CheckCircle2, Bell } from "lucide-react";


// Status colours are the same semantic set the Varaha dashboard uses
// (green nominal / amber warning / red critical), tuned for a light
// background; accents follow the RAAS-DOS palette.
export const COLORS = {
    orange: "#f58220",
    slate: "#475569",
    ok: "#16a34a",
    warn: "#d97706",
    crit: "#dc2626",
    nodata: "#9ca3af"
};

const STATUS_STYLE = {
    nodata: { label: "NO DATA", color: COLORS.nodata },
    nominal: { label: "NOMINAL", color: COLORS.ok },
    warning: { label: "WARNING", color: COLORS.warn },
    critical: { label: "CRITICAL", color: COLORS.crit }
};


// ====================================
// SEMICIRCULAR GAUGE (port of SemicircularGauge)
// ====================================

export function SemicircularGauge({ label, value, unit, min, max, warn, crit, decimals = 1, icon }){

    const hasData = typeof value === "number" && !Number.isNaN(value);

    const clamped = hasData ? Math.max(min, Math.min(max, value)) : min;
    const ratio = hasData && max > min ? (clamped - min) / (max - min) : 0;

    const warnRatio = warn !== undefined ? Math.max(0, Math.min(1, (warn - min) / (max - min))) : 0.75;
    const critRatio = crit !== undefined ? Math.max(warnRatio, Math.min(1, (crit - min) / (max - min))) : 0.9;

    const status = !hasData ? "nodata"
        : crit !== undefined && value >= crit ? "critical"
        : warn !== undefined && value >= warn ? "warning"
        : "nominal";

    const style = STATUS_STYLE[status];

    const cx = 110, cy = 100, r = 86, stroke = 11;

    const point = (t, radius = r)=>{
        const angle = Math.PI - t * Math.PI;
        return { x: cx + radius * Math.cos(angle), y: cy - radius * Math.sin(angle) };
    };

    const arc = (t1, t2)=>{
        const a = point(t1), b = point(t2);
        return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
    };

    const tip = point(ratio, r - 7);

    return(

        <article className="ms-gauge">

            <div className="ms-gauge-head">

                <div className="ms-gauge-label">{icon}<h3>{label}</h3></div>

                <span className="ms-badge" style={{ color:style.color, borderColor:style.color }}>{style.label}</span>

            </div>

            <div className="ms-gauge-body">

                <svg viewBox="0 0 220 122" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`${label} gauge`}>

                    <path d={arc(0,1)} fill="none" stroke="#e5e7eb" strokeWidth={stroke} strokeLinecap="round" />

                    {critRatio > warnRatio && (
                        <path d={arc(warnRatio, critRatio)} fill="none" stroke={COLORS.warn} strokeWidth={stroke} strokeOpacity={hasData ? 0.5 : 0.25} />
                    )}

                    <path d={arc(critRatio, 1)} fill="none" stroke={COLORS.crit} strokeWidth={stroke} strokeOpacity={hasData ? 0.6 : 0.25} strokeLinecap="round" />

                    {hasData && ratio > 0 && (
                        <path d={arc(0, ratio)} fill="none" stroke={style.color} strokeWidth={stroke} strokeLinecap="round" />
                    )}

                    {[0.125, 0.375, 0.625, 0.875].map(t=>{
                        const i = point(t, r - 7), o = point(t, r + 4);
                        return <line key={t} x1={i.x} y1={i.y} x2={o.x} y2={o.y} stroke="#cbd5e1" strokeWidth="1" />;
                    })}

                    {[0, 0.25, 0.5, 0.75, 1].map(t=>{
                        const i = point(t, r - 10), o = point(t, r + 6);
                        return <line key={t} x1={i.x} y1={i.y} x2={o.x} y2={o.y} stroke="#94a3b8" strokeWidth="1.8" />;
                    })}

                    {hasData && (
                        <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke={style.color} strokeWidth="2.8" strokeLinecap="round" />
                    )}

                    <circle cx={cx} cy={cy} r="6.5" fill="#fff" stroke={hasData ? style.color : "#cbd5e1"} strokeWidth="2" />
                    <circle cx={cx} cy={cy} r="2.4" fill="#1f2937" />

                    <text x={cx - r} y={cy + 16} textAnchor="start" fill="#6b7280" fontSize="9" fontWeight="bold" fontFamily="monospace">{min}</text>
                    <text x={cx} y={cy - r + 18} textAnchor="middle" fill="#9ca3af" fontSize="8" fontFamily="monospace">{((min + max) / 2).toFixed(0)}</text>
                    <text x={cx + r} y={cy + 16} textAnchor="end" fill="#6b7280" fontSize="9" fontWeight="bold" fontFamily="monospace">{max}</text>

                </svg>

            </div>

            <div className="ms-gauge-read">
                <span>{hasData ? value.toFixed(decimals) : "--"}</span>
                <small>{unit}</small>
            </div>

        </article>

    );

}


// ====================================
// STATUS RIBBON CARD (port of StatusCard)
// ====================================

const TONES = {
    emerald: COLORS.ok,
    amber: COLORS.warn,
    red: COLORS.crit,
    accent: COLORS.orange,
    slate: COLORS.slate,
    muted: "#1f2937"
};

export function StatusCard({ icon, label, value, tone = "muted", pulse = false, subtitle }){

    const color = TONES[tone] || TONES.muted;

    return(

        <div className="ms-status-card" style={{ borderColor: tone === "muted" ? undefined : `${color}55` }}>

            <div className="ms-status-left">

                {icon}

                <div>
                    <span className="ms-status-label">{label}</span>
                    {subtitle && <span className="ms-status-sub">{subtitle}</span>}
                </div>

            </div>

            <div className="ms-status-value" style={{ color }}>
                {pulse && <i className="ms-pulse" style={{ background:color }} />}
                {value}
            </div>

        </div>

    );

}


// ====================================
// TIME SERIES CHART (port of TimeSeriesChart, light theme)
// ====================================

const CH = { width: 400, height: 160, left: 42, right: 12, top: 12, bottom: 22 };

function fmtTime(ms){

    const d = new Date(ms);

    return Number.isNaN(d.getTime()) ? "" : d.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" });

}

export function TimeSeriesChart({ title, unit, series, height }){

    const [hover, setHover] = useState(null);

    const all = series.flatMap(s=>s.points);
    const primary = series[0]?.points ?? [];

    const stamps = all.map(p=>new Date(p.timestamp).getTime()).filter(t=>!Number.isNaN(t));
    const minT = stamps.length ? Math.min(...stamps) : 0;
    const maxT = stamps.length ? Math.max(...stamps) : minT + 1;

    const rawMin = all.length ? Math.min(...all.map(p=>p.value)) : 0;
    const rawMax = all.length ? Math.max(...all.map(p=>p.value)) : 10;
    const pad = Math.max((rawMax - rawMin) * 0.12, 0.5);
    const minV = Math.max(0, rawMin - pad);
    const maxV = rawMax + pad;
    const span = Math.max(0.01, maxV - minV);

    const w = CH.width - CH.left - CH.right;
    const h = CH.height - CH.top - CH.bottom;

    const x = t=>CH.left + ((t - minT) / Math.max(1, maxT - minT)) * w;
    const y = v=>CH.top + (1 - (v - minV) / span) * h;

    const yLabels = [maxV, minV + span * 0.5, minV];
    const xLabels = [
        { t:minT, anchor:"start", x:CH.left },
        { t:minT + (maxT - minT) / 2, anchor:"middle", x:CH.left + w / 2 },
        { t:maxT, anchor:"end", x:CH.width - CH.right }
    ];

    const latestSeries = series.find(s=>s.points.length > 0);
    const latest = latestSeries?.points.at(-1)?.value;

    const times = primary.map(p=>new Date(p.timestamp).getTime());
    const hoverTime = hover !== null ? times[hover] : undefined;

    return(

        <article className="ms-chart" style={height ? { height } : undefined}>

            <div className="ms-chart-head">

                <div className="ms-chart-title">
                    <h3>{title}</h3>
                    {latest !== undefined && <strong>{latest.toFixed(1)}</strong>}
                    <span>[{unit}]</span>
                </div>

                <div className="ms-legend">
                    {series.map((s, i)=>{
                        const last = s.points.length ? s.points[s.points.length - 1].value : undefined;
                        return(
                            <span key={i}>
                                <i style={{ background:s.color }} />
                                {s.name}
                                {series.length > 1 && last !== undefined && <b>{last.toFixed(1)}</b>}
                            </span>
                        );
                    })}
                </div>

            </div>

            <div className="ms-chart-plot">

                {all.length === 0 ? (

                    <div className="ms-nodata">
                        <span>NO DATA AVAILABLE</span>
                        <small>Waiting for telemetry stream...</small>
                    </div>

                ) : (

                    <svg
                        viewBox={`0 0 ${CH.width} ${CH.height}`}
                        preserveAspectRatio="none"
                        role="img"
                        aria-label={`${title} time-series chart`}
                        onMouseMove={e=>{
                            if(!primary.length) return;
                            const box = e.currentTarget.getBoundingClientRect();
                            const cx = ((e.clientX - box.left) / box.width) * CH.width;
                            const target = minT + ((cx - CH.left) / w) * (maxT - minT);
                            let best = 0, dist = Infinity;
                            times.forEach((t, i)=>{ const d = Math.abs(t - target); if(d < dist){ dist = d; best = i; } });
                            setHover(best);
                        }}
                        onMouseLeave={()=>setHover(null)}
                    >

                        <rect x={CH.left} y={CH.top} width={w} height={h} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.8" rx="2" />

                        <line x1={CH.left + w / 2} y1={CH.top} x2={CH.left + w / 2} y2={CH.top + h} stroke="#f1f5f9" strokeWidth="0.8" strokeDasharray="2 3" />

                        {yLabels.map((v, i)=>(
                            <g key={i}>
                                <line x1={CH.left} y1={y(v)} x2={CH.width - CH.right} y2={y(v)} stroke="#e2e8f0" strokeWidth="0.8" />
                                <text x={CH.left - 5} y={Math.min(CH.height - 10, Math.max(CH.top + 6, y(v) + 3))} textAnchor="end" fill="#475569" fontSize="8" fontWeight="500" fontFamily="monospace">
                                    {v >= 100 ? v.toFixed(0) : v.toFixed(1)}
                                </text>
                            </g>
                        ))}

                        {xLabels.map((l, i)=>(
                            <text key={i} x={l.x} y={CH.height - 4} textAnchor={l.anchor} fill="#475569" fontSize="8" fontWeight="500" fontFamily="monospace">{fmtTime(l.t)}</text>
                        ))}

                        {series.map((s, i)=>{
                            const pts = s.points.map(p=>({ x:x(new Date(p.timestamp).getTime()), y:y(p.value) }));
                            const str = pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
                            return(
                                <g key={i}>
                                    {pts.length === 1 && <circle cx={pts[0].x} cy={pts[0].y} r="2.5" fill={s.color} stroke="#fff" strokeWidth="1" />}
                                    {str && <polyline points={str} fill="none" stroke={s.color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />}
                                </g>
                            );
                        })}

                        {hover !== null && hoverTime !== undefined && (
                            <g>
                                <line x1={x(hoverTime)} y1={CH.top} x2={x(hoverTime)} y2={CH.top + h} stroke="#94a3b8" strokeDasharray="2 2" strokeWidth="0.8" />
                                {series.map((s, i)=>{
                                    const p = s.points[hover];
                                    return p ? <circle key={i} cx={x(hoverTime)} cy={y(p.value)} r="3" fill={s.color} stroke="#fff" strokeWidth="1.5" /> : null;
                                })}
                                <g transform={`translate(${Math.min(CH.width - 92, Math.max(CH.left + 2, x(hoverTime) - 44))}, ${CH.top + 4})`}>
                                    <rect width="88" height={12 + series.length * 11} fill="#fff" stroke="#cbd5e1" strokeWidth="0.8" rx="3" />
                                    {series.map((s, i)=>{
                                        const p = s.points[hover];
                                        return <text key={i} x="7" y={11 + i * 11} fill={s.color} fontSize="8" fontFamily="monospace" fontWeight="bold">{s.name.replace(" Motor","")}: {p ? p.value.toFixed(1) : "--"}</text>;
                                    })}
                                </g>
                            </g>
                        )}

                    </svg>

                )}

            </div>

        </article>

    );

}


// ====================================
// SYSTEM LOAD (port of SystemLoadWidget)
// ====================================

export function SystemLoadCard({ load }){

    const rows = [
        { label:"DRIVE LOAD", value:load.drive, color:COLORS.orange },
        { label:"PUMP LOAD", value:load.pump, color:COLORS.slate },
        { label:"SENSORS LOAD", value:load.sensors, color:COLORS.ok },
        { label:"AUXILIARY LOAD", value:load.other, color:"#818cf8" }
    ];

    const c = load.composite;
    const color = c === undefined ? COLORS.nodata : c >= 85 ? COLORS.crit : c >= 70 ? COLORS.warn : COLORS.ok;

    const size = 56, sw = 5.2, radius = (size - sw) / 2, circ = 2 * Math.PI * radius;
    const pct = c !== undefined ? Math.min(100, Math.max(0, c)) : 0;

    return(

        <article className="ms-panel">

            <div className="ms-panel-head">
                <h3>System Load</h3>
                <span className="ms-mono">{c !== undefined ? `${c}% ` : "-- % "}<small>{c !== undefined ? "COMPOSITE" : "NO DATA"}</small></span>
            </div>

            <div className="ms-load-body">

                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform:"rotate(-90deg)" }}>
                    <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={sw} />
                    {c !== undefined && (
                        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={`${(pct / 100) * circ} ${circ}`} strokeLinecap="round" />
                    )}
                </svg>

                <div className="ms-load-rows">
                    {rows.map(row=>(
                        <div key={row.label} className="ms-load-row">
                            <span>{row.label}</span>
                            <div className="ms-load-bar"><i style={{ width:`${row.value ?? 0}%`, background:row.color }} /></div>
                            <b>{row.value !== undefined ? `${row.value}%` : "--"}</b>
                        </div>
                    ))}
                </div>

            </div>

        </article>

    );

}


// ====================================
// ALERTS (port of AlertPanel)
// ====================================

export function AlertsCard({ alerts }){

    const crit = alerts.filter(a=>a.severity === "critical").length;
    const warn = alerts.filter(a=>a.severity === "warning").length;

    const badgeColor = crit ? COLORS.crit : warn ? COLORS.warn : COLORS.ok;

    return(

        <article className="ms-panel">

            <div className="ms-panel-head">

                <h3><Bell size={13} color={COLORS.warn} /> Alerts &amp; Alarms</h3>

                <span className="ms-badge" style={{ color:badgeColor, borderColor:badgeColor }}>
                    {crit ? `${crit} CRIT` : warn ? `${warn} WARN` : "NOMINAL"}
                </span>

            </div>

            <div className="ms-alert-list">

                {alerts.length === 0 ? (

                    <div className="ms-alert-ok"><CheckCircle2 size={16} /> All system parameters nominal</div>

                ) : alerts.map(a=>(

                    <div key={a.id} className={`ms-alert ${a.severity}`}>

                        <div className="ms-alert-top">
                            <div>
                                <span className="ms-alert-sev">{a.severity}</span>
                                <strong>{a.title}</strong>
                                <p>{a.description}</p>
                            </div>
                            <b>{a.value.toFixed(1)} {a.unit}</b>
                        </div>

                        <div className="ms-alert-foot">
                            <span>Limit: {a.threshold.toFixed(1)} {a.unit}</span>
                            <time>{a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : ""}</time>
                        </div>

                    </div>

                ))}

            </div>

        </article>

    );

}


// ====================================
// STATUS FOOTER STRIP (port of CompactStatusStrip)
// ====================================

export function StatusStrip({ detail, sourceLabel, sourceColor, records }){

    const seen = detail.last_seen ? new Date(detail.last_seen).toLocaleTimeString() : "--:--:--";

    return(

        <footer className="ms-strip">

            <div className="ms-strip-top">
                <span className="ms-strip-title">Telemetry Quality</span>
                <span>Source: <b style={{ color:sourceColor }}>{sourceLabel}</b></span>
                <span>Records: <b>{records}</b></span>
                <span>Sensor keys: <b>{Object.keys(detail.values).length}</b></span>
            </div>

            <div className="ms-strip-bottom">
                <span>DATA SOURCE: <b style={{ color:sourceColor }}>{sourceLabel}</b></span>
                <span>LAST UPDATE: <b>{seen}</b></span>
                <span>BOT: <b>{detail.bot_id || "—"}</b></span>
                <span className="ms-strip-brand">VARAHA IOT | INDUSTRIAL TELEMETRY &amp; SCADA PLATFORM</span>
            </div>

        </footer>

    );

}


// ====================================
// MAP (port of SCHMapWidget, light tiles)
// ====================================

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

function markerIcon(heading){

    const html = `<div style="transform:rotate(${heading ?? 0}deg);width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:${COLORS.orange};border-radius:50%;border:3px solid #fff;box-shadow:0 0 10px rgba(245,130,32,.55)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L12 22M12 2L6 8M12 2L18 8"/></svg></div>`;

    return L.divIcon({ html, className:"ms-marker", iconSize:[32,32], iconAnchor:[16,16] });

}

function Recenter({ lat, lng }){

    const map = useMap();

    useEffect(()=>{ map.setView([lat, lng]); }, [lat, lng, map]);

    return null;

}

export function LiveMap({ lat, lng, heading, path, title = "Live GPS Location" }){

    const hasGps = lat !== undefined && lng !== undefined;

    return(

        <div className="ms-map">

            <div className="ms-map-title"><i />{title}</div>

            {!hasGps && (
                <div className="ms-map-nofix">
                    <strong>NO GPS FIX</strong>
                    <span>Waiting for valid GPS position...</span>
                </div>
            )}

            <MapContainer center={hasGps ? [lat, lng] : [20.5937, 78.9629]} zoom={hasGps ? 17 : 4} zoomControl={false} className={`ms-map-canvas ${hasGps ? "" : "dim"}`}>

                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />

                {hasGps && (
                    <>
                        <Recenter lat={lat} lng={lng} />
                        {path.length > 1 && <Polyline positions={path} color={COLORS.orange} weight={3} opacity={0.7} />}
                        <Marker position={[lat, lng]} icon={markerIcon(heading)} />
                    </>
                )}

            </MapContainer>

        </div>

    );

}
