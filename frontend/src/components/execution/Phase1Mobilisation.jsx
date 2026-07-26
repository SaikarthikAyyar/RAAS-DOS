// ====================================
// PHASE 1
// MOBILISATION
// ====================================

export default function Phase1Mobilisation({

    execution

}){

    if(!execution){

        return null;

    }

    return(

        <div
            style={{

                marginTop:"20px",

                padding:"20px",

                border:"1px solid #444",

                borderRadius:"8px",

                background:"#1f1f1f",

                color:"#ffffff"

            }}
        >

            <h2>

                Phase 1 - Mobilisation

            </h2>

            <hr/>

            <h3>

                Machine Transport

            </h3>

            <p>

                <strong>Transport Status :</strong>

                {" "}

                {execution.transport_status}

            </p>

            <p>

                <strong>Current Activity :</strong>

                {" "}

                {execution.current_activity}

            </p>

            <hr/>

            <h3>

                Live GPS

            </h3>

            <p>

                Latitude :

                {" "}

                {execution.latitude}

            </p>

            <p>

                Longitude :

                {" "}

                {execution.longitude}

            </p>

            <p>

                Speed :

                {" "}

                {execution.speed_kmph}

                {" "}km/h

            </p>

            <p>

                Heading :

                {" "}

                {execution.heading}

            </p>

            <p>

                Altitude :

                {" "}

                {execution.altitude}

            </p>

            <p>

                Accuracy :

                {" "}

                {execution.accuracy_meters}

                {" "}m

            </p>

            <hr/>

            <h3>

                Journey

            </h3>

            <p>

                Distance Remaining :

                {" "}

                {execution.distance_remaining_km}

                {" "}km

            </p>

            <p>

                ETA :

                {" "}

                {execution.eta_minutes}

                {" "}minutes

            </p>

            <hr/>

            <div
                style={{

                    height:"250px",

                    border:"1px dashed #666",

                    display:"flex",

                    alignItems:"center",

                    justifyContent:"center",

                    color:"#888"

                }}
            >

                Live GPS Map

                (Google Maps later)

            </div>

        </div>

    );

}