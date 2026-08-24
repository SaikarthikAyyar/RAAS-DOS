import { Info } from "lucide-react";

// ====================================
// FIELD TOOLTIP
// A small "i" icon dropped next to a field label - hover reveals a
// brief explanation of what the field means/expects. CSS-only hover
// reveal (matches the existing `.enquiry-action-tooltip` pattern
// already used on icon buttons elsewhere in this app), not a portal -
// field tooltips are small and local to their own label, so no
// viewport-clamping/positioning logic is needed the way the guide
// module's click-triggered popovers require.
// ====================================

export default function FieldTooltip({ text }){

    if(!text){
        return null;
    }

    return(

        <span className="field-tooltip-wrap">

            <Info size={12} className="field-tooltip-icon" aria-hidden="true"/>

            <span className="field-tooltip-text" role="tooltip">
                {text}
            </span>

        </span>

    );

}
