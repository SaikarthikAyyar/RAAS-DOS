import {

nearestHubs,

urgencyOptions,

triggerOptions,

repeatPotentialOptions

}

from "../../data/salesSurveyOptions";

import {

FieldInput,

FieldSelect

}

from "../shared/FormField";


export default function SectionA_Customer({

surveyData,

updateSection,

customers,

selectedCustomer,

setSelectedCustomer,

customerSurveys,

selectedSurvey,

setSelectedSurvey,

errors,

touched,

touchField,

submitAttempted

}){

const customer = surveyData.customer || {};

function fieldError(field){

    return errors?.[`customer.${field}`] && (touched?.[`customer.${field}`] || submitAttempted);

}

return(

<div className="survey-card">

<div className="survey-header">

<h2>

A. Customer / Opportunity

</h2>




</div>

<div className="survey-grid">

{/* ==================================== */}
{/* CUSTOMER REQUEST */}
{/* ==================================== */}

<div className="survey-field">

<label>

Customer Request*

</label>

<select

className="customer-select"

value={selectedCustomer}

onChange={(e)=>

setSelectedCustomer(

e.target.value

)

}

>

<option value="">

Select Customer Request

</option>

{

customers.map(

customer=>(

<option

key={customer.id}

value={customer.id}

>

{`CR${customer.id} - ${customer.company_name}`}

</option>

)

)

}

</select>

</div>

{/* ==================================== */}
{/* COMPANY NAME */}
{/* ==================================== */}

<div className="survey-field">

<label>

Company Name*

</label>

<input

value={customer.company_name || ""}

readOnly

/>

</div>

{/* ==================================== */}
{/* SITE */}
{/* ==================================== */}

<div className="survey-field">

<label>

Site / Plant*

</label>

<input

value={customer.plant_site_location || ""}

readOnly

/>

</div>

{/* ==================================== */}
{/* CONTACT PERSON */}
{/* ==================================== */}

<div className="survey-field">

<label>

Person Of Contact*

</label>

<input

value={customer.contact_person || ""}

readOnly

/>

</div>

{/* ==================================== */}
{/* CONTACT NUMBER */}
{/* ==================================== */}

<div className="survey-field">

<label>

Contact Number*

</label>

<input

value={customer.contact_number || ""}

readOnly

/>

</div>

{/* ==================================== */}
{/* NEAREST HUB */}
{/* ==================================== */}

<div className={fieldError("nearest_hub") ? "survey-field field-error" : "survey-field"}>

<label>

Nearest Hub*

</label>

<select

value={customer.nearest_hub || ""}

onChange={(e)=>

updateSection(

"customer",

"nearest_hub",

e.target.value

)

}

onBlur={()=>touchField("customer", "nearest_hub")}

>

<option value="">

Select

</option>

{

nearestHubs.map(

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

{
    fieldError("nearest_hub") && (
        <span className="field-error-message">Nearest Hub is required.</span>
    )
}

</div>

{/* ==================================== */}
{/* URGENCY */}
{/* ==================================== */}

<div className={fieldError("urgency") ? "survey-field field-error" : "survey-field"}>

<label>

Urgency*

</label>

<select

value={customer.urgency || ""}

onChange={(e)=>

updateSection(

"customer",

"urgency",

e.target.value

)

}

onBlur={()=>touchField("customer", "urgency")}

>

<option value="">

Select

</option>

{

urgencyOptions.map(

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

{
    fieldError("urgency") && (
        <span className="field-error-message">Urgency is required.</span>
    )
}

</div>

{/* ==================================== */}
{/* SURVEY DATE */}
{/* ==================================== */}

<FieldInput

label="Survey Date*"

type="date"

value={customer.survey_date}

section="customer"

field="survey_date"

updateSection={updateSection}

onBlur={()=>touchField("customer", "survey_date")}

error={fieldError("survey_date")}

errorMessage="Survey Date is required."

/>

<FieldInput

label="Surveyed By"

value={customer.surveyed_by}

section="customer"

field="surveyed_by"

updateSection={updateSection}

/>

<FieldSelect

label="Trigger"

value={customer.survey_trigger}

section="customer"

field="survey_trigger"

options={triggerOptions}

updateSection={updateSection}

/>

<FieldSelect

label="Repeat Potential"

value={customer.repeat_potential}

section="customer"

field="repeat_potential"

options={repeatPotentialOptions}

updateSection={updateSection}

/>

<FieldInput

label="Tentative Start Date"

type="date"

value={customer.tentative_start_date}

section="customer"

field="tentative_start_date"

updateSection={updateSection}

/>

<FieldInput

label="Tentative End Date"

type="date"

value={customer.tentative_end_date}

section="customer"

field="tentative_end_date"

updateSection={updateSection}

/>

</div>

</div>

);

}
