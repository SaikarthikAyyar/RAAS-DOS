// ====================================
// MACHINE TELEMETRY HELPERS
// Mirrors how the Varaha IoT dashboard turns a raw packet into what it
// displays (same keys, same fallbacks, same alert thresholds), so a
// machine reads the same here as it does there. Everything is derived
// from the packet's flat key/value set - nothing is stored.
// ====================================

// Alert / gauge thresholds - identical to the Varaha dashboard defaults.
export const THRESHOLDS = {
    motorTempWarn: 44.0, motorTempCrit: 46.5,
    motorCurrentWarn: 3.6, motorCurrentCrit: 4.2,
    rpmWarn: 1750, rpmCrit: 1900,
    voltageWarnMin: 22.0, voltageCritMin: 18.0,
    tiltWarn: 6.5, tiltCrit: 11.0,
    pumpTempWarn: 35.0, pumpTempCrit: 42.0,
    pumpCurrentWarn: 3.5, pumpCurrentCrit: 4.2
};

// Rated currents the Varaha dashboard uses to derive load percentages.
const RATED_MOTOR_AMPS = 4.2;
const RATED_PUMP_AMPS = 3.8;


export function num(value){

    return typeof value === "number" && Number.isFinite(value) ? value : undefined;

}


// Flat packet -> the named readings the dashboards use.
export function readValues(values = {}){

    const motorRpm = num(values.motor_rpm);

    return {
        deviceStatus: values.device_status,
        motorStatus: typeof values.motor_status === "string" ? values.motor_status.toUpperCase() : undefined,
        direction: typeof values.direction === "string" ? values.direction : values.drive_direction,
        motorTemp: num(values.motor_temp),
        leftRpm: num(values.left_motor_rpm) ?? motorRpm,
        rightRpm: num(values.right_motor_rpm) ?? motorRpm,
        motorCurrent: num(values.motor_current) ?? num(values.bus_current),
        busVoltage: num(values.bus_voltage),
        pumpFlow: num(values.pump_flow_rate),
        pumpTemp: num(values.pump_temp),
        pumpCurrent: num(values.pump_current),
        pumpStatus: typeof values.pump_status === "string" ? values.pump_status.toUpperCase() : undefined,
        uptime: typeof values.system_uptime === "string" ? values.system_uptime : undefined,
        pitch: num(values.imu_pitch),
        roll: num(values.imu_roll),
        yaw: num(values.imu_yaw),
        accelX: num(values.imu_accel_x),
        accelY: num(values.imu_accel_y),
        accelZ: num(values.imu_accel_z),
        gpsLat: num(values.gps_lat),
        gpsLng: num(values.gps_lng),
        gpsAlt: num(values.gps_alt),
        speedMps: num(values.speed),
        heading: num(values.heading),
        satellites: num(values.satellites ?? values.sats),
        hdop: num(values.hdop ?? values.gps_hdop)
    };

}


// Same rule as the Varaha dashboard's SystemStatusRibbon.
export function machineHealth(r){

    const crit =
        (r.motorTemp !== undefined && r.motorTemp >= THRESHOLDS.motorTempCrit) ||
        (r.motorCurrent !== undefined && r.motorCurrent >= THRESHOLDS.motorCurrentCrit) ||
        (r.busVoltage !== undefined && r.busVoltage <= THRESHOLDS.voltageCritMin) ||
        (r.pumpTemp !== undefined && r.pumpTemp >= THRESHOLDS.pumpTempCrit) ||
        (r.pumpCurrent !== undefined && r.pumpCurrent >= THRESHOLDS.pumpCurrentCrit);

    const warn =
        (r.motorTemp !== undefined && r.motorTemp >= THRESHOLDS.motorTempWarn) ||
        (r.motorCurrent !== undefined && r.motorCurrent >= THRESHOLDS.motorCurrentWarn) ||
        (r.busVoltage !== undefined && r.busVoltage <= THRESHOLDS.voltageWarnMin) ||
        (r.pumpTemp !== undefined && r.pumpTemp >= THRESHOLDS.pumpTempWarn) ||
        (r.pumpCurrent !== undefined && r.pumpCurrent >= THRESHOLDS.pumpCurrentWarn);

    const hasData = [r.motorTemp, r.motorCurrent, r.busVoltage, r.pumpTemp, r.pumpCurrent].some(v=>v !== undefined)
        || r.motorStatus !== undefined;

    if(!hasData) return "nodata";
    if(crit) return "critical";
    if(warn) return "warning";
    return "nominal";

}


