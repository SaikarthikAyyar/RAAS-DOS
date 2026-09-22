import { useEffect, useState } from "react";

import {
    getJobByEnquiry,
    saveJobCreation,
    updateJobCreation,
    confirmJobCreation
} from "../../../services/jobCreationService";

import {
    getFleetUnits,
    getFleetUnitQueue,
    getSchedulesForJob,
    bookFleetUnit,
    getFleetUnitKitOptions,
    updateScheduleKit,
    rescheduleFleetSchedule,
    cancelFleetSchedule,
    checkGeocode
} from "../../../services/fleetUnitsService";

import { buildActor } from "../../../utils/actor";

import { formatApiError } from "../../../utils/apiError";

import { STAGE_LABELS } from "../../../data/workflowStages";

import { useAuth } from "../../../contexts/AuthContext";

import ComponentExplainerIcon from "../../guide/ComponentExplainerIcon";

import KitPicker from "../../shared/KitPicker";

import { formatPumpList, formatAccessoryList } from "../../../utils/kitFormat";

const STAGE_ORDER = Object.keys(STAGE_LABELS);

function formatDate(value){
    if(!value) return "-";
    return value.slice(0, 10);
}


// ====================================
// COMPONENT
// One screen covers both halves of the old Job Creation / Allocation
// split: create the job (real planned dates, editable afterward via
// the same PUT this tab uses), then book a Fleet Unit against it -
// booking books the machine and every crew member together (Phase
// 33B). Eligible once the enquiry has reached PO_RECEIVED.
// ====================================

