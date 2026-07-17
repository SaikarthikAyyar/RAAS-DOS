import {

nearestHubs,

urgencyOptions

}

from "../../data/salesSurveyOptions";


export default function Section1_CustomerSite({

customerData,

updateSection,

checkExistingCustomer,

duplicateCustomer,

checking

}){

const customer=

customerData.customer || {};


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


<FieldInput

label="Company Name"

value={customer.company_name}

section="customer"

field="company_name"

updateSection={updateSection}

checkExistingCustomer={checkExistingCustomer}

duplicateCustomer={duplicateCustomer}

checking={checking}

/>


<FieldInput

label="Plant / Site Location"

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

updateSection,

checkExistingCustomer,

duplicateCustomer,

checking

}){

const isCompanyField = field==="company_name";

return(

<div className="survey-field">

<label>

{label}

</label>

<input

value={value || ""}

onChange={(e)=>{

updateSection(

section,

field,

e.target.value

);

if (
    isCompanyField &&
    checkExistingCustomer
){
    checkExistingCustomer(
        e.target.value
    );
}

}}

/>

{

isCompanyField && checking && (

<div

style={{

fontSize:"12px",

color:"#666",

marginTop:"5px"

}}

>

Checking customer...

</div>

)

}

{

isCompanyField && duplicateCustomer && (

<div

style={{

marginTop:"8px",

padding:"10px",

background:"#fff4e5",

border:"1px solid #ff9800",

borderRadius:"6px",

fontSize:"13px"

}}

>

<div>

<strong>

Customer already exists

</strong>

</div>

<div>

Request ID :

{" "}

{duplicateCustomer.customer_request_id}

</div>

<div>

Status :

{" "}

{duplicateCustomer.status}

</div>

<div>

Submission is disabled until this request is completed.

</div>

</div>

)

}

</div>

);

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