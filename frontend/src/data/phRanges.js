// ====================================
// PH RANGE BY CONDITION
// Chemistry: neutral sits at exactly 7, acidic is below 7, alkaline
// (basic) is above 7. Shared by both of the Sales Survey's pH/
// Corrosiveness dropdowns (Section B's material_ph_condition and
// Section E's pump.ph_condition, both backed by the "ph" Lookup List)
// so the numeric range shows directly in the option text instead of a
// separate pH Min/Max field pair - the stored value itself stays the
// plain condition string ("Acidic"/"Low / Neutral"/"Alkaline"), only
// the displayed option label is decorated, so every existing consumer
// that compares against the plain string (Customer 360 asset profile
// prefill, Ops Engine scoring) is unaffected.
// ====================================

export const PH_RANGE_BY_CONDITION = {
    "Acidic": { min: 1, max: 6 },
    "Low / Neutral": { min: 7, max: 7 },
    "Alkaline": { min: 8, max: 14 }
};

export function formatPhOptionLabel(value){

    const range = PH_RANGE_BY_CONDITION[value];

    if(!range){
        return value;
    }

    const rangeText = range.min === range.max
        ? `pH ${range.min}`
        : `pH ${range.min}-${range.max}`;

    return `${value} (${rangeText})`;

}
