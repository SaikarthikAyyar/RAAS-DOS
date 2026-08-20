import { STAGE_LABELS } from "../../../data/workflowStages";

// ====================================
// AGING CARD
// Enquiries sitting 5+ days in their current stage - reuses the exact
// same aging computation the Enquiries list already displays
// (backend/utils/aging.py), not a separate calculation.
// ====================================

export default function AgingCard({ agingCases = [] }){

    return(

        <div className="ovw-card">

            <h3>Aging — 5+ days in stage</h3>

            {
                agingCases.length===0 ? (

                    <p className="ovw-empty">Nothing stuck right now.</p>

                ) : (

                    agingCases.map(c=>(

                        <div className="ovw-field-row" key={c.enquiry_id}>
                            <span>#{c.enquiry_id} — {c.customer_name || "-"} — {STAGE_LABELS[c.stage] || c.stage}</span>
                            <b>{c.aging_display}</b>
                        </div>

                    ))

                )
            }

        </div>

    );

}
