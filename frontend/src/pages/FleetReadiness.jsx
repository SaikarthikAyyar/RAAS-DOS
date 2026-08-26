import { useState, useEffect, useCallback, useMemo } from "react";

import "../components/businessMasters/BusinessMasters.css";

import {
    getFleetAvailabilityOverview,
    downloadFleetForecastXlsx,
    rescheduleFleetSchedule,
    cancelFleetSchedule
} from "../services/fleetUnitsService";

import { useAuth } from "../contexts/AuthContext";

import { buildActor } from "../utils/actor";

import { formatApiError } from "../utils/apiError";


const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DAY_HEADS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


// ====================================
// DATE HELPERS
// Real date-only arithmetic done in UTC epoch-days, so it never drifts
// a day from the browser's local timezone (the classic "YYYY-MM-DD"
// -> new Date() -> off-by-one-day bug).
// ====================================

function isoToUtc(iso){
    const [y, m, d] = iso.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
}

function utcToIso(t){
    const dt = new Date(t);
    return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

function addDaysIso(iso, n){
    return utcToIso(isoToUtc(iso) + n * 86400000);
}

function formatDate(value){
    if(!value) return "-";
    return value.slice(0, 10);
}


// ====================================
// DAY MAP
// One entry per day a booking occupies, so a calendar cell click can
// tell whether it landed on a booking's start day, its completion
// day, or a day in the middle.
// ====================================

function buildDayMap(queue){

    const map = {};

    for(const booking of queue){

        let cursor = isoToUtc(booking.planned_start);
        const endT = isoToUtc(booking.planned_completion);

        while(cursor <= endT){

            const iso = utcToIso(cursor);

            map[iso] = {
                booking,
                isStart: iso === booking.planned_start,
                isCompletion: iso === booking.planned_completion
            };

            cursor += 86400000;

        }

    }

    return map;

}


// ====================================
// CALENDAR GRID
// ====================================

function CalendarGrid({ year, month, dayMap, pendingAction, onDayClick }){

    const first = new Date(Date.UTC(year, month - 1, 1));
    const startDow = (first.getUTCDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

    const cells = [];

    for(let i = 0; i < startDow; i++){
        cells.push(<div className="calDay blank" key={`blank-${i}`}/>);
    }

    for(let d = 1; d <= daysInMonth; d++){

        const iso = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const info = dayMap[iso];

        let statusClass = "avail";
        let title = "Available";

        if(info){
            statusClass = info.booking.schedule_status === "ACTIVE" ? "block" : "plan";
            title = `${info.booking.customer_name || info.booking.site_location} (${info.booking.schedule_status})`;
        }

        const isPending = pendingAction && (
            (pendingAction.type === "start" && iso === pendingAction.originalStart) ||
            (pendingAction.type === "completion" && iso === pendingAction.originalCompletion)
        );

        cells.push(
            <div
                key={iso}
                className={`calDay ${statusClass}${isPending ? " pending-highlight" : ""}`}
                title={title}
                onClick={()=>onDayClick(iso, info)}
            >
                {d}
            </div>
        );

    }

    return(
        <div className="calWrap">
            {DAY_HEADS.map(d=>(<div className="calHead" key={d}>{d}</div>))}
            {cells}
        </div>
    );

}


// ====================================
// PAGE
// ====================================

export default function FleetReadiness(){

    const { user } = useAuth();

    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [exporting, setExporting] = useState(false);

    const [selectedUnitId, setSelectedUnitId] = useState(null);

    const today = new Date();
    const [calYear, setCalYear] = useState(today.getUTCFullYear());
    const [calMonth, setCalMonth] = useState(today.getUTCMonth() + 1);

    const [pendingAction, setPendingAction] = useState(null);
    const [actionError, setActionError] = useState("");

    const load = useCallback(async()=>{

        setLoading(true);
        setError("");

        try{

            const data = await getFleetAvailabilityOverview();
            setUnits(data ?? []);

            // Functional update so this always reads the CURRENT
            // selection, not whatever selectedUnitId was closed over
            // at mount time - load() is a stable useCallback (empty
            // deps) reused by reschedule/cancel, so a captured value
            // here would silently reset the view to the first unit
            // after every one of those actions.
            setSelectedUnitId(prev => prev ?? (data?.length ? data[0].id : null));

        }
        catch(err){
            console.error(err);
            setError("Unable to load Fleet & Availability.");
        }
        finally{
            setLoading(false);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{ load(); }, [load]);

    const selectedUnit = units.find(u=>u.id===selectedUnitId) || null;

    const dayMap = useMemo(()=>{
        return selectedUnit ? buildDayMap(selectedUnit.queue) : {};
    }, [selectedUnit]);

    function handleMonthShift(n){

        let m = calMonth + n;
        let y = calYear;

        if(m > 12){ m = 1; y += 1; }
        if(m < 1){ m = 12; y -= 1; }

        setCalMonth(m);
        setCalYear(y);

    }

    async function applyReschedule(scheduleId, newStart, newCompletion){

        setPendingAction(null);
        setActionError("");

        try{

            await rescheduleFleetSchedule(scheduleId, {
                planned_start: newStart,
                planned_completion: newCompletion,
                actor: buildActor(user)
            });

            await load();

        }
        catch(err){
            console.error(err);
            setActionError(formatApiError(err, "Unable to apply this change."));
        }

    }

    function handleDayClick(iso, info){

        setActionError("");

        // ---- a new date is being picked for a pending action ----
        if(pendingAction){

            if(pendingAction.type === "start"){

                const deltaDays = Math.round((isoToUtc(iso) - isoToUtc(pendingAction.originalStart)) / 86400000);
                const newCompletion = addDaysIso(pendingAction.originalCompletion, deltaDays);

                applyReschedule(pendingAction.scheduleId, iso, newCompletion);

            }
            else{

                if(isoToUtc(iso) <= isoToUtc(pendingAction.originalStart)){
                    setActionError("The new completion date must be after the start date.");
                    return;
                }

                applyReschedule(pendingAction.scheduleId, pendingAction.originalStart, iso);

            }

            return;

        }

        // ---- nothing pending - a click on an occupied day may start a change ----
        if(!info){
            return;
        }

        const { booking, isStart, isCompletion } = info;

        if(booking.schedule_status !== "QUEUED"){

            if(isStart || isCompletion){
                window.alert("This booking is already active and can't be rescheduled from here.");
            }

            return;

        }

        if(isStart){

            const proceed = window.confirm(
                `Change the start date of the booking for "${booking.customer_name || booking.site_location}"?\n\nClick Yes, then click the calendar date you want it to start on instead. The job's duration stays the same.`
            );

            if(proceed){
                setPendingAction({
                    type: "start",
                    scheduleId: booking.id,
                    originalStart: booking.planned_start,
                    originalCompletion: booking.planned_completion
                });
            }

            return;

        }

        if(isCompletion){

            const proceed = window.confirm(
                `Change the duration (completion date) of the booking for "${booking.customer_name || booking.site_location}"?\n\nClick Yes, then click the calendar date you want it to complete on instead. It must be after the start date.`
            );

            if(proceed){
                setPendingAction({
                    type: "completion",
                    scheduleId: booking.id,
                    originalStart: booking.planned_start,
                    originalCompletion: booking.planned_completion
                });
            }

        }

    }

    async function handleCancelBooking(booking){

        if(!window.confirm(`Cancel the booking for "${booking.customer_name || booking.site_location}"?`)){
            return;
        }

        try{
            await cancelFleetSchedule(booking.id, buildActor(user), "Cancelled from Fleet & Availability calendar");
            await load();
        }
        catch(err){
            alert(formatApiError(err, "Unable to cancel this booking."));
        }

    }

    async function handleExportForecast(){

        setExporting(true);

        try{

            await downloadFleetForecastXlsx(13);

        }
        catch(err){
            console.error(err);
            alert("Unable to export the forecast.");
        }
        finally{
            setExporting(false);
        }

    }

    return(

        <div className="bm-module">

            <div className="bm-title">
                <div>
                    <h1>Fleet &amp; Availability</h1>
                    <p className="bm-muted">Machine and crew as one deployable unit - live, backed by the same booking mechanism Job Creation uses.</p>
                </div>

                <button className="bm-btn bm-btn-primary" onClick={handleExportForecast} disabled={exporting}>
                    {exporting ? "Exporting..." : "⬇ Export 3-Month Forecast"}
                </button>
            </div>

            {
                loading ? (
                    <p className="bm-muted">Loading...</p>
                ) : error ? (
                    <p className="bm-muted">{error}</p>
                ) : (

                    <>

                        <div className="bm-card" style={{marginBottom:14}}>

                            <h3>All fleet units</h3>

                            <div style={{maxHeight:280, overflowY:"auto", border:"1px solid #eee", borderRadius:8}}>

                                <table style={{marginBottom:0}}>
                                    <thead style={{position:"sticky", top:0, background:"#fff", zIndex:1}}>
                                        <tr>
                                            <th>Unit</th>
                                            <th>Machine</th>
                                            <th>Hub</th>
                                            <th>Current Location</th>
                                            <th>Crew</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {units.map(f=>(
                                            <tr key={f.id}>
                                                <td>{f.fleet_code}</td>
                                                <td>{f.machine_code}</td>
                                                <td>{f.hub_name || "-"}</td>
                                                <td>{f.current_location || "-"}</td>
                                                <td>{f.crew?.length ? f.crew.map(c=>c.full_name).join(", ") : "-"}</td>
                                                <td>
                                                    <span
                                                        className="bm-backlink"
                                                        style={{cursor:"pointer"}}
                                                        onClick={()=>{ setSelectedUnitId(f.id); setPendingAction(null); setActionError(""); }}
                                                    >
                                                        View calendar
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>

                        </div>

                        {
                            selectedUnit && (

                                <div className="bm-card">

                                    <h3>
                                        Calendar - {selectedUnit.fleet_code} ({selectedUnit.machine_code})
                                    </h3>

                                    <div style={{display:"flex", gap:8, alignItems:"center", marginBottom:6}}>
                                        <button className="bm-btn bm-btn-xs" onClick={()=>handleMonthShift(-1)}>&larr; Prev</button>
                                        <b>{MONTH_NAMES[calMonth - 1]} {calYear}</b>
                                        <button className="bm-btn bm-btn-xs" onClick={()=>handleMonthShift(1)}>Next &rarr;</button>

                                        {
                                            pendingAction && (
                                                <button
                                                    className="bm-btn bm-btn-xs bm-btn-ghost"
                                                    onClick={()=>{ setPendingAction(null); setActionError(""); }}
                                                >
                                                    Cancel change
                                                </button>
                                            )
                                        }
                                    </div>

                                    {actionError && <p className="bm-muted" style={{color:"#991b1b"}}>{actionError}</p>}

                                    {
                                        pendingAction && (
                                            <p className="bm-muted" style={{color:"#92400e"}}>
                                                {pendingAction.type==="start" ? "Pick the new start date on the calendar." : "Pick the new completion date on the calendar (must be after the start date)."}
                                            </p>
                                        )
                                    }

                                    <CalendarGrid
                                        year={calYear}
                                        month={calMonth}
                                        dayMap={dayMap}
                                        pendingAction={pendingAction}
                                        onDayClick={handleDayClick}
                                    />

                                    <p className="bm-muted" style={{marginTop:8}}>
                                        Green = Available &middot; Amber = Queued (booked, not yet started) &middot; Red = Active (in progress). Click a booking's first day to move its start date, or its last day to change its duration.
                                    </p>

                                    <h4 className="bm-muted" style={{marginTop:16}}>Current queue</h4>

                                    {
                                        selectedUnit.queue.length===0 ? (
                                            <p className="bm-muted">No bookings - available now.</p>
                                        ) : (

                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Pos</th>
                                                        <th>Customer</th>
                                                        <th>Site</th>
                                                        <th>Start</th>
                                                        <th>Completion</th>
                                                        <th>Status</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedUnit.queue.map(b=>(
                                                        <tr key={b.id}>
                                                            <td>{b.queue_position}</td>
                                                            <td>{b.customer_name || "-"}</td>
                                                            <td>{b.site_location}</td>
                                                            <td>{formatDate(b.planned_start)}</td>
                                                            <td>{formatDate(b.planned_completion)}</td>
                                                            <td>{b.schedule_status}</td>
                                                            <td>
                                                                {
                                                                    b.schedule_status==="QUEUED" && (
                                                                        <button className="bm-backlink" onClick={()=>handleCancelBooking(b)}>Cancel</button>
                                                                    )
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                        )
                                    }

                                </div>

                            )
                        }

                    </>

                )
            }

        </div>

    );

}
