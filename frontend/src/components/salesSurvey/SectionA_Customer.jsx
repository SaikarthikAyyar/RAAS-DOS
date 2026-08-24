import {

FieldInput

}

from "../shared/FormField";

import LookupSelect from "../shared/LookupSelect";

import FieldTooltip from "../shared/FieldTooltip";


export default function SectionA_Customer({

surveyData,

updateSection,

selectedCustomer,

customerSurveys,

selectedSurvey,

setSelectedSurvey,

errors,

touched,

touchField,

submitAttempted

}){

const customer = surveyData.customer || {};

const enquiryCreatedAt = surveyData.enquiry_created_at;

const surveyDateBeforeEnquiry = Boolean(
    customer.survey_date && enquiryCreatedAt && customer.survey_date < enquiryCreatedAt
);

// Once the user has interacted with ANY field on the form (not just
// this one), a still-empty compulsory field starts showing its error -
// moving on to a later field is exactly the signal that an earlier
// required field was skipped.
const anyFieldTouched = Object.keys(touched || {}).length > 0;

function fieldError(field){

    return errors?.[`customer.${field}`] && (anyFieldTouched || submitAttempted);

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
{/* Read-only - this page never lists/picks Customer Requests
   itself, it only ever receives one instance from the Enquiry
   Workspace's Survey tab. */}
{/* ==================================== */}

<div className="survey-field">

<label>

Customer Request

</label>

<input

value={selectedCustomer ? `CR${selectedCustomer} - ${customer.company_name || ""}` : ""}

readOnly

/>

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

<LookupSelect

listKey="nearestHub"

label="Nearest Hub*"

value={customer.nearest_hub}

section="customer"

field="nearest_hub"

updateSection={updateSection}

onBlur={()=>touchField("customer", "nearest_hub")}

error={fieldError("nearest_hub")}

errorMessage="Nearest Hub is required."

tooltip="The RAAS-DOS hub nearest the job site - determines which team is assigned and affects approval routing."

/>

{/* ==================================== */}
{/* URGENCY */}
{/* ==================================== */}

<LookupSelect

listKey="urgency"

label="Urgency*"

value={customer.urgency}

section="customer"

field="urgency"

updateSection={updateSection}

onBlur={()=>touchField("customer", "urgency")}

error={fieldError("urgency")}

errorMessage="Urgency is required."

tooltip="How soon this job needs to move forward."

/>

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

errorMessage={
    surveyDateBeforeEnquiry
        ? `Survey Date must be on or after the enquiry date (${enquiryCreatedAt}).`
        : "Survey Date is required."
}

tooltip="The date this site survey is being (or was) carried out. Must fall on or after the enquiry's creation date."

/>

<FieldInput

label="Surveyed By"

value={customer.surveyed_by}

section="customer"

field="surveyed_by"

updateSection={updateSection}

tooltip="The name of the person who conducted this survey."

/>

<LookupSelect

listKey="trigger"

label="Trigger"

value={customer.survey_trigger}

section="customer"

field="survey_trigger"

updateSection={updateSection}

tooltip="What prompted this survey/job (e.g. scheduled maintenance, breakdown, customer request)."

/>

<LookupSelect

listKey="repeatPotential"

label="Repeat Potential"

value={customer.repeat_potential}

section="customer"

field="repeat_potential"

updateSection={updateSection}

tooltip="How likely this is to become a recurring job (one-time, semi-annual, annual)."

/>

<FieldInput

label="Tentative Start Date"

type="date"

value={customer.tentative_start_date}

section="customer"

field="tentative_start_date"

updateSection={updateSection}

tooltip="The expected start date of the actual cleaning job, if known."

/>

<FieldInput

label="Tentative End Date"

type="date"

value={customer.tentative_end_date}

section="customer"

field="tentative_end_date"

updateSection={updateSection}

tooltip="The expected completion date of the job, if known."

/>

</div>

</div>

);

}
