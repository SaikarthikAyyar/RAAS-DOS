import { useState, useEffect, useCallback } from "react";

import { getGstSettings, updateGstSettings } from "../../../services/gstSettingsService";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { buildActor } from "../../../utils/actor";

import { formatApiError } from "../../../utils/apiError";


// ====================================
// TAB
// Single-row settings form, same shape as Commercial Rules' own
// flat "Save changes" section - no add/remove here, matching the
// wireframe's mastersGST() exactly.
// ====================================

export default function GstTaxTab(){

    const [settings, setSettings] = useState(null);

    const [rate, setRate] = useState("");

    const [treatment, setTreatment] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [saving, setSaving] = useState(false);

    const [saveMessage, setSaveMessage] = useState("");

    const { user, hasTask } = useAuth();

    const { promptForRemark, remarkModal } = useRemarkPrompt();

    const load = useCallback(async()=>{

        setLoading(true);

        setError("");

        try{

            const data = await getGstSettings();

            setSettings(data);
            setRate(data?.rate ?? "");
            setTreatment(data?.treatment || "");

        }

        catch(err){

            console.error(err);

            setError("Unable to load GST & Tax settings.");

        }

        finally{

            setLoading(false);

        }

    }, []);

    useEffect(()=>{ load(); }, [load]);

    async function handleSave(){

        const remark = await promptForRemark("Updating GST & Tax settings");

        if(remark===null){
            return;
        }

        setSaving(true);
        setSaveMessage("");

        try{

            await updateGstSettings({

                rate: Number(rate) || 0,
                treatment: treatment.trim(),
                actor: buildActor(user),
                remark

            });

            setSaveMessage("Saved.");
            load();

        }

        catch(err){

            setSaveMessage(formatApiError(err, "Unable to save GST & Tax settings."));

        }

        finally{

            setSaving(false);

        }

    }

    if(loading){
        return <div className="bm-card"><p className="bm-muted">Loading GST &amp; Tax settings...</p></div>;
    }

    if(error){
        return <div className="bm-card"><p className="bm-muted">{error}</p></div>;
    }

    return(

        <div className="bm-card">

            <h3>GST &amp; tax</h3>

            <div className="bm-formgrid">

                <div>

                    <label>GST rate (%)</label>

                    <input

                        type="number"

                        value={rate}

                        onChange={e=>setRate(e.target.value)}

                        disabled={!hasTask("bm-tab-gst", "save_gst_settings")}

                    />

                </div>

                <div>

                    <label>Treatment on quotes</label>

                    <input

                        value={treatment}

                        onChange={e=>setTreatment(e.target.value)}

                        disabled={!hasTask("bm-tab-gst", "save_gst_settings")}

                    />

                </div>

            </div>

            {

                hasTask("bm-tab-gst", "save_gst_settings") && (

                    <button

                        className="bm-btn bm-btn-primary"

                        style={{marginTop:"10px"}}

                        onClick={handleSave}

                        disabled={saving}

                    >

                        {saving ? "Saving..." : "Save changes"}

                    </button>

                )

            }

            {saveMessage && <p className="bm-modal-hint" style={{marginTop:"8px"}}>{saveMessage}</p>}

            {remarkModal}

        </div>

    );

}
