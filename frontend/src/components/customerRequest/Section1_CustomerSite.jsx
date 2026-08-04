import { useEffect, useState } from "react";

import {

nearestHubs,

urgencyOptions,

leadSourceOptions

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


// ====================================
// COMPONENT
// Company field matches the wireframe's openNewEnquiryModal():
// datalist-backed input (existing customer autocomplete, or type a
// new one), an "Existing asset" dropdown scoped to whichever
// customer resolves, driving whether NewSiteFields shows below.
// ====================================

export default function Section1_CustomerSite({

customerData,

updateSection

}){

const customer=

customerData.customer || {};

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

function handleAssetChange(value){

    updateSection("customer", "existing_asset_id", value ? Number(value) : null);

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


<div className="survey-field">

<label>

*Company Name

</label>

<input

    value={customer.company_name || ""}

    list="crCustomerList"

    onChange={e=>handleCompanyNameChange(e.target.value)}

/>

<datalist id="crCustomerList">

    {allCustomers.map(c=>(

        <option key={c.id} value={c.company_name} />

    ))}

</datalist>

</div>


<FieldInput

label="*Plant / Site Location"

value={customer.plant_site_location}

section="customer"

field="plant_site_location"

updateSection={updateSection}

/>


<FieldInput

label="Contact Person"

value={customer.contact_person}

section="customer"

field="contact_person"

updateSection={updateSection}

/>


<FieldInput

label="Contact Number"

value={customer.contact_number}

section="customer"

field="contact_number"

updateSection={updateSection}

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

/>

<FieldInput
label="Client Contact Email"
value={customer.client_contact_email}
section="customer"
field="client_contact_email"
updateSection={updateSection}
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

</div>

</div>

)

}


// ====================================
// INPUT
// ====================================

function FieldInput({

label,

value,

section,

field,

updateSection

}){

return(

<div className="survey-field">

<label>

{label}

</label>

<input

value={value || ""}

onChange={(e)=>

updateSection(

section,

field,

e.target.value

)

}

/>

</div>

)

}


// ====================================
// SELECT
// ====================================

function FieldSelect({

label,

value,

section,

field,

options,

updateSection

}){

return(

<div className="survey-field">

<label>

{label}

</label>

<select

value={value || ""}

onChange={(e)=>

updateSection(

section,

field,

e.target.value

)

}

>

<option value="">

Select

</option>

{

options.map(

item=>(

<option

key={item}

value={item}

>

{item}

</option>

)

)

}

</select>

</div>

)

}

