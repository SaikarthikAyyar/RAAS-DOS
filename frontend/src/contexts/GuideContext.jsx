import { createContext, useContext, useState } from "react";

// ====================================
// GUIDE CONTEXT
// Tracks the in-app guide's state: which tab's workflow tour (if any)
// is currently running, which step it's on, and which single
// component-explainer popover (if any) is currently toggled open.
// Deliberately holds no per-tab content itself - content lives in
// frontend/src/guides/guideRegistry.js, looked up by componentId at
// render time.
// ====================================

export const GuideContext = createContext();

export function GuideProvider({ children }){

    const [activeTourTabId, setActiveTourTabId] = useState(null);

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const [openExplainerId, setOpenExplainerId] = useState(null);

    function startTour(tabId){
        setActiveTourTabId(tabId);
        setCurrentStepIndex(0);
        setOpenExplainerId(null);
    }

    function endTour(){
        setActiveTourTabId(null);
        setCurrentStepIndex(0);
    }

    function nextStep(totalSteps){
        setCurrentStepIndex(previous => {
            const next = previous + 1;
            if(next >= totalSteps){
                setActiveTourTabId(null);
                return 0;
            }
            return next;
        });
    }

    function prevStep(){
        setCurrentStepIndex(previous => Math.max(0, previous - 1));
    }

    function toggleExplainer(componentId){
        setOpenExplainerId(previous => (previous === componentId ? null : componentId));
    }

    return(
        <GuideContext.Provider
            value={{
                activeTourTabId,
                currentStepIndex,
                openExplainerId,
                startTour,
                endTour,
                nextStep,
                prevStep,
                toggleExplainer
            }}
        >
            {children}
        </GuideContext.Provider>
    );

}

export function useGuide(){
    return useContext(GuideContext);
}
