import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { X, ChevronLeft, ChevronRight } from "lucide-react";

import "./Guide.css";

import { useGuide } from "../../contexts/GuideContext";

import { guideRegistry, getComponentContent } from "../../guides/guideRegistry";

// ====================================
// SPOTLIGHT TOUR
// The live workflow-explainer engine. While a tour is active, finds
// the current step's real DOM element via its data-guide-id attribute
// (the exact same attribute ComponentExplainerIcon's parent section
// carries), scrolls it into view, dims everything else, and shows a
// step card built from that SAME componentId's guide content plus the
// step's own extra framing text - so the tour can never describe
// something that isn't really on screen right now.
// ====================================

const GAP = 8;

function findTargetRect(componentId){

    const el = document.querySelector(`[data-guide-id="${componentId}"]`);

    if(!el){
        return null;
    }

    const rect = el.getBoundingClientRect();

    return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
    };

}

export default function SpotlightTour(){

    const { activeTourTabId, currentStepIndex, nextStep, prevStep, endTour } = useGuide();

    const [targetRect, setTargetRect] = useState(null);

    const cardRef = useRef(null);

    // The card's real rendered height varies a lot per step (some
    // explanations are much longer than others) - measured after each
    // render and used to clamp `top` so the Next/Back row can never
    // land below the viewport with no way to reach it. Starts null
    // (first paint uses the heuristic guess below), then gets
    // corrected via useLayoutEffect before the browser paints, so
    // there's no visible jump.
    const [measuredHeight, setMeasuredHeight] = useState(null);

    const steps = activeTourTabId ? guideRegistry[activeTourTabId]?.workflowSteps || [] : [];

    const step = steps[currentStepIndex];

    useEffect(() => {

        if(!activeTourTabId || !step){
            setTargetRect(null);
            return;
        }

        let cancelled = false;

        let attempts = 0;

        function locate(){

            if(cancelled){
                return;
            }

            const el = document.querySelector(`[data-guide-id="${step.componentId}"]`);

            if(el){
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                // Let the smooth scroll settle before measuring, so the
                // cutout lands on the element's resting position.
                setTimeout(() => {
                    if(!cancelled){
                        setTargetRect(findTargetRect(step.componentId));
                    }
                }, 350);
                return;
            }

            // The target may not be mounted yet right after a tab
            // switch (some cards render conditionally) - retry briefly
            // before giving up and showing the step centered, un-anchored.
            attempts += 1;
            if(attempts < 10){
                setTimeout(locate, 150);
            }
            else{
                setTargetRect(null);
            }

        }

        locate();

        function handleReposition(){
            setTargetRect(findTargetRect(step.componentId));
        }

        window.addEventListener("resize", handleReposition);
        window.addEventListener("scroll", handleReposition, true);

        return () => {
            cancelled = true;
            window.removeEventListener("resize", handleReposition);
            window.removeEventListener("scroll", handleReposition, true);
        };

    }, [activeTourTabId, currentStepIndex, step]);

    // Re-measure the card's real rendered height any time its content
    // changes (new step) or its anchor moves (new targetRect) - this is
    // what makes the top-position clamp below correct instead of a
    // guess, regardless of how long a given step's text turns out to be.
    useLayoutEffect(() => {

        setMeasuredHeight(cardRef.current?.getBoundingClientRect().height ?? null);

    }, [activeTourTabId, currentStepIndex, targetRect]);

    if(!activeTourTabId || !step){
        return null;
    }

    const content = getComponentContent(activeTourTabId, step.componentId);

    // First paint (before measuredHeight is known) uses this as a
    // rough guess just to pick above-vs-below; every paint after that
    // uses the real measured height, which is what actually guarantees
    // the whole card - including its Next/Back row - fits on screen.
    const effectiveHeight = measuredHeight ?? 220;

    const fitsBelow = targetRect
        ? targetRect.top + targetRect.height + GAP + effectiveHeight < window.innerHeight
        : false;

    const rawTop = targetRect
        ? (
            fitsBelow
                ? targetRect.top + targetRect.height + GAP
                : targetRect.top - GAP - effectiveHeight
        )
        : (window.innerHeight - effectiveHeight) / 2;

    // Hard clamp: whatever rawTop suggested, the card's full measured
    // height must still fit within [GAP, window.innerHeight - GAP] -
    // this is the actual fix, not just a preference.
    const clampedTop = Math.min(
        Math.max(GAP, rawTop),
        Math.max(GAP, window.innerHeight - effectiveHeight - GAP)
    );

    const cardPosition = {
        top: clampedTop,
        left: targetRect
            ? Math.min(Math.max(GAP, targetRect.left), window.innerWidth - 380)
            : Math.max(GAP, (window.innerWidth - 360) / 2)
    };

    return(

        <div className="guide-tour-root">

            {
                targetRect ? (
                    <>
                        <div className="guide-tour-dim" style={{ top: 0, left: 0, right: 0, height: Math.max(0, targetRect.top - GAP) }}/>
                        <div className="guide-tour-dim" style={{ top: targetRect.top + targetRect.height + GAP, left: 0, right: 0, bottom: 0 }}/>
                        <div className="guide-tour-dim" style={{ top: Math.max(0, targetRect.top - GAP), left: 0, width: Math.max(0, targetRect.left - GAP), height: targetRect.height + GAP * 2 }}/>
                        <div className="guide-tour-dim" style={{ top: Math.max(0, targetRect.top - GAP), left: targetRect.left + targetRect.width + GAP, right: 0, height: targetRect.height + GAP * 2 }}/>
                        <div
                            className="guide-tour-highlight-ring"
                            style={{
                                top: targetRect.top - GAP,
                                left: targetRect.left - GAP,
                                width: targetRect.width + GAP * 2,
                                height: targetRect.height + GAP * 2
                            }}
                        />
                    </>
                ) : (
                    <div className="guide-tour-dim" style={{ top: 0, left: 0, right: 0, bottom: 0 }}/>
                )
            }

            <div
                ref={cardRef}
                className="guide-tour-card"
                style={{ top: cardPosition.top, left: cardPosition.left }}
            >

                <div className="guide-tour-card-header">
                    <span className="guide-tour-step-counter">Step {currentStepIndex + 1} of {steps.length}</span>
                    <button type="button" className="guide-tour-close" aria-label="Close guide" onClick={endTour}>
                        <X size={16}/>
                    </button>
                </div>

                <div className="guide-tour-card-title">{content?.title || step.componentId}</div>

                {content?.explanation && <div className="guide-tour-card-text">{content.explanation}</div>}

                <div className="guide-tour-card-step-text">{step.stepText}</div>

                {!targetRect && (
                    <div className="guide-tour-card-note">
                        This part of the screen isn't visible right now (it may only appear in certain states) - the description above still applies.
                    </div>
                )}

                <div className="guide-tour-card-actions">
                    <button
                        type="button"
                        className="guide-tour-nav-btn"
                        onClick={prevStep}
                        disabled={currentStepIndex === 0}
                    >
                        <ChevronLeft size={14}/> Back
                    </button>
                    <button
                        type="button"
                        className="guide-tour-nav-btn guide-tour-nav-btn-primary"
                        onClick={() => nextStep(steps.length)}
                    >
                        {currentStepIndex === steps.length - 1 ? "Finish" : "Next"} <ChevronRight size={14}/>
                    </button>
                </div>

            </div>

        </div>

    );

}
