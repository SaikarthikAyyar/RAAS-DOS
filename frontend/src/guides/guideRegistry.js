// ====================================
// GUIDE REGISTRY
// Maps an Enquiry Workspace tab id (matches WorkflowTabs.jsx's own
// WORKFLOW_TABS ids exactly) to its guide content module. Only tabs
// with real, built content appear here - "audit" (the workspace's own
// Audit Trail tab, distinct from the global Audit Trail module) is
// still an unbuilt placeholder in WorkspaceContent.jsx, so it stays
// deliberately absent. "job-created" and "execution" were placeholders
// too when this registry was first built, but both are now real,
// fully working tabs, so their guides are included here. GuideTriggerIcon
// only renders when the active tab has an entry here.
// ====================================

import * as survey from "./enquiryWorkspace/surveyGuide";
import * as opsReview from "./enquiryWorkspace/opsReviewGuide";
import * as technoCommercialReview from "./enquiryWorkspace/technoCommercialReviewGuide";
import * as quoteCommercial from "./enquiryWorkspace/quoteCommercialGuide";
import * as commercialApproval from "./enquiryWorkspace/commercialApprovalGuide";
import * as po from "./enquiryWorkspace/poGuide";
import * as jobCreated from "./enquiryWorkspace/jobCreatedGuide";
import * as execution from "./enquiryWorkspace/executionGuide";

export const guideRegistry = {

    "survey": survey,
    "ops-review": opsReview,
    "techno-commercial-approval": technoCommercialReview,
    "quote-commercial": quoteCommercial,
    "commercial-approval": commercialApproval,
    "po": po,
    "job-created": jobCreated,
    "execution": execution

};

// Global anchors usable by any tab's tour (outside the tab content
// area itself - the Topbar's notification bell, the Sidebar's Audit
// Trail nav link). Not tab-scoped, so kept separate from the per-tab
// registry above.
export const globalComponents = {

    "notif-bell": {
        title: "Notification Bell",
        explanation: "Every important action in this workflow - a save, a decision, a ping - creates a notification here. Some notifications are broadcast to everyone; approval decisions and Request Approval pings are targeted only to the specific hub approvers who need to see them."
    },

    "nav-audit-trail": {
        title: "Audit Trail",
        explanation: "A full, permanent log of every tracked change across the app, including everything that happens in this workflow. Use it to see exactly who changed what, and when, for any case."
    }

};

export function getComponentContent(tabId, componentId){

    if(globalComponents[componentId]){
        return globalComponents[componentId];
    }

    return guideRegistry[tabId]?.components?.[componentId] || null;

}
