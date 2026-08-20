// ====================================
// PO TAB — GUIDE CONTENT
// componentIds here must match the data-guide-id attributes placed in
// POSummary.jsx.
// ====================================

export const components = {

    "po-list": {
        title: "Uploaded Purchase Orders",
        explanation: "Lists whichever Purchase Order is currently on file for this enquiry. Only one PO can be on file at a time — the PO Number and PO Value shown here are always computed by the system from the released quote, never typed in by hand."
    },

    "po-upload": {
        title: "Upload PO",
        explanation: "Attaches the customer's Purchase Order document to this enquiry. Only available once the quote has actually been released to the customer, and only while no PO is currently on file."
    },

    "po-remove": {
        title: "Remove",
        explanation: "Deletes the currently uploaded PO so a replacement can be uploaded — for example if the wrong file was attached. Removing a PO never moves the enquiry backwards; it simply re-opens the upload option."
    },

    "po-proceed-job-creation": {
        title: "Proceed to Job Creation",
        explanation: "Advances the enquiry's stage to Job Creation once a real PO is on file. This button only moves the stage forward — it does not itself open the Job Creation screen or assign a fleet unit or crew; that happens separately once the case has reached the Job Creation stage."
    }

};

export const workflowSteps = [

    {
        componentId: "po-list",
        stepText: "Check what PO (if any) is currently on file for this enquiry."
    },

    {
        componentId: "po-upload",
        stepText: "Once the customer's quote has been released and their PO document is in hand, upload it here."
    },

    {
        componentId: "po-remove",
        stepText: "If the wrong file was uploaded, remove it — this clears the way to upload the correct one, without affecting the enquiry's stage."
    },

    {
        componentId: "po-proceed-job-creation",
        stepText: "With a real PO on file, click Proceed to Job Creation to move this case into the Job Creation stage of the workflow."
    }

];
