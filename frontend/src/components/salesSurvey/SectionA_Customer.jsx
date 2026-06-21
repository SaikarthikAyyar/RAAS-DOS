import {

nearestHubs,

urgencyOptions

}

from "../../data/salesSurveyOptions";


export default function SectionA_Customer({

surveyData,

updateSection

}){


const customer = surveyData.customer || {};


return(

<div className="survey-card">


<div className="survey-header">

<h2>

A. Customer / Opportunity

</h2>

<span>

Auto filled from Customer Request

</span>

</div>


<div className="survey-grid">


<div className="survey-field">

<label>

Customer

</label>

<input

value={customer.company_name || ""}

readOnly

/>

</div>


<div className="survey-field">

<label>

Site / Plant

</label>

<select

value={customer.site_address || ""}

onChange={(e)=>

updateSection(

"customer",

"site_address",

e.target.value

)

}

>

{

nearestHubs.map(

item=>(

<option

key={item}

>

{item}

</option>

)

)

}

</select>

</div>


<div className="survey-field">

<label>

Person Of Contact

</label>

<input

value={customer.contact_person || ""}

onChange={(e)=>

updateSection(

"customer",

"contact_person",

e.target.value

)

}

/>

</div>


<div className="survey-field">

<label>

Contact Number

</label>

<input

maxLength={10}

value={customer.contact_number || ""}

onChange={(e)=>{

const value=e.target.value.replace(/\D/g,"");

updateSection(

"customer",

"contact_number",

value

);

}}

placeholder="10 digits"

/>

</div>


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

{

nearestHubs.map(

item=>(

<option

key={item}

>

{item}

</option>

)

)

}

</select>

</div>


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

{

urgencyOptions.map(

item=>(

<option

key={item}

>

{item}

</option>

)

)

}

</select>

</div>


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

)

}