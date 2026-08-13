import { useState } from "react";

import {

    createEmailTemplate,
    updateEmailTemplate

} from "../../../services/emailTemplatesService";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { buildActor } from "../../../utils/actor";


// ====================================
// COMPONENT
// Create + edit metadata (name/use case/subject/active). Body is
// deliberately left out of this modal - editing the body is the View
// action's job (a new template starts with an empty body).
// ====================================

export default function EditTemplateModal({

    template,

    onClose,

    onSaved

}){

    const [name, setName] = useState(template?.name || "");

    const [useCase, setUseCase] = useState(template?.use_case || "");

    const [subject, setSubject] = useState(template?.subject || "");

    const [isActive, setIsActive] = useState(template?.is_active ?? true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const { user } = useAuth();

    const { promptForRemark, remarkModal } = useRemarkPrompt();

    async function handleSubmit(){

        if(!name.trim() || !useCase.trim() || !subject.trim()){

            setError("Name, use case and subject are required.");

            return;

        }

        const remark = await promptForRemark(template ? "Updating this email template" : "Creating this email template");

        if(remark===null){
            return;
        }

        setSaving(true);

        setError("");

        try{

            if(template){

                await updateEmailTemplate(template.id, {

                    name: name.trim(),
                    use_case: useCase.trim(),
                    subject: subject.trim(),
                    is_active: isActive,
                    actor: buildActor(user),
                    remark

                });

            }

            else{

                await createEmailTemplate({

                    name: name.trim(),
                    use_case: useCase.trim(),
                    subject: subject.trim(),
                    body: "",
                    is_active: isActive,
                    variables: [],
                    actor: buildActor(user),
                    remark

                });

            }

            onSaved();

        }

        catch(err){

            setError(err?.detail || "Unable to save template.");

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>{template ? "Edit email template" : "New email template"}</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                {

                    !template && (

                        <p className="bm-modal-hint">

                            The body can be filled in afterwards via the "View body" action.

                        </p>

                    )

                }

                <div className="bm-formgrid single">

                    <div>

                        <label>Name</label>

                        <input

                            value={name}

                            onChange={e=>setName(e.target.value)}

                        />

                    </div>

                    <div>

                        <label>Use case</label>

                        <input

                            value={useCase}

                            onChange={e=>setUseCase(e.target.value)}

                            placeholder="e.g. Release quote to client"

                        />

                    </div>

                    <div>

                        <label>Subject</label>

                        <input

                            value={subject}

                            onChange={e=>setSubject(e.target.value)}

                            placeholder="Use {variable_key} placeholders"

                        />

                    </div>

                    <div>

                        <label>

                            <input

                                type="checkbox"

                                checked={isActive}

                                onChange={e=>setIsActive(e.target.checked)}

                                style={{width:"auto", marginRight:6}}

                            />

                            Active

                        </label>

                    </div>

                </div>

                <div className="bm-modal-actions">

                    <button className="bm-btn bm-btn-ghost" onClick={onClose}>Cancel</button>

                    <button

                        className="bm-btn bm-btn-primary"

                        onClick={handleSubmit}

                        disabled={saving}

                    >

                        {saving ? "Saving..." : "Save"}

                    </button>

                </div>

            </div>

            {remarkModal}

        </div>

    );

}
