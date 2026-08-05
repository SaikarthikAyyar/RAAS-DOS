import { useEffect, useState } from "react";

import {

nearestHubs,

urgencyOptions,

leadSourceOptions,

jobTypes

}

from "../../data/salesSurveyOptions";

import {

natureOfJobOptions

}

from "../../data/customerMasterOptions";

import {

getCustomers,

getCustomerAssets

}

from "../../services/customerMasterService";

import {

FieldInput,

FieldSelect

}

from "../shared/FormField";

import { useAuth } from "../../contexts/AuthContext";


// ====================================
// COMPONENT
// Company field matches the wireframe's openNewEnquiryModal():
// datalist-backed input (existing customer autocomplete, or type a
// new one), an "Existing asset" dropdown scoped to whichever
// customer resolves, driving whether NewSiteFields shows below.
//
// Only Admin gets the free-text datalist (typing an unmatched name
// creates a new Business Master customer, per
// resolve_or_create_customer -> create_customer_minimal). Every
// other role is restricted to a plain select of existing customers -
// no way to create a new one from here.
// ====================================

export default function Section1_CustomerSite({

customerData,

updateSection,

errors,

touched,

touchField,

submitAttempted

}){

const { user } = useAuth();

const isAdmin = user?.role === "admin";

const [addingNewCustomer, setAddingNewCustomer] = useState(false);

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

function handleCompanyNameChange(value){

    updateSection("customer", "company_name", value);

    const match = allCustomers.find(

        c=>c.company_name.toLowerCase()===value.trim().toLowerCase()

    );

    updateSection("customer", "customer_id", match ? match.id : null);

    updateSection("customer", "existing_asset_id", null);

}

function handleExistingCustomerSelect(customerId){

    const match = allCustomers.find(
        c=>String(c.id)===String(customerId)
    );

    updateSection("customer", "company_name", match ? match.company_name : "");

    updateSection("customer", "customer_id", match ? match.id : null);

    updateSection("customer", "existing_asset_id", null);

}

function handleAssetChange(value){

    updateSection("customer", "existing_asset_id", value ? Number(value) : null);

}

function fieldError(field){

    return errors?.[field] && (touched?.[`customer.${field}`] || submitAttempted);

}


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


{

    isAdmin && addingNewCustomer

        ? (

            <div className={fieldError("company_name") ? "survey-field field-error" : "survey-field"}>

                <label>
                    *Company Name
                    <button
                        type="button"
                        className="field-inline-link"
                        onClick={()=>{
                            setAddingNewCustomer(false);
                            updateSection("customer", "company_name", "");
                            updateSection("customer", "customer_id", null);
                            updateSection("customer", "existing_asset_id", null);
                        }}
                    >
                        ← Choose existing customer
                    </button>
                </label>

                <input
                    value={customer.company_name || ""}
                    autoComplete="off"
                    placeholder="Type new company name"
                    onChange={e=>handleCompanyNameChange(e.target.value)}
                    onBlur={()=>touchField("customer", "company_name")}
                />

                {
                    fieldError("company_name") && (
                        <span className="field-error-message">
                            Company Name is required.
                        </span>
                    )
                }

            </div>

        )
        : (

            <div className={fieldError("company_name") ? "survey-field field-error" : "survey-field"}>

                <label>
                    *Company Name
                </label>

                <select
                    value={customer.customer_id || ""}
                    onChange={e=>{
                        if(e.target.value === "__new__"){
                            setAddingNewCustomer(true);
                            updateSection("customer", "company_name", "");
                            updateSection("customer", "customer_id", null);
                            updateSection("customer", "existing_asset_id", null);
                            return;
                        }
                        handleExistingCustomerSelect(e.target.value);
                    }}
                    onBlur={()=>touchField("customer", "company_name")}
                >
                    <option value="">Select</option>
                    {isAdmin && (
                        <option value="__new__">+ Add New Customer</option>
                    )}
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

        )

}


<FieldSelect

label="Job Type"

value={requirement.service_requirement_type}

section="requirement"

field="service_requirement_type"

options={jobTypes}

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


<FieldSelect

label="Nearest City / Hub"

value={customer.nearest_city_hub}

section="customer"

field="nearest_city_hub"

options={nearestHubs}

updateSection={updateSection}

/>


<FieldSelect

label="Urgency"

value={customer.urgency}

section="customer"

field="urgency"

options={urgencyOptions}

updateSection={updateSection}

/>

<FieldSelect

label="*Nature of Job"

value={customer.nature_of_job}

section="customer"

field="nature_of_job"

options={natureOfJobOptions}

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

<FieldSelect

label="Lead Source"

value={customer.lead_source}

section="customer"

field="lead_source"

options={leadSourceOptions}

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
