// ====================================
// SCROLL-TRIGGERED REVEAL
// Every "card"/"section" class across the app already carries a
// ui-reveal-slide mount animation (styles/layout.css) - this file is
// what turns "plays once at mount" into "plays the first time the
// element actually scrolls into view", sliding in from the left or
// right (alternating, card by card, as the page is scanned top to
// bottom) instead of just fading in place. Each selector below also
// has animation-play-state:paused in its own CSS file (holding it at
// the keyframe's opening frame indefinitely, since fill-mode is
// "backwards"); adding .ui-revealed here is what layout.css's single
// shared `.ui-revealed{ animation-play-state:running !important; }`
// rule resumes.
//
// A second, nested pass does the same thing one level down: every
// real <tr> inside a <table> gets its own scroll-triggered slide too
// (a plain CSS transition, not the animation/paused mechanism above),
// inheriting the SAME left/right direction as whichever card contains
// it via the --reveal-slide-x custom property. This is what makes a
// card taller than the viewport keep animating as a user scrolls
// through its own rows, instead of revealing as one static block the
// instant its top edge appears.
//
// No React hook, no per-component wiring - a component only needs one
// of the class names below (or a plain <table>), and gets the
// scroll-reveal automatically. A MutationObserver keeps picking up
// newly-mounted cards/rows as the user navigates/switches tabs,
// without needing this module imported anywhere except once, at app
// startup.
// ====================================

const REVEAL_SELECTOR = [

    ".bm-card",
    ".ovw-card",
    ".ovw-kpi",
    ".execution-card",
    ".survey-summary-card",
    ".administration-card",
    ".job-card",
    ".ops-card",
    ".quote-card",
    ".survey-card",
    ".quotes-card",
    ".allocation-card",
    ".audit-card",
    ".approval-card",
    ".dashboard-stat-card",
    ".dashboard-summary-card",
    ".workflow-card",
    ".invoice-summary-card",
    ".enquiry-card",
    ".ms-panel",
    ".ms-chart",
    ".ms-statbox",
    ".ms-strip",
    ".ms-ribbon",
    ".ms-sch-head",
    ".ms-machine-title",
    ".ui-fade-in"

].join(",");

// Besides real table rows, the Machine Statistics dashboards' inner
// tiles (gauges, ribbon cards, alerts, info rows, load bars) slide in
// the same nested way, so a tall dashboard panel keeps animating as it
// is scrolled through rather than revealing as one block.
const ROW_SELECTOR = [
    "table tbody tr",
    ".ms-gauge",
    ".ms-status-card",
    ".ms-alert",
    ".ms-inforow",
    ".ms-load-row"
].join(",");

const SLIDE_DISTANCE_PX = 90;
const ROW_STAGGER_MS = 40;
const ROW_STAGGER_STEPS = 8; // cycles rather than growing unbounded on a long table

let observer = null;
let pendingScan = false;
let cardIndex = 0;

function scanCards(root){

    (root || document).querySelectorAll(REVEAL_SELECTOR).forEach(el=>{

        if(el.classList.contains("ui-revealed")) return;

        // Alternates left/right as the page is scanned top to bottom,
        // so consecutive cards visibly arrive from opposite sides.
        // Inherited by any .ui-row-reveal rows nested inside this card.
        if(!el.style.getPropertyValue("--reveal-slide-x")){
            const sign = cardIndex % 2 === 0 ? -1 : 1;
            el.style.setProperty("--reveal-slide-x", `${sign * SLIDE_DISTANCE_PX}px`);
            cardIndex += 1;
        }

        if(observer){
            observer.observe(el);
        }
        else{
            // No IntersectionObserver support - real content must
            // never stay permanently invisible, so reveal immediately.
            el.classList.add("ui-revealed");
        }

    });

}

function scanRows(root){

    (root || document).querySelectorAll(ROW_SELECTOR).forEach((row, i)=>{

        if(row.classList.contains("ui-row-reveal")) return;

        row.classList.add("ui-row-reveal");
        row.style.setProperty("--reveal-row-delay", `${(i % ROW_STAGGER_STEPS) * ROW_STAGGER_MS}ms`);

        if(observer){
            observer.observe(row);
        }
        else{
            row.classList.add("ui-revealed");
        }

    });

}

function scan(root){
    scanCards(root);
    scanRows(root);
}

function scheduleScan(root){

    if(pendingScan) return;

    pendingScan = true;

    requestAnimationFrame(()=>{
        pendingScan = false;
        scan(root);
    });

}

export function initScrollReveal(){

    if(typeof window === "undefined"){
        return;
    }

    if(!("IntersectionObserver" in window)){
        scan();
        return;
    }

    observer = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){
                entry.target.classList.add("ui-revealed");
                observer.unobserve(entry.target);
            }

        });

    }, { threshold:0.1, rootMargin:"0px 0px -30px 0px" });

    scan();

    // React mounts/unmounts cards and rows constantly (tab switches,
    // reloaded lists, a newly-opened workspace) - this is what catches
    // every one of those without needing a scroll-reveal hook wired
    // into each component individually.
    const mutationObserver = new MutationObserver(()=>{
        scheduleScan();
    });

    mutationObserver.observe(document.body, { childList:true, subtree:true });

}
