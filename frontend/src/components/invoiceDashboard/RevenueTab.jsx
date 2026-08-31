import { useEffect, useState } from "react";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

import {
    getInvoiceDashboardMachines,
    getRevenueForecast
} from "../../services/invoiceDashboardService";

import PeriodRangePicker, { PRESETS } from "./PeriodRangePicker";


const ORANGE = "#f58220";
const GRAY = "#cbd5e1";


function inr(value){
    if(value===null || value===undefined) return "-";
    return "Rs " + Math.round(value).toLocaleString("en-IN");
}


// ====================================
// REVENUE TAB
// Machine list styled like Fleet & Availability's own "All fleet
// units" table (View Forecast in place of View calendar). Both
// graphs re-fetch/re-render on every machine or period change - no
// static snapshot.
// ====================================

export default function RevenueTab(){

    const [machines, setMachines] = useState([]);
    const [loadingMachines, setLoadingMachines] = useState(true);

    const [selectedMachineId, setSelectedMachineId] = useState(null);

    const defaultRange = PRESETS.find(p=>p.key==="next_3_months").range();
    const [rangeStart, setRangeStart] = useState(defaultRange[0]);
    const [rangeEnd, setRangeEnd] = useState(defaultRange[1]);

    const [forecast, setForecast] = useState(null);
    const [loadingForecast, setLoadingForecast] = useState(false);

    useEffect(()=>{

        (async ()=>{
            setLoadingMachines(true);
            const data = await getInvoiceDashboardMachines();
            setMachines(data);
            setLoadingMachines(false);
        })();

    }, []);

    useEffect(()=>{

        if(!selectedMachineId || !rangeStart || !rangeEnd) return;

        (async ()=>{
            setLoadingForecast(true);
            const data = await getRevenueForecast(selectedMachineId, rangeStart, rangeEnd);
            setForecast(data);
            setLoadingForecast(false);
        })();

    }, [selectedMachineId, rangeStart, rangeEnd]);

    const selectedMachine = machines.find(m=>m.id===selectedMachineId);

    return(

        <>

            <div className="bm-card" style={{marginBottom:14}}>

                <h3>All machines</h3>

                {loadingMachines ? (
                    <p className="bm-muted">Loading...</p>
                ) : (

                    <div style={{maxHeight:280, overflowY:"auto", border:"1px solid #eee", borderRadius:8}}>

                        <table style={{marginBottom:0}}>
                            <thead style={{position:"sticky", top:0, background:"#fff", zIndex:1}}>
                                <tr>
                                    <th>Machine</th>
                                    <th>Hub</th>
                                    <th>Current Location</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {machines.map(m=>(
                                    <tr key={m.id}>
                                        <td>{m.machine_code} - {m.machine_name}</td>
                                        <td>{m.hub_name || "-"}</td>
                                        <td>{m.current_location || "-"}</td>
                                        <td>{m.status}</td>
                                        <td>
                                            <span
                                                className="bm-backlink"
                                                style={{cursor:"pointer"}}
                                                onClick={()=>setSelectedMachineId(m.id)}
                                            >
                                                View Forecast
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>

                )}

            </div>

            {selectedMachine && (

                <div className="bm-card">

                    <h3 style={{margin:"0 0 10px"}}>
                        Forecast - {selectedMachine.machine_code} ({selectedMachine.machine_name})
                    </h3>

                    <div style={{marginBottom:14}}>
                        <PeriodRangePicker
                            start={rangeStart}
                            end={rangeEnd}
                            onChange={(s, e)=>{ setRangeStart(s); setRangeEnd(e); }}
                        />
                    </div>

                    {loadingForecast || !forecast ? (
                        <p className="bm-muted">Loading...</p>
                    ) : (

                        <>

                            <p className="bm-muted" style={{marginTop:0}}>
                                Invoice value for {selectedMachine.machine_code}, {forecast.period_label}
                            </p>

                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={forecast.series}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                    <XAxis dataKey="label" tick={{fontSize:11}}/>
                                    <YAxis tick={{fontSize:11}} tickFormatter={v=>inr(v)}/>
                                    <Tooltip formatter={v=>inr(v)}/>
                                    <Bar dataKey="value" fill={ORANGE} radius={[4,4,0,0]}/>
                                </BarChart>
                            </ResponsiveContainer>

                            <p className="bm-muted" style={{marginTop:20}}>
                                All machines compared, {forecast.period_label} - {selectedMachine.machine_code} highlighted
                            </p>

                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={forecast.comparison} layout="vertical" margin={{left:20}}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                                    <XAxis type="number" tick={{fontSize:11}} tickFormatter={v=>inr(v)}/>
                                    <YAxis dataKey="machine_code" type="category" tick={{fontSize:10.5}} width={140}/>
                                    <Tooltip formatter={v=>inr(v)}/>
                                    <Bar dataKey="value" radius={[0,4,4,0]}>
                                        {forecast.comparison.map(row=>(
                                            <Cell key={row.machine_id} fill={row.selected ? ORANGE : GRAY}/>
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>

                        </>

                    )}

                </div>

            )}

        </>

    );

}
