// ====================================
// JOB CREATED TAB — GUIDE CONTENT
// componentIds here must match the data-guide-id attributes placed in
// JobCreationSummary.jsx.
// ====================================

export const components = {

    "job-recommendation": {
        title: "Job Details",
        explanation: "A read-only summary of what Ops Review recommended for this job — the final machine, its service configuration, and the pump/hose package. These values are copied from the approved Ops Selection at the moment the job is created and are never edited from this tab."
    },

    "job-planned-dates": {
        title: "Planned Dates",
        explanation: "The job's estimated start and completion dates. They default to today plus the number of days Ops Review estimated for the whole job, and can be adjusted here at any time, including after a Fleet Unit has already been booked."
    },

    "job-fleet-booking": {
        title: "Book a Fleet Unit",
        explanation: "Assigns a real Fleet Unit — a specific machine bundled with its own crew — to this job. Booking assigns the machine and every crew member together in one action. If the chosen unit already has bookings ahead of it, this job queues behind them instead of starting immediately; the note under the form states which will happen before the booking is made."
    },

    "job-fleet-summary": {
        title: "Fleet Unit Booking",
        explanation: "The Fleet Unit currently booked to this job, its assigned crew, the site it's booked for, and its position in that unit's own queue. A booking at queue position 1 is that unit's active job; anything further back is waiting for the jobs ahead of it to finish first."
    },

    "job-confirm": {
        title: "Confirm Job Creation",
        explanation: "Advances the enquiry's stage to Job Creation. Only available once a real Fleet Unit booking exists — a job is not treated as genuinely ready until a machine and crew have actually been assigned to it, so this action stays hidden until that's done."
    },

    "job-reschedule-cancel": {
        title: "Reschedule / Cancel",
        explanation: "Reschedule changes this booking's dates without losing its place in the queue, checked against whatever is booked immediately before and after it on the same Fleet Unit. Cancel removes the booking entirely and closes the gap in the queue behind it. Both are only available while the booking is still Queued — once it becomes the unit's active job, neither action applies anymore."
    }

};

export const workflowSteps = [

    {
        componentId: "job-recommendation",
        stepText: "Once the enquiry has a PO on file, this tab starts by showing what Ops Review recommended for the job."
    },

    {
        componentId: "job-planned-dates",
        stepText: "Confirm or adjust the planned start and completion dates, then save them."
    },

    {
        componentId: "job-fleet-booking",
        stepText: "Pick a real Fleet Unit and a site location, then book it — this is the action that actually assigns a machine and crew to the job."
    },

    {
        componentId: "job-fleet-summary",
        stepText: "Once booked, this table shows exactly what was assigned and where it sits in that unit's own queue."
    },

    {
        componentId: "job-confirm",
        stepText: "With a Fleet Unit booked, confirm Job Creation to move the case into the Job Creation stage of the workflow."
    },

    {
        componentId: "job-reschedule-cancel",
        stepText: "While the booking is still queued, its dates can be adjusted or the booking cancelled entirely from here."
    }

];
