import { STAGE_LABELS } from "../../../data/workflowStages";

// ====================================
// PIPELINE BY STAGE CARD
// Count of active enquiries per real WorkflowStage value, labeled via
// the same STAGE_LABELS map the Enquiries list already uses.
// ====================================

export default function PipelineByStageCard({ pipelineByStage = [] }){

    return(

        <div className="ovw-card">

            <h3>Pipeline by stage</h3>

            {
                pipelineByStage.map(row=>(

                    <div className="ovw-field-row" key={row.stage}>
                        <span>{STAGE_LABELS[row.stage] || row.stage}</span>
                        <b>{row.count}</b>
                    </div>

                ))
            }

        </div>

    );

}
