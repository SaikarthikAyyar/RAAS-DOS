import { useEffect, useState } from "react";

import { getEnquiryApprovalStanding } from "../services/enquiryWorkspaceService";


// ====================================
// APPROVAL STANDING
// Shared by OpsReviewDecisionCard/QuoteCommercialSummary/
// CommercialApprovalSummary - fetches, for the current logged-in
// user, whether they hold real hub_approvers standing for this
// enquiry's hub. Returns null while loading (callers should fail
// closed - i.e. keep Approve disabled - until this resolves).
// ====================================

export default function useApprovalStanding(enquiryId, userId){

    const [standing, setStanding] = useState(null);

    useEffect(()=>{

        if(!enquiryId || !userId){
            setStanding(null);
            return;
        }

        let cancelled = false;

        getEnquiryApprovalStanding(enquiryId, userId)
            .then(data=>{
                if(!cancelled) setStanding(data);
            })
            .catch(()=>{
                if(!cancelled) setStanding(null);
            });

        return ()=>{ cancelled = true; };

    }, [enquiryId, userId]);

    return standing;

}
