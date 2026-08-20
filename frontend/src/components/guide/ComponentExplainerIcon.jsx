import { useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

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
//
// The popover is rendered via a portal into document.body, positioned
// with `position:fixed` from the icon's own measured rect - NOT nested
// CSS-relative inside the icon's own wrapper. Several cards in this
// app (anything with a wide scrollable table) set `overflow:auto` on
// themselves, which silently clips any normally-nested absolutely-
// positioned child, including this popover, no matter which card the
// icon happens to sit inside. Portaling avoids that whole class of
// bug the same way SpotlightTour already avoids it for the tour card.
// ====================================

const GAP = 8;

export default function ComponentExplainerIcon({ tabId, componentId, floating }){

    const { openExplainerId, toggleExplainer } = useGuide();

    const iconRef = useRef(null);

    const popoverRef = useRef(null);

    const [popoverPosition, setPopoverPosition] = useState(null);

    const content = getComponentContent(tabId, componentId);

    const isOpen = openExplainerId === componentId;

    useEffect(() => {

        if(!isOpen){
            setPopoverPosition(null);
            return;
        }

        function computePosition(){

            const rect = iconRef.current?.getBoundingClientRect();

            if(!rect){
                return;
            }

            const width = 280;

            const left = Math.min(Math.max(GAP, rect.right - width), window.innerWidth - width - GAP);

            const top = Math.min(rect.bottom + GAP, window.innerHeight - GAP - 60);

            setPopoverPosition({ top, left, width });

        }

        computePosition();

        function handleOutsideClick(event){
            const clickedIcon = iconRef.current?.contains(event.target);
            const clickedPopover = popoverRef.current?.contains(event.target);
            if(!clickedIcon && !clickedPopover){
                toggleExplainer(componentId);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        window.addEventListener("resize", computePosition);
        window.addEventListener("scroll", computePosition, true);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            window.removeEventListener("resize", computePosition);
            window.removeEventListener("scroll", computePosition, true);
        };

    }, [isOpen, componentId, toggleExplainer]);

    if(!content){
        return null;
    }

    return(

        <span
            className={floating ? "guide-explainer-wrap guide-explainer-floating" : "guide-explainer-wrap"}
            ref={iconRef}
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
                isOpen && popoverPosition && createPortal(
                    <div
                        ref={popoverRef}
                        className="guide-explainer-popover-portal"
                        style={{ top: popoverPosition.top, left: popoverPosition.left, width: popoverPosition.width }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="guide-explainer-popover-title">{content.title}</div>
                        <div className="guide-explainer-popover-text">{content.explanation}</div>
                    </div>,
                    document.body
                )
            }

        </span>

    );

}
