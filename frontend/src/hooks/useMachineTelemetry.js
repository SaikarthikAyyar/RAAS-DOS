import { useState, useEffect } from "react";

import { getMachineTelemetry } from "../services/machineTelemetryService";


// Live sensor status for every machine in Machine Inventory, keyed by
// inventory id, refreshed on a timer. Shared by Machine Inventory, Fleet
// Units, Fleet & Availability so each shows the same picture. Read-only;
// a failed fetch just leaves the last known map in place.
export function useMachineTelemetry(intervalMs = 10000){

    const [state, setState] = useState({ byId:{}, mqtt:null, loaded:false });

    useEffect(()=>{

        let cancelled = false;

        async function load(){

            try{

                const data = await getMachineTelemetry();

                if(cancelled) return;

                const byId = {};
                (data.machines || []).forEach(m=>{ byId[m.id] = m; });

                setState({ byId, mqtt:data.mqtt || null, loaded:true });

            }
            catch{
                if(!cancelled) setState(prev=>({ ...prev, loaded:true }));
            }

        }

        load();

        const timer = setInterval(load, intervalMs);

        return ()=>{ cancelled = true; clearInterval(timer); };

    }, [intervalMs]);

    return state;

}
