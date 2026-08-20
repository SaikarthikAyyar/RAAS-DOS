import { useEffect, useRef } from "react";

import { Info } from "lucide-react";

import { useGuide } from "../../contexts/GuideContext";

import { getComponentContent } from "../../guides/guideRegistry";

// ====================================
// COMPONENT EXPLAINER ICON
// A small, always-available "i" icon placed inside a section's header.
// Click toggles a popover showing that section's guide content -
// completely independent of whether a workflow tour is running. Uses
// the SAME componentId/content the SpotlightTour pulls from for its
// matching step, so there is only ever one place this text is written.
// ====================================

export default function ComponentExplainerIcon({ tabId, componentId, floating }){

    const { openExplainerId, toggleExplainer } = useGuide();

    const wrapRef = useRef(null);

    const content = getComponentContent(tabId, componentId);

    const isOpen = openExplainerId === componentId;

    useEffect(() => {

        if(!isOpen){
            return;
        }

        function handleOutsideClick(event){
            if(wrapRef.current && !wrapRef.current.contains(event.target)){
                toggleExplainer(componentId);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };

    }, [isOpen, componentId, toggleExplainer]);

    if(!content){
        return null;
    }

    return(

        <span
            className={floating ? "guide-explainer-wrap guide-explainer-floating" : "guide-explainer-wrap"}
            ref={wrapRef}
        >

            <button
                type="button"
                className="guide-explainer-icon"
                aria-label={`Explain: ${content.title}`}
                onClick={() => toggleExplainer(componentId)}
            >
                <Info size={14}/>
            </button>

            {
                isOpen && (
                    <div className="guide-explainer-popover" onClick={e => e.stopPropagation()}>
                        <div className="guide-explainer-popover-title">{content.title}</div>
                        <div className="guide-explainer-popover-text">{content.explanation}</div>
                    </div>
                )
            }

        </span>

    );

}