// System load, derived from rated currents exactly as the Varaha
// dashboard does (sensors/auxiliary only count while the device is on).
export function systemLoad(r, deviceOn){

    const drive = r.motorCurrent !== undefined ? Math.min(100, Math.round((r.motorCurrent / RATED_MOTOR_AMPS) * 100)) : undefined;
    const pump = r.pumpCurrent !== undefined ? Math.min(100, Math.round((r.pumpCurrent / RATED_PUMP_AMPS) * 100)) : undefined;
    const sensors = deviceOn ? 14 : undefined;
    const other = deviceOn ? 10 : undefined;

    const hasData = [drive, pump, sensors, other].some(v=>v !== undefined);

    const composite = hasData
        ? Math.round((drive ?? 0) * 0.4 + (pump ?? 0) * 0.35 + (sensors ?? 0) * 0.15 + (other ?? 0) * 0.1)
        : undefined;

    return { drive, pump, sensors, other, composite };

}


// Currently-open alerts from the latest reading (same limits and
// wording style as the Varaha alert engine).
export function buildAlerts(r, timestamp){

    const alerts = [];

    function high(id, title, description, value, warn, crit, unit){

        if(value === undefined) return;

        if(value >= crit) alerts.push({ id, severity:"critical", title, description, value, threshold:crit, unit, timestamp });
        else if(value >= warn) alerts.push({ id, severity:"warning", title, description, value, threshold:warn, unit, timestamp });

    }

    function low(id, title, description, value, warn, crit, unit){

        if(value === undefined) return;

        if(value <= crit) alerts.push({ id, severity:"critical", title, description, value, threshold:crit, unit, timestamp });
        else if(value <= warn) alerts.push({ id, severity:"warning", title, description, value, threshold:warn, unit, timestamp });

    }

    high("motor-temp", "Motor Temperature High", "Motor stator winding temperature exceeded safe thermal threshold.", r.motorTemp, THRESHOLDS.motorTempWarn, THRESHOLDS.motorTempCrit, "°C");
    high("motor-current", "Motor Current High", "Motor current is above the rated operating range.", r.motorCurrent, THRESHOLDS.motorCurrentWarn, THRESHOLDS.motorCurrentCrit, "A");

    const maxRpm = [r.leftRpm, r.rightRpm].filter(v=>v !== undefined);
    if(maxRpm.length) high("motor-rpm", "Motor RPM High", "Drive motor speed exceeded the safe operating limit.", Math.max(...maxRpm), THRESHOLDS.rpmWarn, THRESHOLDS.rpmCrit, "RPM");

    low("bus-voltage", "Bus Voltage Low", "Supply voltage to powertrain dropped below operating threshold.", r.busVoltage, THRESHOLDS.voltageWarnMin, THRESHOLDS.voltageCritMin, "V");

    const tilts = [r.pitch, r.roll].filter(v=>v !== undefined).map(Math.abs);
    if(tilts.length) high("tilt", "Machine Tilt High", "Machine inclination exceeded the safe operating angle.", Math.max(...tilts), THRESHOLDS.tiltWarn, THRESHOLDS.tiltCrit, "°");

    high("pump-temp", "Pump Temperature High", "Extraction pump casing temperature exceeded safe operating threshold.", r.pumpTemp, THRESHOLDS.pumpTempWarn, THRESHOLDS.pumpTempCrit, "°C");
    high("pump-current", "Pump Current High", "Extraction pump current is above the rated operating range.", r.pumpCurrent, THRESHOLDS.pumpCurrentWarn, THRESHOLDS.pumpCurrentCrit, "A");

    return alerts;

}