export default function JobCreationSummary({

    enquiry,

    reload

}){

    const { user, hasTask } = useAuth();

    const [jobInfo, setJobInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [creating, setCreating] = useState(false);

    const [plannedStart, setPlannedStart] = useState("");
    const [plannedCompletion, setPlannedCompletion] = useState("");
    const [savingDates, setSavingDates] = useState(false);

    const [schedule, setSchedule] = useState(null);
    const [fleetUnits, setFleetUnits] = useState([]);

    const [selectedFleetUnitId, setSelectedFleetUnitId] = useState("");
    const [queueDepth, setQueueDepth] = useState(null);
    const [siteLocation, setSiteLocation] = useState("");
    const [booking, setBooking] = useState(false);
    const [siteLocationWarning, setSiteLocationWarning] = useState("");
    const [checkingSiteLocation, setCheckingSiteLocation] = useState(false);

    const [rescheduleStart, setRescheduleStart] = useState("");
    const [rescheduleCompletion, setRescheduleCompletion] = useState("");
    const [rescheduling, setRescheduling] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const [confirming, setConfirming] = useState(false);

    // Pumps + accessories taken along (Phase 44). Options come from the
    // picked unit's machine type: compatible pumps only, all accessories,
    // accessory defaults from the job's Deployment Plan.
    const [kitOptions, setKitOptions] = useState(null);
    const [pumpIds, setPumpIds] = useState([]);
    const [accessoryIds, setAccessoryIds] = useState([]);

    const [editingKit, setEditingKit] = useState(false);
    const [editKitOptions, setEditKitOptions] = useState(null);
    const [editPumpIds, setEditPumpIds] = useState([]);
    const [editAccessoryIds, setEditAccessoryIds] = useState([]);
    const [savingKit, setSavingKit] = useState(false);

    async function load(){

        if(!enquiry?.id){
            return;
        }

        setLoading(true);
        setError("");

        try{

            const data = await getJobByEnquiry(enquiry.id);
            setJobInfo(data);

            if(data.job_exists){

                setPlannedStart(formatDate(data.planned_start));
                setPlannedCompletion(formatDate(data.planned_completion));

                const rows = await getSchedulesForJob(data.id);
                const active = (rows ?? []).find(r=>r.schedule_status!=="COMPLETED") || null;
                setSchedule(active);

                if(active){
                    setRescheduleStart(formatDate(active.planned_start));
                    setRescheduleCompletion(formatDate(active.planned_completion));
                }
                else{
                    setSiteLocation("");
                }

            }

        }
        catch(err){
            console.error(err);
            setError("Unable to load job details.");
        }
        finally{
            setLoading(false);
        }

    }

    useEffect(()=>{ load(); }, [enquiry?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{

        getFleetUnits().then(setFleetUnits).catch(err=>console.error(err));

    }, []);

    useEffect(()=>{

        if(!selectedFleetUnitId){
            setQueueDepth(null);
            return;
        }

        getFleetUnitQueue(selectedFleetUnitId)
            .then(rows=>setQueueDepth((rows ?? []).length))
            .catch(err=>console.error(err));

    }, [selectedFleetUnitId]);

    useEffect(()=>{

        setKitOptions(null);
        setPumpIds([]);
        setAccessoryIds([]);

        if(!selectedFleetUnitId){
            return;
        }

        getFleetUnitKitOptions(selectedFleetUnitId, jobInfo?.id)
            .then(options=>{
                setKitOptions(options);
                setAccessoryIds(options.default_accessory_ids || []);
                // Only one compatible pump - nothing to choose between.
                if(options.compatible_pumps?.length===1){
                    setPumpIds([options.compatible_pumps[0].id]);
                }
            })
            .catch(err=>{
                console.error(err);
                setError(formatApiError(err, "Unable to load pumps and accessories for this Fleet Unit."));
            });

    }, [selectedFleetUnitId, jobInfo?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    if(!enquiry?.id){

        return(

            <div className="survey-summary-grid">

                <div className="survey-summary-card">
                    <h3 className="survey-summary-title">Job Created</h3>
                    <p className="survey-empty">Nothing to show yet.</p>
                </div>

            </div>

        );

    }

    const stageIndex = STAGE_ORDER.indexOf(enquiry.stage);
    const poReceivedIndex = STAGE_ORDER.indexOf("PO_RECEIVED");
    const eligible = stageIndex >= poReceivedIndex;

    const jobCreationIndex = STAGE_ORDER.indexOf("JOB_CREATION");
    const jobCreationConfirmed = stageIndex >= jobCreationIndex;

    async function handleCreateJob(){

        setCreating(true);
        setError("");

        try{

            await saveJobCreation({ approval_board_id: jobInfo.approval_board_id });

            await load();
            reload?.();

        }
        catch(err){
            console.error(err);
            setError(formatApiError(err, "Unable to create the job."));
        }
        finally{
            setCreating(false);
        }

    }

    async function handleSaveDates(){

        setSavingDates(true);
        setError("");

        try{

            await updateJobCreation(jobInfo.id, {
                planned_start: plannedStart || null,
                planned_completion: plannedCompletion || null,
                actor: buildActor(user)
            });

            await load();
            reload?.();

        }
        catch(err){
            console.error(err);
            setError(formatApiError(err, "Unable to save planned dates."));
        }
        finally{
            setSavingDates(false);
        }

    }

    async function handleSiteLocationBlur(){

        const text = siteLocation.trim();

        if(!text){
            setSiteLocationWarning("");
            return;
        }

        setCheckingSiteLocation(true);

        try{
            const result = await checkGeocode(text);

            setSiteLocationWarning(
                result?.found
                    ? ""
                    : "Couldn't find coordinates for this location - the destination will need to be set manually on the Execution tab after booking."
            );
        }
        catch(err){
            // A failed check must never block typing/booking - just
            // leave whatever warning (or lack of one) was already
            // showing.
            console.error(err);
        }
        finally{
            setCheckingSiteLocation(false);
        }

    }

    async function handleBookFleetUnit(){

        if(!selectedFleetUnitId){
            setError("Pick a Fleet Unit first.");
            return;
        }

        if(!siteLocation.trim()){
            setError("Site location is required.");
            return;
        }

        if(kitOptions?.compatible_pumps?.length && pumpIds.length===0){
            setError("Select at least one compatible pump to take along.");
            return;
        }

        setBooking(true);
        setError("");

        try{

            const booked = await bookFleetUnit({
                job_id: jobInfo.id,
                fleet_unit_id: Number(selectedFleetUnitId),
                site_location: siteLocation.trim(),
                planned_start: plannedStart,
                planned_completion: plannedCompletion,
                pump_ids: pumpIds,
                accessory_ids: accessoryIds
            });

            await load();
            reload?.();

            if(booked?.destination_geocode_warning){
                alert(booked.destination_geocode_warning);
            }

        }
        catch(err){
            console.error(err);
            setError(formatApiError(err, "Unable to book this Fleet Unit."));
        }
        finally{
            setBooking(false);
        }

    }

    async function handleStartEditKit(){

        setError("");

        try{

            const options = await getFleetUnitKitOptions(schedule.fleet_unit_id, jobInfo?.id);

            setEditKitOptions(options);
            setEditPumpIds((schedule.pumps ?? []).map(p=>p.id));
            setEditAccessoryIds((schedule.accessories ?? []).map(a=>a.id));
            setEditingKit(true);

        }
        catch(err){
            console.error(err);
            setError(formatApiError(err, "Unable to load pumps and accessories."));
        }

    }

    async function handleSaveKit(){

        if(editKitOptions?.compatible_pumps?.length && editPumpIds.length===0){
            setError("Select at least one compatible pump to take along.");
            return;
        }

        setSavingKit(true);
        setError("");

        try{

            await updateScheduleKit(schedule.id, {
                pump_ids: editPumpIds,
                accessory_ids: editAccessoryIds,
                actor: buildActor(user)
            });

            setEditingKit(false);

            await load();
            reload?.();

        }
        catch(err){
            console.error(err);
            setError(formatApiError(err, "Unable to save pumps and accessories."));
        }
        finally{
            setSavingKit(false);
        }

    }

    async function handleReschedule(){

        setRescheduling(true);
        setError("");

        try{

            await rescheduleFleetSchedule(schedule.id, {
                planned_start: rescheduleStart,
                planned_completion: rescheduleCompletion,
                actor: buildActor(user)
            });

            await load();
            reload?.();

        }
        catch(err){
            console.error(err);
            setError(formatApiError(err, "Unable to reschedule this booking."));
        }
        finally{
            setRescheduling(false);
        }

    }

    async function handleConfirmJobCreation(){

        setConfirming(true);
        setError("");

        try{

            await confirmJobCreation(jobInfo.id);

            await load();
            reload?.();

        }
        catch(err){
            console.error(err);
            setError(formatApiError(err, "Unable to confirm Job Creation."));
        }
        finally{
            setConfirming(false);
        }

    }

    async function handleCancel(){

        if(!window.confirm("Cancel this Fleet Unit booking?")){
            return;
        }

        setCancelling(true);
        setError("");

        try{

            await cancelFleetSchedule(schedule.id, buildActor(user), "Cancelled from Job Created tab");

            await load();
            reload?.();

        }
        catch(err){
            console.error(err);
            setError(formatApiError(err, "Unable to cancel this booking."));
        }
        finally{
            setCancelling(false);
        }

    }

    const selectedUnit = fleetUnits.find(f=>String(f.id)===String(selectedFleetUnitId));
    const scheduledUnit = schedule ? fleetUnits.find(f=>f.id===schedule.fleet_unit_id) : null;

    return(

        <div className="survey-summary-grid">

            <div className="survey-summary-card" style={{gridColumn:"1 / -1"}}>

                <h3 className="survey-summary-title">
                    Job Created
                    <span className="workspace-header-pill gray" style={{marginLeft:8}}>
                        Stage: {STAGE_LABELS[enquiry.stage] || enquiry.stage}
                    </span>
                </h3>

                {error && <div className="survey-error" style={{marginTop:8}}>{error}</div>}

                {
                    loading ? (

                        <p className="survey-empty">Loading...</p>

                    ) : !eligible ? (

                        <p className="survey-empty">
                            Waiting on the PO to be received before a job can be created.
                        </p>

                    ) : !jobInfo?.job_exists ? (

                        <>
                            <p className="survey-empty">No job created yet for this enquiry.</p>

                            {hasTask("enquiry-tab-job-created", "create_job") && (
                                <div className="survey-actions" style={{marginTop:10}}>
                                    <button
                                        className="survey-action-button survey-action-button-orange"
                                        onClick={handleCreateJob}
                                        disabled={creating}
                                    >
                                        {creating ? "Creating..." : "Create Job"}
                                    </button>
                                </div>
                            )}
                        </>

                    ) : (

                        <>

                            <div data-guide-id="job-recommendation" style={{position:"relative"}}>

                            <ComponentExplainerIcon tabId="job-created" componentId="job-recommendation" floating/>

                            <h4 className="ops-subheading">
                                {jobInfo.generated_job_id}
                            </h4>

                            <table className="ops-scoring-table" style={{marginBottom:12}}>
                                <tbody>
                                    <tr>
                                        <td>Recommended machine</td>
                                        <td>{jobInfo.approved_machine || "-"}</td>
                                    </tr>
                                    <tr>
                                        <td>Service configuration</td>
                                        <td>{jobInfo.approved_service_configuration || "-"}</td>
                                    </tr>
                                    <tr>
                                        <td>Pump / hose package</td>
                                        <td>{jobInfo.approved_pump_package || "-"}</td>
                                    </tr>
                                </tbody>
                            </table>

                            </div>

                            <div data-guide-id="job-planned-dates" style={{position:"relative"}}>

                            <ComponentExplainerIcon tabId="job-created" componentId="job-planned-dates" floating/>

                            <div className="ops-override-form">

                                <label>
                                    Planned start
                                    <input
                                        type="date"
                                        value={plannedStart}
                                        onChange={e=>setPlannedStart(e.target.value)}
                                    />
                                </label>

                                <label>
                                    Planned completion
                                    <input
                                        type="date"
                                        value={plannedCompletion}
                                        onChange={e=>setPlannedCompletion(e.target.value)}
                                    />
                                </label>

                            </div>

                            {hasTask("enquiry-tab-job-created", "save_planned_dates") && (
                                <div className="survey-actions" style={{marginTop:8, marginBottom:16}}>
                                    <button
                                        className="survey-action-button"
                                        onClick={handleSaveDates}
                                        disabled={savingDates}
                                    >
                                        {savingDates ? "Saving..." : "Save planned dates"}
                                    </button>
                                </div>
                            )}

                            </div>

                            {
                                schedule ? (

                                    <>
                                        <div data-guide-id="job-fleet-summary" style={{position:"relative"}}>

                                        <ComponentExplainerIcon tabId="job-created" componentId="job-fleet-summary" floating/>

                                        <h4 className="ops-subheading">Fleet Unit booking</h4>

                                        <table className="ops-scoring-table" style={{marginBottom:12}}>
                                            <tbody>
                                                <tr>
                                                    <td>Fleet Unit</td>
                                                    <td>{scheduledUnit ? `${scheduledUnit.fleet_code} - ${scheduledUnit.fleet_name}` : schedule.fleet_unit_id}</td>
                                                </tr>
                                                <tr>
                                                    <td>Machines</td>
                                                    <td>
                                                        {
                                                            scheduledUnit?.machines?.length
                                                                ? scheduledUnit.machines.map(m=>`${m.machine_code} - ${m.machine_name}${m.role==="SUPPORT" ? " (support)" : ""}`).join(", ")
                                                                : (scheduledUnit?.machine_code ? `${scheduledUnit.machine_code} - ${scheduledUnit.machine_name}` : "-")
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Crew</td>
                                                    <td>{scheduledUnit?.crew?.length ? scheduledUnit.crew.map(c=>c.full_name).join(", ") : "-"}</td>
                                                </tr>
                                                <tr>
                                                    <td>Pumps taken along</td>
                                                    <td>{formatPumpList(schedule.pumps)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Accessories taken along</td>
                                                    <td>{formatAccessoryList(schedule.accessories)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Site</td>
                                                    <td>{schedule.site_location}</td>
                                                </tr>
                                                <tr>
                                                    <td>Queue position</td>
                                                    <td>{schedule.queue_position} ({schedule.schedule_status})</td>
                                                </tr>
                                                <tr>
                                                    <td>Dates</td>
                                                    <td>{formatDate(schedule.planned_start)} to {formatDate(schedule.planned_completion)}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        </div>

                                        {
                                            hasTask("enquiry-tab-job-created", "edit_fleet_kit") && (

                                                <div style={{marginBottom:12}}>

                                                    {
                                                        !editingKit ? (

                                                            <button
                                                                className="survey-action-button"
                                                                onClick={handleStartEditKit}
                                                            >
                                                                Edit pumps &amp; accessories
                                                            </button>

                                                        ) : (

                                                            <>

                                                                <p className="survey-empty" style={{marginBottom:8}}>
                                                                    {
                                                                        schedule.queue_position===1
                                                                            ? "This booking is live on the Fleet Unit - saving updates the unit's pumps and accessories right away."
                                                                            : "This booking is queued - the Fleet Unit takes these on once this booking becomes the live one."
                                                                    }
                                                                </p>

                                                                <KitPicker
                                                                    options={editKitOptions}
                                                                    pumpIds={editPumpIds}
                                                                    onPumpIds={setEditPumpIds}
                                                                    accessoryIds={editAccessoryIds}
                                                                    onAccessoryIds={setEditAccessoryIds}
                                                                />

                                                                <div className="survey-actions" style={{marginTop:8}}>

                                                                    <button
                                                                        className="survey-action-button survey-action-button-orange"
                                                                        onClick={handleSaveKit}
                                                                        disabled={savingKit}
                                                                    >
                                                                        {savingKit ? "Saving..." : "Save pumps & accessories"}
                                                                    </button>

                                                                    <button
                                                                        className="survey-action-button survey-create-button"
                                                                        onClick={()=>setEditingKit(false)}
                                                                        disabled={savingKit}
                                                                    >
                                                                        Cancel
                                                                    </button>

                                                                </div>

                                                            </>

                                                        )
                                                    }

                                                </div>

                                            )
                                        }

                                        {
                                            jobCreationConfirmed ? (

                                                <p className="survey-empty" style={{marginBottom:12}}>
                                                    Job Creation confirmed - this case has moved on to {STAGE_LABELS[enquiry.stage] || enquiry.stage}.
                                                </p>

                                            ) : (

                                                hasTask("enquiry-tab-job-created", "confirm_job_creation") && (
                                                    <div className="survey-actions" style={{marginBottom:12}} data-guide-id="job-confirm">
                                                        <button
                                                            className="survey-action-button survey-action-button-orange"
                                                            onClick={handleConfirmJobCreation}
                                                            disabled={confirming}
                                                        >
                                                            {confirming ? "Confirming..." : "Confirm Job Creation"}
                                                        </button>

                                                        <ComponentExplainerIcon tabId="job-created" componentId="job-confirm"/>
                                                    </div>
                                                )

                                            )
                                        }

                                        {
                                            schedule.schedule_status==="QUEUED" && (

                                                <div data-guide-id="job-reschedule-cancel" style={{position:"relative"}}>

                                                <ComponentExplainerIcon tabId="job-created" componentId="job-reschedule-cancel" floating/>

                                                <div className="ops-override-form">

                                                        <label>
                                                            Reschedule start
                                                            <input
                                                                type="date"
                                                                value={rescheduleStart}
                                                                onChange={e=>setRescheduleStart(e.target.value)}
                                                            />
                                                        </label>

                                                        <label>
                                                            Reschedule completion
                                                            <input
                                                                type="date"
                                                                value={rescheduleCompletion}
                                                                onChange={e=>setRescheduleCompletion(e.target.value)}
                                                            />
                                                        </label>

                                                    </div>

                                                    <div className="survey-actions" style={{marginTop:8}}>

                                                        {hasTask("enquiry-tab-job-created", "reschedule_fleet_booking") && (
                                                            <button
                                                                className="survey-action-button"
                                                                onClick={handleReschedule}
                                                                disabled={rescheduling}
                                                            >
                                                                {rescheduling ? "Rescheduling..." : "Reschedule"}
                                                            </button>
                                                        )}

                                                        {hasTask("enquiry-tab-job-created", "cancel_fleet_booking") && (
                                                            <button
                                                                className="survey-action-button survey-action-button-orange"
                                                                onClick={handleCancel}
                                                                disabled={cancelling}
                                                            >
                                                                {cancelling ? "Cancelling..." : "Cancel booking"}
                                                            </button>
                                                        )}

                                                    </div>
                                                </div>

                                            )
                                        }

                                    </>

                                ) : (

                                    <div data-guide-id="job-fleet-booking" style={{position:"relative"}}>

                                        <ComponentExplainerIcon tabId="job-created" componentId="job-fleet-booking" floating/>

                                        <h4 className="ops-subheading">Book a Fleet Unit</h4>

                                        <p className="survey-empty" style={{marginBottom:8}}>
                                            Book a Fleet Unit before Job Creation can be confirmed.
                                        </p>

                                        <div className="ops-override-form">

                                            <label>
                                                Fleet Unit
                                                <select
                                                    value={selectedFleetUnitId}
                                                    onChange={e=>setSelectedFleetUnitId(e.target.value)}
                                                >
                                                    <option value="">— Select a Fleet Unit —</option>
                                                    {fleetUnits.filter(f=>f.active).map(f=>(
                                                        <option key={f.id} value={f.id}>
                                                            {f.fleet_code} - {f.fleet_name}
                                                            {f.machines?.length ? ` (${f.machines.map(m=>m.machine_code).join(", ")})` : ""}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>

                                            <label>
                                                Site location
                                                <input
                                                    value={siteLocation}
                                                    onChange={e=>{
                                                        setSiteLocation(e.target.value);
                                                        if(siteLocationWarning) setSiteLocationWarning("");
                                                    }}
                                                    onBlur={handleSiteLocationBlur}
                                                />
                                            </label>

                                        </div>

                                        {checkingSiteLocation && (
                                            <p className="survey-empty" style={{marginTop:4}}>Checking coordinates...</p>
                                        )}

                                        {!checkingSiteLocation && siteLocationWarning && (
                                            <p className="survey-empty" style={{marginTop:4, color:"var(--orange)"}}>
                                                ⚠ {siteLocationWarning}
                                            </p>
                                        )}

                                        {
                                            selectedUnit && (
                                                <p className="survey-empty" style={{marginTop:4}}>
                                                    {selectedUnit.crew?.length ? `Crew: ${selectedUnit.crew.map(c=>c.full_name).join(", ")}. ` : "No crew assigned yet. "}
                                                    {queueDepth===null ? "" : queueDepth===0 ? "This unit is free - booking will be immediate." : `This unit already has ${queueDepth} booking(s) ahead - this job will queue.`}
                                                </p>
                                            )
                                        }

                                        {
                                            selectedUnit && (

                                                <div style={{marginTop:10}}>

                                                    <KitPicker
                                                        options={kitOptions}
                                                        pumpIds={pumpIds}
                                                        onPumpIds={setPumpIds}
                                                        accessoryIds={accessoryIds}
                                                        onAccessoryIds={setAccessoryIds}
                                                    />

                                                    <p className="survey-empty" style={{marginTop:6}}>
                                                        Several pumps can travel with the machine so one can replace another if it breaks down.
                                                        Accessories start from this job's Deployment Plan and can still be changed later.
                                                        Once this booking is live these become the Fleet Unit's pumps and accessories until changed in Business Masters.
                                                    </p>

                                                </div>

                                            )
                                        }

                                        {hasTask("enquiry-tab-job-created", "book_fleet_unit") && (
                                            <div className="survey-actions" style={{marginTop:8}}>
                                                <button
                                                    className="survey-action-button survey-action-button-orange"
                                                    onClick={handleBookFleetUnit}
                                                    disabled={booking}
                                                >
                                                    {booking ? "Booking..." : "Book Fleet Unit"}
                                                </button>
                                            </div>
                                        )}

                                    </div>

                                )
                            }

                        </>

                    )
                }

            </div>

        </div>

    );

}
