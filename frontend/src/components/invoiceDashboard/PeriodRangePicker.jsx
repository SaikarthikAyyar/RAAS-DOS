// ====================================
// PERIOD RANGE PICKER
// A genuine, user-defined date range - the 5 buttons are quick-select
// shortcuts that populate the two date fields, not a fixed list the
// selection is locked to. Both fields stay freely editable to any
// custom range. Shared by the Revenue and Deployment tabs so a period
// picked on one carries the same meaning as on the other.
// ====================================

// Local date components only - never toISOString(), which converts
// through UTC and silently shifts the date by a day in any timezone
// ahead of UTC at local midnight (confirmed: this exact bug produced
// an off-by-one date in every preset for IST).
function toIso(d){
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function addDays(iso, n){
    const d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() + n);
    return toIso(d);
}

export const PRESETS = [
    {
        key: "this_month",
        label: "This month",
        range: ()=>{
            const today = new Date();
            const start = toIso(new Date(today.getFullYear(), today.getMonth(), 1));
            const end = toIso(new Date(today.getFullYear(), today.getMonth() + 1, 0));
            return [start, end];
        }
    },
    {
        key: "next_3_months",
        label: "3 months from now",
        range: ()=>{ const today = toIso(new Date()); return [today, addDays(today, 90)]; }
    },
    {
        key: "last_3_months",
        label: "Last 3 months",
        range: ()=>{ const today = toIso(new Date()); return [addDays(today, -90), today]; }
    },
    {
        key: "next_year",
        label: "A year from now",
        range: ()=>{ const today = toIso(new Date()); return [today, addDays(today, 365)]; }
    },
    {
        key: "last_year",
        label: "A year till now",
        range: ()=>{ const today = toIso(new Date()); return [addDays(today, -365), today]; }
    }
];


export default function PeriodRangePicker({ start, end, onChange }){

    return(

        <div style={{display:"flex", flexWrap:"wrap", gap:10, alignItems:"center"}}>

            <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
                {PRESETS.map(preset=>(
                    <button
                        key={preset.key}
                        type="button"
                        className="bm-btn bm-btn-xs"
                        onClick={()=>{
                            const [s, e] = preset.range();
                            onChange(s, e);
                        }}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            <div style={{display:"flex", gap:8, alignItems:"center", fontSize:11}}>
                <label style={{display:"flex", gap:4, alignItems:"center"}}>
                    From
                    <input
                        type="date"
                        value={start}
                        max={end}
                        onChange={e=>onChange(e.target.value, end)}
                    />
                </label>
                <label style={{display:"flex", gap:4, alignItems:"center"}}>
                    To
                    <input
                        type="date"
                        value={end}
                        min={start}
                        onChange={e=>onChange(start, e.target.value)}
                    />
                </label>
            </div>

        </div>

    );

}
