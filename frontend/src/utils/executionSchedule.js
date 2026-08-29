// ====================================
// PLANNED START DATE GATE
// A pure date check, independent of current_phase/phase status -
// every job is scheduled against a real planned_start date, and
// nothing that records or advances execution should be usable before
// that date has genuinely arrived, regardless of what state the
// execution happens to be in. Viewing/preparing the route (Get
// Coordinates, Save Route) is deliberately NOT gated by this - only
// actions that record real progress or advance the workflow are.
// ====================================

export function isBeforePlannedStart(execution){

    if(!execution?.planned_start) return false;

    return new Date().toISOString().slice(0, 10) < execution.planned_start;

}
