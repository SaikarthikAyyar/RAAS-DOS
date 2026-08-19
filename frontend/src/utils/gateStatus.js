import { STAGE_LABELS } from "../data/workflowStages";

// Same derivation POSummary.jsx already uses for its own stage-index
// gating - a plain ordered array from STAGE_LABELS' own key order,
// which matches the backend's real WorkflowStage sequence exactly.
const STAGE_ORDER = Object.keys(STAGE_LABELS);

// ====================================
// GATE STATUS
// Centralizes the "why is this decision button disabled" logic shared
// by every real approval gate (Ops Review, Quote & Commercial,
// Commercial Approval) - a button is only ever enabled when BOTH the
// enquiry is genuinely sitting at that gate's required stage right
// now, AND the logged-in user holds real hub-approver standing for
// it. Stage-wrong is checked first since it's the more informative
// failure (an approver with real standing still can't act on a case
// that hasn't reached - or has already moved past - their gate).
// ====================================

export function computeGateStatus(enquiry, requiredStage, standingFlag, gateLabel, hubName){

    if(!enquiry){
        return { canDecide: false, reason: null };
    }

    if(enquiry.stage !== requiredStage){

        const currentIndex = STAGE_ORDER.indexOf(enquiry.stage);
        const requiredIndex = STAGE_ORDER.indexOf(requiredStage);

        const requiredLabel = STAGE_LABELS[requiredStage] ?? requiredStage;
        const currentLabel = STAGE_LABELS[enquiry.stage] ?? enquiry.stage;

        const reason =
            currentIndex > requiredIndex
                ? `Already decided - this case has moved on to ${currentLabel}.`
                : `This case hasn't reached ${requiredLabel} yet - it's currently at ${currentLabel}.`;

        return { canDecide: false, reason };

    }

    if(standingFlag === null || standingFlag === undefined){
        return { canDecide: false, reason: "Checking approval standing..." };
    }

    if(!standingFlag){

        const reason = hubName
            ? `You do not have ${gateLabel ?? "this gate's"} approval standing for hub '${hubName}'.`
            : "This enquiry's hub could not be determined - approval standing cannot be verified.";

        return { canDecide: false, reason };

    }

    return { canDecide: true, reason: null };

}


// ====================================
// STAGE-ONLY STATUS (Phase 27)
// Gates the new "Request Approval" ping - unlike a real decision,
// anyone should be able to request approval (not just users who
// already hold standing), but only while the case is genuinely
// sitting at that gate's stage. Reuses the same stage-comparison
// logic as computeGateStatus above, just without the standing check.
// ====================================

export function computeStageOnly(enquiry, requiredStage){

    if(!enquiry){
        return { canRequest: false, reason: null };
    }

    if(enquiry.stage !== requiredStage){

        const currentIndex = STAGE_ORDER.indexOf(enquiry.stage);
        const requiredIndex = STAGE_ORDER.indexOf(requiredStage);

        const requiredLabel = STAGE_LABELS[requiredStage] ?? requiredStage;
        const currentLabel = STAGE_LABELS[enquiry.stage] ?? enquiry.stage;

        const reason =
            currentIndex > requiredIndex
                ? `Already decided - this case has moved on to ${currentLabel}.`
                : `This case hasn't reached ${requiredLabel} yet - it's currently at ${currentLabel}.`;

        return { canRequest: false, reason };

    }

    return { canRequest: true, reason: null };

}
