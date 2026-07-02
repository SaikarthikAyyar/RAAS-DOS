import {

nearestHubs,

urgencyOptions

}

from "../../data/salesSurveyOptions";


export default function SectionA_Customer({

surveyData,

updateSection,

customers,

selectedCustomer,

setSelectedCustomer

}){

const customer = surveyData.customer || {};

return(

<div className="survey-card">

<div className="survey-header">

<h2>

A. Customer / Opportunity

</h2>

<div className="survey-id">

Survey ID :

{surveyData.id ? `SS-${surveyData.id}` : "Pending"}

</div>


</div>

<div className="survey-grid">

{/* ==================================== */}
{/* CUSTOMER REQUEST */}
{/* ==================================== */}

<div className="survey-field">

<label>

Customer Request

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

{`CR-${customer.id} | ${customer.company_name}`}

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

Company Name

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

Site / Plant

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

Person Of Contact

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

Contact Number

</label>

<input

value={customer.contact_number || ""}

readOnly

/>

</div>

{/* ==================================== */}
{/* NEAREST HUB */}
{/* ==================================== */}

<div className="survey-field">

<label>

Nearest Hub

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

</div>

{/* ==================================== */}
{/* URGENCY */}
{/* ==================================== */}

<div className="survey-field">

<label>

Urgency

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

</div>

{/* ==================================== */}
{/* SURVEY DATE */}
{/* ==================================== */}

<div className="survey-field">

<label>

Survey Date

</label>

<input

type="date"

value={customer.survey_date || ""}

onChange={(e)=>

updateSection(

"customer",

"survey_date",

e.target.value

)

}

/>

</div>

</div>

</div>

);

}