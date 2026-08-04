// ====================================
// IMPORTS
// ====================================

import "../../components/salesSurvey/SalesSurvey.css";





import { useState } from "react";

import { useNavigate } from "react-router-dom";

import useCustomerRequest from "../../hooks/useCustomerRequest";

import {
  createCustomerRequest
} from "../../services/customerService";

import {
  uploadMedia
} from "../../services/customerMediaService";

import Section1_CustomerSite
from "../../components/customerRequest/Section1_CustomerSite";

import NewSiteFields
from "../../components/customerRequest/NewSiteFields";

import Section2_RequirementBasics
from "../../components/customerRequest/Section2_RequirementBasics";

import Section3_Uploads
from "../../components/customerRequest/Section3_Uploads";

import CustomerActions
from "../../components/customerRequest/CustomerActions";


// ====================================
// ERROR MESSAGE HELPER
// ====================================

function extractErrorMessage(error){

  const detail = error?.detail;

  if(typeof detail === "string"){
    return detail;
  }

  if(detail?.message){
    return detail.message;
  }

  if(Array.isArray(detail)){
    return detail
      .map(item => item.msg)
      .filter(Boolean)
      .join(", ");
  }

  if(error?.message){
    return error.message;
  }

  return "Something went wrong while submitting the request. Please try again.";

}


// ====================================
// COMPONENT
// ====================================

export default function CustomerRequest(){



  const navigate = useNavigate();



const{

    customerData,

    updateSection,

    updateMedia

}

=

useCustomerRequest();

  const [submitting, setSubmitting] = useState(false);


  // ====================================
  // SUBMIT
  // ====================================

async function submit(){

    if(submitting){
      return;
    }

    setSubmitting(true);

    try{

      const customer =
        customerData.customer || {};

      const requirement =
        customerData.requirement || {};

      const uploads =
        customerData.uploads || {};

      if(!customer.company_name){
        alert("Company Name is required.");
        return;
      }

      if(!customer.nature_of_job){
        alert("Nature of Job is required.");
        return;
      }

      const hasExistingAsset = Boolean(customer.existing_asset_id);

      const payload = {

          company_name: customer.company_name,
          plant_site_location: customer.plant_site_location,
          contact_person: customer.contact_person,
          contact_number: customer.contact_number,
          nearest_city_hub: customer.nearest_city_hub,
          urgency: customer.urgency,
          nature_of_job: customer.nature_of_job,
          client_contact_email: customer.client_contact_email,
          lead_source: customer.lead_source,

          customer_id: customer.customer_id || null,
          asset_id: customer.existing_asset_id || null,

          division: hasExistingAsset ? null : customer.division,
          department: hasExistingAsset ? null : customer.department,

          asset_name: hasExistingAsset ? null : requirement.asset_name,
          asset_type: hasExistingAsset ? null : requirement.asset_type,
          estimated_volume: Number(requirement.estimated_volume) || null,

          service_requirement_type: requirement.service_requirement_type,
          observed_material: requirement.observed_material,
          estimated_quantity_known: requirement.estimated_quantity_known,
          tank_type: requirement.tank_type,

          approx_length_dia: Number(requirement.approx_length_dia) || null,
          approx_width: Number(requirement.approx_width) || null,
          approx_depth: Number(requirement.approx_depth) || null,

          access_opening_type: requirement.access_opening_type,
          can_place_equipment_nearby:
              requirement.can_place_equipment_nearby?.includes("Yes"),

          quote_basis: requirement.quote_basis,

          // ADD THESE
          cleaning_date: requirement.cleaning_date,
          cleaning_frequency: requirement.cleaning_frequency,

          pain_point: requirement.pain_point,

          photo_count: uploads.photos?.length || 0,
          video_count: uploads.videos?.length || 0,
          layout_count: uploads.layouts?.length || 0

      };

      console.log("PAYLOAD", payload);

      const response =
        await createCustomerRequest(payload);

      console.log("API RESPONSE", response);

      if(!response?.id){

        console.log("Customer Request Creation Failed", response);

        alert(
          "Customer request could not be created. Please check the form and try again."
        );

        return;

      }

      const customerId = response.id;

      localStorage.setItem(
        "customerRequestId",
        customerId
      );


      await uploadMedia(
        customerId,
        uploads
      );

      alert("Customer request has been created successfully.");

     navigate("/enquiry");

    }

    catch(error){

      console.error(error);

      alert(
        `Customer request could not be saved: ${extractErrorMessage(error)}`
      );

    }

    finally{

      setSubmitting(false);

    }

  }


  // ====================================
  // UI
  // ====================================

  return(

    <div className="sales-survey-page">

<Section1_CustomerSite

customerData={customerData}

updateSection={updateSection}

/>

      {

        !customerData.customer?.existing_asset_id && (

          <NewSiteFields

            customerData={customerData}

            updateSection={updateSection}

          />

        )

      }

      <Section2_RequirementBasics
        customerData={customerData}
        updateSection={updateSection}
      />



      <CustomerActions
        submit={submit}
        submitting={submitting}
      />

    </div>

  );

}
