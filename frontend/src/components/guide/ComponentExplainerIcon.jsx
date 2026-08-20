import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
//
// Position is corrected in two passes, same technique as
// SpotlightTour's step card: paint once at a rough guess, measure the
// popover's REAL rendered height (which varies a lot with how long a
// given explanation is), then clamp so the whole popover - not just
// its title - always stays inside the viewport, flipping above the
// icon when there isn't room below.
// ====================================

const GAP = 8;
const WIDTH = 280;

export default function ComponentExplainerIcon({ tabId, componentId, floating }){

    const { openExplainerId, toggleExplainer } = useGuide();

    const iconRef = useRef(null);

    const popoverRef = useRef(null);

    const [popoverPosition, setPopoverPosition] = useState(null);

    const content = getComponentContent(tabId, componentId);

    const isOpen = openExplainerId === componentId;

    // First-pass placement, before the popover's real height is known -
    // corrected by the measuring effect below on the very next paint.
    useEffect(() => {

        if(!isOpen){
            setPopoverPosition(null);
            return;
        }

        function computeRoughPosition(){

            const rect = iconRef.current?.getBoundingClientRect();

            if(!rect){
                return;
            }

            const left = Math.min(Math.max(GAP, rect.right - WIDTH), window.innerWidth - WIDTH - GAP);

            setPopoverPosition(previous => ({
                top: previous?.top ?? Math.min(rect.bottom + GAP, window.innerHeight - GAP - 40),
                left,
                width: WIDTH
            }));

        }

        computeRoughPosition();

        function handleOutsideClick(event){
            const clickedIcon = iconRef.current?.contains(event.target);
            const clickedPopover = popoverRef.current?.contains(event.target);
            if(!clickedIcon && !clickedPopover){
                toggleExplainer(componentId);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        window.addEventListener("resize", computeRoughPosition);
        window.addEventListener("scroll", computeRoughPosition, true);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            window.removeEventListener("resize", computeRoughPosition);
            window.removeEventListener("scroll", computeRoughPosition, true);
        };

    }, [isOpen, componentId, toggleExplainer]);

    // Second pass: now that the popover has actually rendered, measure
    // its real height and clamp - flip above the icon if there isn't
    // room below, then hard-clamp into the viewport either way. Runs
    // before paint (useLayoutEffect), so there's no visible jump.
    useLayoutEffect(() => {

        if(!isOpen || !popoverRef.current || !iconRef.current){
            return;
        }

        const iconRect = iconRef.current.getBoundingClientRect();

        const height = popoverRef.current.getBoundingClientRect().height;

        const fitsBelow = iconRect.bottom + GAP + height <= window.innerHeight - GAP;

        const rawTop = fitsBelow
            ? iconRect.bottom + GAP
            : iconRect.top - GAP - height;

        const clampedTop = Math.min(
            Math.max(GAP, rawTop),
            Math.max(GAP, window.innerHeight - height - GAP)
        );

        setPopoverPosition(previous => (
            previous && Math.abs(previous.top - clampedTop) < 0.5
                ? previous
                : { ...previous, top: clampedTop }
        ));

    });

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
