import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {

getCustomers,

getCustomerAssets

}

from "../../services/customerMasterService";

import {

FieldInput

}

from "../shared/FormField";

import LookupSelect from "../shared/LookupSelect";


// ====================================
// COMPONENT
// Company Name is a strict select of existing customers for every
// role, no exceptions - Customer Request can no longer create a new
// Customer inline (previously Admin could type an unmatched name to
// auto-vivify one via resolve_or_create_customer -> create_customer_
// minimal). "+ Add New Customer" (italic) instead navigates to
// Business Masters -> Customers, which already defaults to that tab.
// ====================================

export default function Section1_CustomerSite({

customerData,

updateSection,

errors,

touched,

touchField,

submitAttempted

}){

const navigate = useNavigate();

const customer=

customerData.customer || {};

const requirement=

customerData.requirement || {};

const [allCustomers, setAllCustomers] = useState([]);

const [assetOptions, setAssetOptions] = useState([]);

useEffect(()=>{

    getCustomers()

        .then(response=>setAllCustomers(response.items || []))

        .catch(err=>console.error(err));

}, []);

useEffect(()=>{

    if(!customer.customer_id){

        setAssetOptions([]);

        return;

    }

    getCustomerAssets(customer.customer_id)

        .then(response=>setAssetOptions(response.items || []))

        .catch(err=>console.error(err));

}, [customer.customer_id]);

function handleExistingCustomerSelect(customerId){

    const match = allCustomers.find(
        c=>String(c.id)===String(customerId)
    );

    updateSection("customer", "company_name", match ? match.company_name : "");

    updateSection("customer", "customer_id", match ? match.id : null);

    updateSection("customer", "existing_asset_id", null);

}

function handleAssetChange(value){

    const assetId = value ? Number(value) : null;

    updateSection("customer", "existing_asset_id", assetId);

    const asset = assetOptions.find(a => a.id === assetId);

    if(!asset){
        return;
    }

    // Autofill every field the picked asset already has a stored
    // value for - keeps them visible/editable (pre-populated, not
    // hidden), so the user only has to confirm or correct rather
    // than re-enter what's already known about this site.

    if(asset.plant){
        updateSection("customer", "plant_site_location", asset.plant);
    }

    if(asset.cleaning_frequency){
        updateSection("requirement", "cleaning_frequency", asset.cleaning_frequency);
    }

    if(asset.observed_material){
        updateSection("requirement", "observed_material", asset.observed_material);
    }

    if(asset.access_opening_type){
        updateSection("requirement", "access_opening_type", asset.access_opening_type);
    }

    if(asset.can_place_equipment_nearby !== null && asset.can_place_equipment_nearby !== undefined){
        updateSection(
            "requirement",
            "can_place_equipment_nearby",
            asset.can_place_equipment_nearby ? "Yes, within 10 m" : "No"
        );
    }

    if(asset.pain_point){
        updateSection("requirement", "pain_point", asset.pain_point);
    }

}

// Once the user has interacted with ANY field on the form (not just
// this one), a still-empty compulsory field starts showing its error -
// moving on to a later field is exactly the signal that an earlier
// required field was skipped.
const anyFieldTouched = Object.keys(touched || {}).length > 0;

function fieldError(field){

    return errors?.[field] && (anyFieldTouched || submitAttempted);

}

// The 4 named Channel Partner Lead Source options only appear when
// the resolved customer's Industry is "Channel Partner" (Business
// Masters already has this field/value - see Phase 11).
const resolvedCustomer = allCustomers.find(c => c.id === customer.customer_id);

const isChannelPartner = resolvedCustomer?.industry === "Channel Partner";


return(

<div className="survey-card">


<div className="survey-header">

<h2>

1. Customer & Site

</h2>

<span>

Required

</span>

</div>


<div className="survey-grid">


<div className={fieldError("company_name") ? "survey-field field-error" : "survey-field"}>

    <label>
        <span className="required-asterisk">*</span>Company Name
    </label>

    <select
        value={customer.customer_id || ""}
        onChange={e=>{
            if(e.target.value === "__new__"){
                navigate("/business-master");
                return;
            }
            handleExistingCustomerSelect(e.target.value);
        }}
        onBlur={()=>touchField("customer", "company_name")}
    >
        <option value="">Select</option>
        <option value="__new__" style={{fontStyle:"italic"}}>+ Add New Customer</option>
        {allCustomers.map(c=>(
            <option key={c.id} value={c.id}>{c.company_name}</option>
        ))}
    </select>

    {
        fieldError("company_name") && (
            <span className="field-error-message">
                Company Name is required.
            </span>
        )
    }

</div>


<LookupSelect

listKey="jobType"

label="Job Type"

value={requirement.service_requirement_type}

section="requirement"

field="service_requirement_type"

updateSection={updateSection}

/>


<FieldInput

label="Client Site Contact Name"

value={customer.contact_person}

section="customer"

field="contact_person"

updateSection={updateSection}

/>


<FieldInput

label="Client Site Contact Number"

value={customer.contact_number}

section="customer"

field="contact_number"

placeholder="e.g. +91 98200 11223"

updateSection={updateSection}

onBlur={()=>touchField("customer", "contact_number")}

error={fieldError("contact_number")}

errorMessage="Enter a valid 10-digit mobile number (e.g. +91 98200 11223)."

/>


<FieldInput

label="Client Site Contact Email"

value={customer.client_contact_email}

section="customer"

field="client_contact_email"

placeholder="e.g. contact@company.com"

updateSection={updateSection}

onBlur={()=>touchField("customer", "client_contact_email")}

error={fieldError("client_contact_email")}

errorMessage="Enter a valid email address."

/>


<LookupSelect

listKey="nearestHub"

label="Nearest City / Hub"

value={customer.nearest_city_hub}

section="customer"

field="nearest_city_hub"

updateSection={updateSection}

/>


<LookupSelect

listKey="urgency"

label="Urgency"

value={customer.urgency}

section="customer"

field="urgency"

updateSection={updateSection}

/>

<LookupSelect

listKey="natureOfJob"

label="*Nature of Job"

value={customer.nature_of_job}

section="customer"

field="nature_of_job"

updateSection={updateSection}

onBlur={()=>touchField("customer", "nature_of_job")}

error={fieldError("nature_of_job")}

errorMessage="Nature of Job is required."

/>

<div className="survey-field">

<label>

Existing asset (optional)

</label>

<select

    value={customer.existing_asset_id || ""}

    disabled={!customer.customer_id}

    onChange={e=>handleAssetChange(e.target.value)}

>

    <option value="">— New site, no existing asset —</option>

    {assetOptions.map(a=>(

        <option key={a.id} value={a.id}>{a.label}</option>

    ))}

</select>

</div>

<LookupSelect

listKey="leadSource"

conditionalTag={isChannelPartner ? "channel_partner" : undefined}

label="Lead Source"

value={customer.lead_source}

section="customer"

field="lead_source"

updateSection={updateSection}

/>

<FieldInput

label="Estimated Volume (m³)"

type="number"

value={requirement.estimated_volume}

section="requirement"

field="estimated_volume"

updateSection={updateSection}

/>

</div>

</div>

)

}