// history -> [{timestamp, value}] for the first key present in each record.
export function trend(history, keys, scale = 1){

    return (history || [])
        .map(h=>{
            const key = keys.find(k=>num(h.values?.[k]) !== undefined);
            return key ? { timestamp: h.timestamp, value: h.values[key] * scale } : null;
        })
        .filter(Boolean);

}


// ---- GPS distance (same haversine + 100 m jump filter as Varaha) ----

function haversine(lat1, lon1, lat2, lon2){

    const R = 6371e3;
    const p1 = lat1 * Math.PI / 180;
    const p2 = lat2 * Math.PI / 180;
    const dp = (lat2 - lat1) * Math.PI / 180;
    const dl = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

}


export function totalDistanceMetres(path){

    let total = 0;

    for(let i = 1; i < path.length; i++){
        const d = haversine(path[i-1][0], path[i-1][1], path[i][0], path[i][1]);
        if(d < 100) total += d;
    }

    return total;

}


export function gpsPath(history){

    return (history || [])
        .filter(h=>num(h.values?.gps_lat) !== undefined && num(h.values?.gps_lng) !== undefined)
        .map(h=>[h.values.gps_lat, h.values.gps_lng]);

}


export function formatAge(seconds){

    if(seconds === null || seconds === undefined || !Number.isFinite(seconds)) return "--";
    if(seconds < 1) return "Live now";
    if(seconds < 60) return `${Math.round(seconds)}s ago`;
    if(seconds < 3600) return `${Math.round(seconds / 60)}m ago`;
    if(seconds < 86400) return `${Math.round(seconds / 3600)}h ago`;
    return `${Math.round(seconds / 86400)}d ago`;

}


// ---- Inputs for the Varaha 3D Machine Location view ----
// Same key aliases the Varaha telemetry provider reads (imu_* included,
// so the orientation sensor drives the model).

function pick(values, keys){

    for(const key of keys){
        const v = num(values?.[key]);
        if(v !== undefined) return v;
    }

    return undefined;

}


export function toLocalPosition(values = {}){

    return {
        xMetres: pick(values, ["x_pos", "location_x", "locationX"]),
        yMetres: pick(values, ["y_pos", "location_y", "locationY"]),
        depthMetres: pick(values, ["z_depth", "location_z", "locationZ"]),
        headingDegrees: pick(values, ["heading"]),
        speedMps: pick(values, ["speed", "speed_mps", "speedMps"]),
        distanceMetres: pick(values, ["distance", "distance_m", "distance_metres", "distance_travelled"]),
        confidencePercent: pick(values, ["confidence", "signal_strength", "signalStrength"]),
        pitchDegrees: pick(values, ["pitch", "pitch_degrees", "imu_pitch"]),
        rollDegrees: pick(values, ["roll", "roll_degrees", "imu_roll"]),
        yawDegrees: pick(values, ["yaw", "yaw_degrees", "imu_yaw"]),
        accelerationX: pick(values, ["acceleration_x", "accel_x", "imu_accel_x"]),
        accelerationY: pick(values, ["acceleration_y", "accel_y", "imu_accel_y"]),
        accelerationZ: pick(values, ["acceleration_z", "accel_z", "imu_accel_z"])
    };

}


export function toTrajectory(history){

    return (history || [])
        .map(h=>{
            const p = toLocalPosition(h.values);
            if(p.xMetres === undefined || p.yMetres === undefined) return null;
            return {
                timestamp: h.timestamp,
                xMetres: p.xMetres,
                yMetres: p.yMetres,
                depthMetres: p.depthMetres ?? 0,
                headingDegrees: p.headingDegrees ?? 0,
                speedMps: p.speedMps ?? 0
            };
        })
        .filter(Boolean);

}
