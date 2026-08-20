// ====================================
// SURVEY TAB — GUIDE CONTENT
// componentIds here must match the data-guide-id attributes placed in
// SurveySummary.jsx. See frontend/src/guides/guideRegistry.js for how
// this file is looked up.
// ====================================

export const components = {

    "survey-asset-profile": {
        title: "Asset Profile",
        explanation: "Shown only when this enquiry is linked to a site that has been surveyed before. It displays what is already known about that site — division, plant, department, asset name/type, cleaning frequency, and any material/access notes captured on a previous visit. This data comes from the Business Masters Customers module, not from this survey itself, and is a starting point rather than something you edit here."
    },

    "survey-details": {
        title: "Survey Details",
        explanation: "The read-only cards below (Customer Details, Job Details, Sludge Details, Geometry, Access & Setup, Safety, Pump Details, Dewatering, Customer Insights) show exactly what has been recorded on the actual Sales Survey for this enquiry. If no survey has been submitted yet, they instead show the prefilled values that will be offered when you do fill one in, drawn from the original Customer Request."
    },

    "survey-fill-edit": {
        title: "Fill / Edit Survey",
        explanation: "Opens the full Sales Survey form for this enquiry — prefilled from the Customer Request and, if a survey already exists, from that survey's own saved answers. Nothing on this Survey tab is directly editable; every value you see here is a read-only display of what was submitted through this form."
    },

    "survey-reminder": {
        title: "Survey Reminder",
        explanation: "A personal reminder you can set for yourself while this enquiry is sitting at the Survey stage — pick a duration and, once it elapses, you get a notification that this case is still waiting on its survey. It is a plain countdown from the moment you set it, not tied to how long the case has already been sitting idle. It only exists while the enquiry is at the Survey stage — moving past this stage cancels any reminder still running."
    },

    "survey-request-ops-review": {
        title: "Request Ops Review",
        explanation: "Moves this enquiry from Survey into Ops Review. It only becomes available once every compulsory field on the Sales Survey (Sections A, B and C) has been filled in — anything still missing keeps this button disabled with an explanation of what is left. Clicking it also automatically runs the recommendation algorithm for you if nobody has opened the Ops Selector for this case yet, so you do not have to do that as a separate step."
    }

};

export const workflowSteps = [

    {
        componentId: "survey-details",
        stepText: "Start by checking what is already known about this site — the Asset Profile (if this site has been surveyed before) and the Survey Details cards below it. This is read-only context, not something to fill in on this tab."
    },

    {
        componentId: "survey-fill-edit",
        stepText: "Click Fill Survey (or Edit Survey, if one already exists) to open the actual survey form and record what was found at the site. This is the only place the underlying data changes — everything on this tab is just a read-only view of what gets saved there."
    },

    {
        componentId: "survey-reminder",
        stepText: "Optional: if you are not able to complete the survey right away, set a reminder here so you get pinged after a chosen amount of time. It disappears automatically the moment the case moves past this stage."
    },

    {
        componentId: "survey-request-ops-review",
        stepText: "Once every compulsory field is filled in, click Request Ops Review. This both runs the recommendation algorithm (if it hasn't already run) and advances the case to the Ops Review stage in one action. Every user's notification bell 🔔 and the Audit Trail record this transition, since it changes which stage the enquiry is at."
    }

];
