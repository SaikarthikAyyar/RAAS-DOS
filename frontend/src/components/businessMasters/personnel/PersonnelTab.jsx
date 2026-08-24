import { useState, useEffect, useCallback } from "react";

import {

    getPersonnel,
    createPersonnel,
    updatePersonnel,
    deletePersonnel,
    uploadPersonnelDocument,
    updatePersonnelDocument,
    deletePersonnelDocument

} from "../../../services/personnelService";

import { getHrRoles } from "../../../services/hrRolesService";
import { getHubs } from "../../../services/hubsService";

import { useLookupLists } from "../../../context/LookupListsContext";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { buildActor } from "../../../utils/actor";

import { formatApiError } from "../../../utils/apiError";


function isExpired(validTill){

    if(!validTill){
        return false;
    }

    return new Date(validTill) < new Date(new Date().toDateString());

}


// ====================================
// DOCUMENT URL
// file_path is stored as a real disk path rooted at the backend's own
// working directory (e.g. "backend/uploads/personnel_documents/16/
// test_doc.pdf") - the "/uploads" static mount in main.py serves
// everything under "backend/uploads" at that prefix, so stripping the
// leading "backend/" is what turns the stored path into the URL that
// mount actually answers to.
// ====================================

const API = import.meta.env.VITE_API_URL;

