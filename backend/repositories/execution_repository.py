# ====================================
# IMPORTS
# ====================================

from backend.models.execution import Execution

from backend.models.machine_schedule import MachineSchedule

from backend.models.machine_inventory import MachineInventory

from backend.models.invoice import Invoice

from datetime import date


# ====================================
# CREATE EXECUTION
# ====================================

def create_execution(

    db,

    payload

):

    execution = Execution(

        job_creation_id=
        payload.job_creation_id,

        customer_request_id=
        payload.customer_request_id,

        sales_survey_id=
        payload.sales_survey_id,

        workflow_status=
        payload.workflow_status,

        current_phase=
        payload.current_phase,

        phase_1_status=
        payload.phase_1_status,

        phase_2_status=
        payload.phase_2_status,

        phase_3_status=
        payload.phase_3_status,

        site_location=
        payload.site_location,

        planned_start=
        payload.planned_start,

        estimated_completion=
        payload.estimated_completion,

        execution_progress=
        payload.execution_progress,

        delay_days=
        payload.delay_days,

        current_activity=
        payload.current_activity,

        transport_status=
        payload.transport_status,

        invoice_synced=
        payload.invoice_synced,

        actual_completion=
        payload.actual_completion,

        remarks=
        payload.remarks,

        latitude = None,

        longitude = None,

        speed_kmph = 0,

        heading = 0,

        altitude = 0,

        accuracy_meters = 0,

        gps_timestamp = None,

        last_update_source = "OPS",

        eta_minutes = 0,

        distance_remaining_km = 0,

        today_output = 0,

        total_output = 0,

        daily_target = 0,

        output_unit = "m³",

        proof_uploaded = False



    )

    db.add(

        execution

    )

    db.commit()

    db.refresh(

        execution

    )

    return execution


# ====================================
# GET EXECUTION
# ====================================

def get_execution(

    db,

    execution_id

):

    return (

        db.query(

            Execution

        )

        .filter(

            Execution.id == execution_id

        )

        .first()

    )


# ====================================
# GET EXECUTION BY JOB
# ====================================

def get_execution_by_job(

    db,

    job_creation_id

):

    return (

        db.query(

            Execution

        )

        .filter(

            Execution.job_creation_id == job_creation_id

        )

        .first()

    )


# ====================================
# UPDATE EXECUTION
# ====================================

def update_execution(

    db,

    execution

):

    db.commit()

    db.refresh(

        execution

    )

    return execution


# ====================================
# LIST EXECUTIONS
# ====================================

def list_executions(

    db

):

    return (

        db.query(

            Execution

        )

        .order_by(

            Execution.id

        )

        .all()

    )


# ====================================
# START PHASE
# ====================================

def start_phase(

    db,

    execution

):

    if execution.current_phase == "PHASE_1":

        execution.phase_1_status = "IN_PROGRESS"

        execution.current_activity = "Machine Mobilisation"

        execution.execution_progress = 10

        execution.transport_status = "IN_TRANSIT"

    elif execution.current_phase == "PHASE_2":

        execution.phase_2_status = "IN_PROGRESS"

        execution.current_activity = "Site Work In Progress"

        execution.execution_progress = 50


    elif execution.current_phase == "PHASE_3":

        execution.phase_3_status = "IN_PROGRESS"

        execution.current_activity = "Testing and Demobilisation"

        execution.execution_progress = 90

    # ====================================
    # ACTIVATE MACHINE SCHEDULE
    # ====================================




    active_schedule = (

        db.query(

            MachineSchedule

        )

        .filter(

            MachineSchedule.job_creation_id == execution.job_creation_id,

            MachineSchedule.queue_position == 1

        )

        .first()

    )

    if active_schedule:

        active_schedule.schedule_status = "ACTIVE"

        machine = (

            db.query(

                MachineInventory

            )

            .filter(

                MachineInventory.id == active_schedule.machine_id

            )

            .first()

        )

        if machine:

            machine.status = "ALLOCATED"

            machine.current_job_id = execution.job_creation_id

            machine.current_site = active_schedule.site_location

    invoice = (

        db.query(

            Invoice

        )

        .filter(

            Invoice.job_creation_id ==

            execution.job_creation_id

        )

        .first()

    )



    if invoice:

        invoice.execution_phase = execution.current_phase

        invoice.execution_progress = execution.execution_progress

        invoice.customer_visible_status = execution.current_activity

        invoice.current_activity = execution.current_activity

        invoice.transport_status = execution.transport_status

    execution.last_updated = date.today()

    db.commit()

    db.refresh(

        execution

    )

    return execution


# ====================================
# COMPLETE CURRENT PHASE
# ====================================

def complete_phase(

    db,

    execution

):

    if execution.current_phase == "PHASE_1":

        execution.phase_1_status = "COMPLETED"

        execution.current_phase = "PHASE_2"

    elif execution.current_phase == "PHASE_2":

        execution.phase_2_status = "COMPLETED"

        execution.current_phase = "PHASE_3"

    elif execution.current_phase == "PHASE_3":

        execution.phase_3_status = "COMPLETED"

        execution.workflow_status = "EXECUTION_COMPLETED"

        execution.execution_progress = 100

        execution.current_activity = "Execution Completed"

        execution.transport_status = "COMPLETED"

        execution.actual_completion = date.today()


        schedules = (

            db.query(

                MachineSchedule

            )

            .filter(

                MachineSchedule.job_creation_id ==

                execution.job_creation_id

            )

            .all()

        )

        for schedule in schedules:

            schedule.schedule_status = "COMPLETED"

            machine = (

                db.query(

                    MachineInventory

                )

                .filter(

                    MachineInventory.id ==

                    schedule.machine_id

                )

                .first()

            )

            if machine:


                next_schedule = (

                    db.query(

                        MachineSchedule

                    )

                    .filter(

                        MachineSchedule.machine_id == machine.id,

                        MachineSchedule.schedule_status == "QUEUED"

                    )

                    .order_by(

                        MachineSchedule.queue_position

                    )

                    .first()

                )

                if next_schedule:

                    next_schedule.schedule_status = "ACTIVE"

                    machine.status = "ALLOCATED"

                    machine.current_job_id = next_schedule.job_creation_id

                    machine.current_site = next_schedule.site_location

                else:

                    machine.status = "AVAILABLE"

                    machine.current_job_id = None


                machine.queue_count = max(

                    machine.queue_count - 1,

                    0

                )

        invoice = (

            db.query(

                Invoice

            )

            .filter(

                Invoice.job_creation_id ==

                execution.job_creation_id

            )

            .first()

        )

        if invoice:

            invoice.execution_progress = 100

            invoice.execution_phase = "COMPLETED"

            invoice.invoice_status = "COMPLETED"

            invoice.customer_visible_status = "Job Completed"

            invoice.current_activity = "Execution Completed"

            invoice.transport_status = "COMPLETED"

    db.commit()

    db.refresh(

        execution

    )

    return execution