import { formatPump, formatAccessory } from "../../utils/kitFormat";


// ====================================
// KIT PICKER
// The two checklists for what a fleet unit is mobilised with: pumps
// (only ones compatible with its machine) and accessories (the whole
// master, machine defaults ticked by the caller). Shared by the Job
// Created tab and Business Masters -> Fleet Units so both look and
// behave the same, and every item is shown with its id.
// ====================================

function CheckList({ options, selected, onChange, format, emptyText }){

    function toggle(id){

        if(selected.includes(id)){
            onChange(selected.filter(v=>v!==id));
        }
        else{
            onChange([...selected, id]);
        }

    }

    return(

        <div className="bm-checkbox-list">

            {
                options.length===0 ? (
                    <span className="bm-muted">{emptyText}</span>
                ) : options.map(opt=>(

                    <label key={opt.id}>

                        <input
                            type="checkbox"
                            checked={selected.includes(opt.id)}
                            onChange={()=>toggle(opt.id)}
                        />

                        {format(opt)}

                    </label>

                ))
            }

        </div>

    );

}


export default function KitPicker({

    options,

    pumpIds,
    onPumpIds,

    accessoryIds,
    onAccessoryIds,

    disabled

}){

    if(!options){
        return <p className="bm-muted">Loading pumps and accessories...</p>;
    }

    const noType = options.machine_type_id === null;

    return(

        <div style={disabled ? {opacity:.6, pointerEvents:"none"} : undefined}>

            <div style={{marginBottom:10}}>

                <label>Pumps taken along (compatible with this machine only)</label>

                <CheckList
                    options={options.compatible_pumps}
                    selected={pumpIds}
                    onChange={onPumpIds}
                    format={formatPump}
                    emptyText={
                        noType
                            ? "This machine has no machine type yet - set it in Machine Inventory to choose pumps."
                            : "No pumps are marked compatible with this machine in Machine Specs."
                    }
                />

            </div>

            <div>

                <label>Accessories taken along</label>

                <CheckList
                    options={options.accessories}
                    selected={accessoryIds}
                    onChange={onAccessoryIds}
                    format={formatAccessory}
                    emptyText="No accessories in the Accessories master yet."
                />

            </div>

        </div>

    );

}