function documentUrl(filePath){

    const relativePath = filePath.replace(/^backend\//, "");

    // encodeURI (not encodeURIComponent) so real "/" separators survive -
    // only characters like spaces in a real filename ("Heavy Machine
    // License.pdf") get escaped.
    return `${API}/${encodeURI(relativePath)}`;

}


// ====================================
// ADD / EDIT PERSON MODAL
// ====================================

function PersonModal({ editing, hrRoles, hubs, onClose, onSave }){

    const [employeeCode, setEmployeeCode] = useState(editing?.employee_code || "");
    const [fullName, setFullName] = useState(editing?.full_name || "");
    const [phoneNumber, setPhoneNumber] = useState(editing?.phone_number || "");
    const [currentLocation, setCurrentLocation] = useState(editing?.current_location || "");
    const [designation, setDesignation] = useState(editing?.designation || (hrRoles[0]?.role || ""));
    const [skill, setSkill] = useState(editing?.skill || "");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(){

        if(!fullName.trim() || (!editing && !employeeCode.trim()) || !designation){

            setError("Employee code, name and role are required.");

            return;

        }

        setSaving(true);
        setError("");

        try{

            const payload = editing ? {

                full_name: fullName.trim(),
                phone_number: phoneNumber.trim() || null,
                current_location: currentLocation || null,
                designation,
                skill: skill.trim() || null

            } : {

                employee_code: employeeCode.trim(),
                full_name: fullName.trim(),
                phone_number: phoneNumber.trim() || null,
                current_location: currentLocation || null,
                designation,
                skill: skill.trim() || null

            };

            await onSave(payload);

        }

        catch(err){
            setError(formatApiError(err, "Unable to save person."));
        }

        finally{
            setSaving(false);
        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>{editing ? `Edit person — ${editing.full_name}` : "Add person"}</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid">

                    <div>
                        <label>Employee code</label>
                        <input value={employeeCode} onChange={e=>setEmployeeCode(e.target.value)} disabled={!!editing} />
                    </div>

                    <div>
                        <label>Name</label>
                        <input value={fullName} onChange={e=>setFullName(e.target.value)} />
                    </div>

                    <div>
                        <label>Phone number</label>
                        <input value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)} />
                    </div>

                    <div>
                        <label>Role</label>
                        <select value={designation} onChange={e=>setDesignation(e.target.value)}>
                            <option value="">—</option>
                            {hrRoles.map(r=>(
                                <option key={r.id} value={r.role}>{r.role}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Hub</label>
                        <select value={currentLocation} onChange={e=>setCurrentLocation(e.target.value)}>
                            <option value="">—</option>
                            {hubs.map(h=>(
                                <option key={h.id} value={h.hub_name}>{h.hub_name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Skills</label>
                        <input value={skill} onChange={e=>setSkill(e.target.value)} />
                    </div>

                </div>

                <div className="bm-modal-actions">

                    <button className="bm-btn bm-btn-ghost" onClick={onClose}>Cancel</button>

                    <button className="bm-btn bm-btn-primary" onClick={handleSubmit} disabled={saving}>
                        {saving ? "Saving..." : (editing ? "Save changes" : "Add")}
                    </button>

                </div>

            </div>

        </div>

    );

}


// ====================================
// ADD DOCUMENT MODAL
// ====================================

function AddDocumentModal({ person, docTypeOptions, onClose, onUpload }){

    const [file, setFile] = useState(null);
    const [documentType, setDocumentType] = useState(docTypeOptions[0] || "");
    const [validTill, setValidTill] = useState("");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(){

        if(!file || !documentType){

            setError("A file and document type are required.");

            return;

        }

        if(!file.name.toLowerCase().endsWith(".pdf")){

            setError("Only PDF files are accepted for personnel documents.");

            return;

        }

        setSaving(true);
        setError("");

        try{

            await onUpload(file, documentType, validTill || null);

        }

        catch(err){
            setError(formatApiError(err, "Unable to upload document."));
        }

        finally{
            setSaving(false);
        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>Add document — {person.full_name}</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid">

                    <div>
                        <label>Document type</label>
                        <select value={documentType} onChange={e=>setDocumentType(e.target.value)}>
                            {docTypeOptions.map(t=><option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div>
                        <label>Valid till</label>
                        <input type="date" value={validTill} onChange={e=>setValidTill(e.target.value)} />
                    </div>

                    <div style={{gridColumn:"1 / -1"}}>
                        <label>File (PDF only)</label>
                        <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files?.[0] || null)} />
                    </div>

                </div>

                <div className="bm-modal-actions">

                    <button className="bm-btn bm-btn-ghost" onClick={onClose}>Cancel</button>

                    <button className="bm-btn bm-btn-primary" onClick={handleSubmit} disabled={saving}>
                        {saving ? "Uploading..." : "Add document"}
                    </button>

                </div>

            </div>

        </div>

    );

}


// ====================================
// EDIT DOCUMENT MODAL
// ====================================

function EditDocumentModal({ document, docTypeOptions, onClose, onSave }){

    const [documentType, setDocumentType] = useState(document.document_type);
    const [validTill, setValidTill] = useState(document.valid_till || "");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(){

        setSaving(true);
        setError("");

        try{

            await onSave({ document_type: documentType, valid_till: validTill || null });

        }

        catch(err){
            setError(formatApiError(err, "Unable to update document."));
        }

        finally{
            setSaving(false);
        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>Edit document — {document.document_name}</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid">

                    <div>
                        <label>Document type</label>
                        <select value={documentType} onChange={e=>setDocumentType(e.target.value)}>
                            {docTypeOptions.map(t=><option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div>
                        <label>Valid till</label>
                        <input type="date" value={validTill} onChange={e=>setValidTill(e.target.value)} />
                    </div>

                </div>

                <div className="bm-modal-actions">

                    <button className="bm-btn bm-btn-ghost" onClick={onClose}>Cancel</button>

                    <button className="bm-btn bm-btn-primary" onClick={handleSubmit} disabled={saving}>
                        {saving ? "Saving..." : "Save changes"}
                    </button>

                </div>

            </div>

        </div>

    );

}


// ====================================
// TAB
// ====================================

export default function PersonnelTab(){

    const [personnel, setPersonnel] = useState([]);
    const [hrRoles, setHrRoles] = useState([]);
    const [hubs, setHubs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showPersonModal, setShowPersonModal] = useState(false);
    const [editingPerson, setEditingPerson] = useState(null);

    const [addingDocFor, setAddingDocFor] = useState(null);
    const [editingDoc, setEditingDoc] = useState(null);

    const { user, hasTask } = useAuth();

    const { promptForRemark, remarkModal } = useRemarkPrompt();

    const { getOptions } = useLookupLists();

    const docTypeOptions = getOptions("personnelDocTypes");

    const load = useCallback(async()=>{

        setLoading(true);
        setError("");

        try{

            const [people, roles, hubList] = await Promise.all([
                getPersonnel(),
                getHrRoles(),
                getHubs()
            ]);

            setPersonnel(people ?? []);
            setHrRoles(roles ?? []);
            setHubs(hubList ?? []);

        }

        catch(err){

            console.error(err);
            setError("Unable to load Personnel.");

        }

        finally{

            setLoading(false);

        }

    }, []);

    useEffect(()=>{ load(); }, [load]);


    // ====================================
    // PERSON CRUD
    // ====================================

    async function handleSavePerson(payload){

        const remark = await promptForRemark(editingPerson ? "Updating this person" : "Adding this person");

        if(remark===null){
            return;
        }

        if(editingPerson){

            await updatePersonnel(editingPerson.id, { ...payload, actor:buildActor(user), remark });

        }

        else{

            await createPersonnel({ ...payload, actor:buildActor(user), remark });

        }

        setShowPersonModal(false);
        setEditingPerson(null);
        load();

    }

    async function handleRemovePerson(person){

        const remark = await promptForRemark(`Removing ${person.full_name}`);

        if(remark===null){
            return;
        }

        try{

            await deletePersonnel(person.id, buildActor(user), remark);
            load();

        }

        catch(err){

            alert(formatApiError(err, "Unable to remove person."));

        }

    }


    // ====================================
    // DOCUMENT CRUD
    // ====================================

    async function handleUploadDocument(file, documentType, validTill){

        const remark = await promptForRemark(`Adding a document for ${addingDocFor.full_name}`);

        if(remark===null){
            throw { detail: "Cancelled." };
        }

        await uploadPersonnelDocument(addingDocFor.id, file, documentType, validTill, buildActor(user), remark);

        setAddingDocFor(null);
        load();

    }

    async function handleSaveDocument(payload){

        const remark = await promptForRemark("Updating this document");

        if(remark===null){
            throw { detail: "Cancelled." };
        }

        await updatePersonnelDocument(editingDoc.id, { ...payload, actor:buildActor(user), remark });

        setEditingDoc(null);
        load();

    }

    async function handleRemoveDocument(doc){

        const remark = await promptForRemark("Removing this document");

        if(remark===null){
            return;
        }

        try{

            await deletePersonnelDocument(doc.id, buildActor(user), remark);
            load();

        }

        catch(err){

            alert(formatApiError(err, "Unable to remove document."));

        }

    }


    // ====================================
    // RENDER
    // ====================================

    if(loading){
        return <div className="bm-card"><p className="bm-muted">Loading Personnel...</p></div>;
    }

    if(error){
        return <div className="bm-card"><p className="bm-muted">{error}</p></div>;
    }

    return(

        <div>

            <div className="bm-card">

                <h3>

                    Personnel

                    {hasTask("bm-tab-personnel", "add_person") && (

                        <button

                            className="bm-btn bm-btn-primary bm-btn-xs bm-push-right"

                            onClick={()=>{ setEditingPerson(null); setShowPersonModal(true); }}

                        >

                            + Add person

                        </button>

                    )}

                </h3>

                <p className="bm-muted" style={{marginTop:"-6px"}}>

                    Named individuals — the fleet/crew assignment lists and Allocation both pull from this same roster. Each person can have multiple compliance documents.

                </p>

            </div>

            {

                personnel.length===0 ? (

                    <div className="bm-card"><p className="bm-muted">No personnel yet — add the first one.</p></div>

                ) : personnel.map(p=>(

                    <div className="bm-card" key={p.id} style={{marginBottom:"12px"}}>

                        <h4 style={{marginTop:0, display:"flex", alignItems:"center", gap:"10px"}}>

                            {p.full_name}

                            <span className="bm-muted" style={{fontWeight:600, fontSize:"12px"}}>
                                ({p.employee_code} · {p.designation}{p.current_location ? ` · ${p.current_location}` : ""})
                            </span>

                            <span style={{marginLeft:"auto", display:"flex", gap:"10px"}}>

                                {hasTask("bm-tab-personnel", "edit_person") && (
                                    <button className="bm-backlink" onClick={()=>{ setEditingPerson(p); setShowPersonModal(true); }}>Edit</button>
                                )}

                                {hasTask("bm-tab-personnel", "remove_person") && (
                                    <button className="bm-backlink" onClick={()=>handleRemovePerson(p)}>Remove</button>
                                )}

                            </span>

                        </h4>

                        <table>

                            <thead>
                                <tr>
                                    <th>Document type</th>
                                    <th>Valid till</th>
                                    <th>File</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>

                                {

                                    p.documents.length===0 ? (

                                        <tr><td colSpan="4" className="bm-muted">No documents on file.</td></tr>

                                    ) : p.documents.map(d=>(

                                        <tr key={d.id}>

                                            <td>{d.document_type}</td>

                                            <td>
                                                {
                                                    isExpired(d.valid_till) ? (
                                                        <span className="bm-pill bm-pill-red">Expired {d.valid_till}</span>
                                                    ) : (d.valid_till || "—")
                                                }
                                            </td>

                                            <td>
                                                <a
                                                    href={documentUrl(d.file_path)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bm-backlink"
                                                >
                                                    {d.document_name}
                                                </a>
                                            </td>

                                            <td>

                                                {hasTask("bm-tab-personnel", "edit_person_document") && (
                                                    <button className="bm-backlink" onClick={()=>setEditingDoc(d)}>Edit</button>
                                                )}

                                                {" "}

                                                {hasTask("bm-tab-personnel", "remove_person_document") && (
                                                    <button className="bm-backlink" onClick={()=>handleRemoveDocument(d)}>Remove</button>
                                                )}

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>

                        {hasTask("bm-tab-personnel", "add_person_document") && (

                            <button

                                className="bm-btn bm-btn-xs"

                                style={{marginTop:"8px"}}

                                onClick={()=>setAddingDocFor(p)}

                            >

                                + Add document

                            </button>

                        )}

                    </div>

                ))

            }

            {

                showPersonModal && (

                    <PersonModal

                        editing={editingPerson}
                        hrRoles={hrRoles}
                        hubs={hubs}
                        onClose={()=>{ setShowPersonModal(false); setEditingPerson(null); }}
                        onSave={handleSavePerson}

                    />

                )

            }

            {

                addingDocFor && (

                    <AddDocumentModal

                        person={addingDocFor}
                        docTypeOptions={docTypeOptions}
                        onClose={()=>setAddingDocFor(null)}
                        onUpload={handleUploadDocument}

                    />

                )

            }

            {

                editingDoc && (

                    <EditDocumentModal

                        document={editingDoc}
                        docTypeOptions={docTypeOptions}
                        onClose={()=>setEditingDoc(null)}
                        onSave={handleSaveDocument}

                    />

                )

            }

            {remarkModal}

        </div>

    );

}
