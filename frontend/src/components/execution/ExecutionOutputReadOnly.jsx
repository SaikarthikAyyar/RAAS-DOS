// ====================================
// EXECUTION OUTPUT - READ ONLY
// Phase 2's customer-facing story: how much was targeted vs. how much
// is actually done. Purely presentational, no inputs, no save action,
// no service calls - pulls the exact same fields the real (editable)
// Phase2Execution component already computes from, so nothing shown
// here can ever drift from what staff see on the working tab.
// ====================================

import "./Execution.css";

export default function ExecutionOutputReadOnly({

    execution

}){

    if(!execution){
        return null;
    }

    const unit = execution.output_unit || "m³";

    const estimatedVolume = Number(execution.estimated_volume ?? 0);
    const dailyTarget = Number(execution.daily_target ?? 0);
    const todayOutput = Number(execution.today_output ?? 0);
    const totalOutput = Number(execution.total_output ?? 0);

    return(

        <div className="execution-card">

            <h2 className="execution-section-title">
                Phase 2 - Live Execution
            </h2>

            <div className="execution-metric-grid">

                <div className="execution-metric">
                    <h5>Target (Sludge Volume)</h5>
                    <h2>{estimatedVolume.toFixed(2)} {unit}</h2>
                </div>

                <div className="execution-metric">
                    <h5>Daily Target</h5>
                    <h2>{dailyTarget.toFixed(2)} {unit}</h2>
                </div>

                <div className="execution-metric">
                    <h5>Today's Output</h5>
                    <h2>{todayOutput.toFixed(2)} {unit}</h2>
                </div>

                <div className="execution-metric">
                    <h5>Total Output (cumulative)</h5>
                    <h2>{totalOutput.toFixed(2)} {unit}</h2>
                </div>

            </div>

        </div>

    );

}
