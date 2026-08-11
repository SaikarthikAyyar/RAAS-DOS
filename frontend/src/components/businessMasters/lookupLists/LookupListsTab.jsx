import { useState } from "react";

import { useLookupLists } from "../../../context/LookupListsContext";

import { deleteLookupValue } from "../../../services/lookupListsService";

import AddLookupValueModal from "./AddLookupValueModal";


// ====================================
// ONE LIST CARD
// ====================================

function LookupListCard({ list, onAdd, onRemove }){

    return(

        <div className="bm-card bm-lookup-card">

            <h3>{list.display_name}</h3>

            {

                list.description && (

                    <p className="bm-lookup-used-in">{list.description}</p>

                )

            }

            <div className="bm-lookup-chips">

                {

                    list.values.length===0 ? (

                        <p className="bm-muted">No values yet.</p>

                    ) : (

                        list.values.map(v=>(

                            <span

                                key={v.id}

                                className={v.is_other ? "bm-lookup-chip bm-lookup-chip-other" : "bm-lookup-chip"}

                            >

                                {v.value}

                                {v.is_other && <span className="bm-lookup-chip-badge">Other</span>}

                                {v.conditional_tag && <span className="bm-lookup-chip-badge">{v.conditional_tag}</span>}

                                <span

                                    className="bm-lookup-chip-remove"

                                    onClick={()=>onRemove(list, v)}

                                >

                                    ×

                                </span>

                            </span>

                        ))

                    )

                }

            </div>

            <button

                className="bm-btn bm-btn-primary bm-btn-xs"

                onClick={()=>onAdd(list)}

            >

                + Add

            </button>

        </div>

    );

}


// ====================================
// TAB
// ====================================

export default function LookupListsTab(){

    const { lists, loading, error, refetchList } = useLookupLists();

    const [addingList, setAddingList] = useState(null);

    async function handleRemove(list, valueRow){

        const label = valueRow.is_other ? `the "Other" option` : `"${valueRow.value}"`;

        const message = valueRow.is_other

            ? `Remove ${label} from "${list.display_name}"? This removes the custom-input behaviour from every live form using this list.`

            : `Remove ${label} from "${list.display_name}"?`;

        if(!window.confirm(message)) return;

        try{

            await deleteLookupValue(valueRow.id);

            refetchList(list.list_key);

        }

        catch(err){

            alert(err?.detail || "Unable to remove value.");

        }

    }

    async function handleSaved(listKey){

        setAddingList(null);

        refetchList(listKey);

    }

    const sortedLists = Object.values(lists).sort((a,b)=>a.display_name.localeCompare(b.display_name));

    return(

        <>

            {

                loading ? (

                    <div className="bm-card"><p className="bm-muted">Loading lookup lists...</p></div>

                ) : error ? (

                    <div className="bm-card"><p className="bm-muted">{error}</p></div>

                ) : (

                    <div className="bm-lookup-grid">

                        {

                            sortedLists.map(list=>(

                                <LookupListCard

                                    key={list.list_key}

                                    list={list}

                                    onAdd={setAddingList}

                                    onRemove={handleRemove}

                                />

                            ))

                        }

                    </div>

                )

            }

            {

                addingList && (

                    <AddLookupValueModal

                        list={addingList}

                        onClose={()=>setAddingList(null)}

                        onSaved={()=>handleSaved(addingList.list_key)}

                    />

                )

            }

        </>

    );

}
