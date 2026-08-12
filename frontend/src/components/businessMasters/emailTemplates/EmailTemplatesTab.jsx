import { useState, useEffect, useCallback } from "react";

import { Pencil, Eye, SlidersHorizontal, Send, Trash2 } from "lucide-react";

import {

    getEmailTemplates,
    deleteEmailTemplate,
    updateEmailTemplate

} from "../../../services/emailTemplatesService";

import EditTemplateModal from "./EditTemplateModal";
import ViewBodyModal from "./ViewBodyModal";
import TemplateVariablesModal from "./TemplateVariablesModal";
import SendTemplateModal from "./SendTemplateModal";


// ====================================
// ACTION BUTTON
// Icon button with a custom hover tooltip - same pattern as the
// Enquiries list's row actions and Administration's Role cards.
// ====================================

function ActionButton({ icon: Icon, label, className, onClick }){

    return(

        <span className="email-template-action-wrap">

            <button
                type="button"
                className={className}
                aria-label={label}
                onClick={onClick}
            >
                <Icon size={14} strokeWidth={2}/>
            </button>

            <span className="email-template-action-tooltip">
                {label}
            </span>

        </span>

    );

}


// ====================================
// TAB
// ====================================

export default function EmailTemplatesTab(){

    const [templates, setTemplates] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [editingTemplate, setEditingTemplate] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);

    const [viewingTemplate, setViewingTemplate] = useState(null);

    const [detailsTemplate, setDetailsTemplate] = useState(null);

    const [sendingTemplate, setSendingTemplate] = useState(null);

    const load = useCallback(async()=>{

        setLoading(true);

        setError("");

        try{

            const data = await getEmailTemplates();

            setTemplates(data ?? []);

        }

        catch(err){

            console.error(err);

            setError("Unable to load email templates.");

        }

        finally{

            setLoading(false);

        }

    }, []);

    useEffect(()=>{ load(); }, [load]);

    async function handleToggleActive(template){

        try{

            await updateEmailTemplate(template.id, { is_active: !template.is_active });

            load();

        }

        catch(err){

            alert(err?.detail || "Unable to update status.");

        }

    }

    async function handleDelete(template){

        if(!window.confirm(`Remove "${template.name}"?`)) return;

        try{

            await deleteEmailTemplate(template.id);

            load();

        }

        catch(err){

            alert(err?.detail || "Unable to remove template.");

        }

    }

    function handleSaved(){

        setShowEditModal(false);
        setEditingTemplate(null);
        load();

    }

    return(

        <div className="bm-card">

            <h3>

                Email templates

                <button

                    className="bm-btn bm-btn-primary bm-btn-xs bm-push-right"

                    onClick={()=>{ setEditingTemplate(null); setShowEditModal(true); }}

                >

                    + Add template

                </button>

            </h3>

            <p className="bm-muted" style={{marginBottom:10}}>

                Every send-email action (release quote, daily update, follow-up) pre-fills from the matching template here, still editable before sending.

            </p>

            {

                loading ? (

                    <p className="bm-muted">Loading email templates...</p>

                ) : error ? (

                    <p className="bm-muted">{error}</p>

                ) : templates.length===0 ? (

                    <p className="bm-muted">No email templates yet — add the first one.</p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>Name</th>

                                <th>Use case</th>

                                <th>Subject</th>

                                <th>Status</th>

                                <th></th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                templates.map(t=>(

                                    <tr key={t.id}>

                                        <td>{t.name}</td>

                                        <td>{t.use_case}</td>

                                        <td>{t.subject}</td>

                                        <td>

                                            <span

                                                className={t.is_active ? "bm-pill bm-pill-green" : "bm-pill bm-pill-gray"}

                                                style={{cursor:"pointer"}}

                                                onClick={()=>handleToggleActive(t)}

                                            >

                                                {t.is_active ? "Active" : "Inactive"}

                                            </span>

                                        </td>

                                        <td className="email-template-actions">

                                            <ActionButton
                                                icon={Pencil}
                                                label="Edit"
                                                className="email-template-edit"
                                                onClick={()=>{ setEditingTemplate(t); setShowEditModal(true); }}
                                            />

                                            <ActionButton
                                                icon={Eye}
                                                label="View body"
                                                className="email-template-view"
                                                onClick={()=>setViewingTemplate(t)}
                                            />

                                            <ActionButton
                                                icon={SlidersHorizontal}
                                                label="Details (variables)"
                                                className="email-template-details"
                                                onClick={()=>setDetailsTemplate(t)}
                                            />

                                            <ActionButton
                                                icon={Send}
                                                label="Send"
                                                className="email-template-send"
                                                onClick={()=>setSendingTemplate(t)}
                                            />

                                            <ActionButton
                                                icon={Trash2}
                                                label="Remove"
                                                className="email-template-delete"
                                                onClick={()=>handleDelete(t)}
                                            />

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                )

            }

            {

                showEditModal && (

                    <EditTemplateModal

                        template={editingTemplate}

                        onClose={()=>{ setShowEditModal(false); setEditingTemplate(null); }}

                        onSaved={handleSaved}

                    />

                )

            }

            {

                viewingTemplate && (

                    <ViewBodyModal

                        template={viewingTemplate}

                        onClose={()=>setViewingTemplate(null)}

                        onSaved={()=>{ setViewingTemplate(null); load(); }}

                    />

                )

            }

            {

                detailsTemplate && (

                    <TemplateVariablesModal

                        template={detailsTemplate}

                        onClose={()=>{ setDetailsTemplate(null); load(); }}

                    />

                )

            }

            {

                sendingTemplate && (

                    <SendTemplateModal

                        template={sendingTemplate}

                        onClose={()=>setSendingTemplate(null)}

                    />

                )

            }

        </div>

    );

}
