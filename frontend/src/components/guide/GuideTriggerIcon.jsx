import { Compass } from "lucide-react";

import { useGuide } from "../../contexts/GuideContext";

import { guideRegistry } from "../../guides/guideRegistry";

// ====================================
// GUIDE TRIGGER ICON
// One instance, rendered next to the Enquiry Workspace's tab strip.
// Starts the live spotlight tour for whichever tab is currently
// active. Only renders when that tab actually has guide content
// (job-created/execution/audit are still unbuilt placeholders with
// nothing real to tour through).
// ====================================

export default function GuideTriggerIcon({ activeTab }){

    const { startTour, activeTourTabId } = useGuide();

    if(!guideRegistry[activeTab]){
        return null;
    }

    return(

        <span className="guide-trigger-wrap">

            <button
                type="button"
                className="guide-trigger-icon"
                aria-label="Walk me through this tab"
                onClick={() => startTour(activeTab)}
                disabled={Boolean(activeTourTabId)}
            >
                <Compass size={16}/>
                <span>Guide me</span>
            </button>

            <span className="guide-trigger-tooltip">
                Walk me through this tab, step by step
            </span>

        </span>

    );

}
