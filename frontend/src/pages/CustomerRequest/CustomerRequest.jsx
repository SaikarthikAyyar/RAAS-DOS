// ====================================
// IMPORTS
// ====================================

import "../../components/salesSurvey/SalesSurvey.css";

import { useState } from "react";

import { searchCustomer } from "../../services/customerService";

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

import Section2_RequirementBasics
from "../../components/customerRequest/Section2_RequirementBasics";

import Section3_Uploads
from "../../components/customerRequest/Section3_Uploads";

import CustomerActions
from "../../components/customerRequest/CustomerActions";


// ====================================
// COMPONENT
// ====================================

export default function CustomerRequest(){

  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

useNavigate();

const{

    customerData,

    updateSection,

    updateMedia

}

=

useCustomerRequest();


  // ====================================
  // SUBMIT
  // ====================================

async function submit(){

    try{

      const customer =
        customerData.customer || {};

      const requirement =
        customerData.requirement || {};

      const uploads =
        customerData.uploads || {};

      const payload = {

          company_name: customer.company_name,
          plant_site_location: customer.plant_site_location,
          contact_person: customer.contact_person,
          contact_number: customer.contact_number,
          nearest_city_hub: customer.nearest_city_hub,
          urgency: customer.urgency,

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

        console.log(response.id);
        console.log("Customer Request Creation Failed");

        return;

      }

      const customerId = response.id;

      localStorage.setItem(
        "customerRequestId",
        customerId
      );

      alert("Customer request has been created");

      await uploadMedia(
        customerId,
        uploads
      );

      navigate("/dashboard");

    }

    catch(error){

      console.error(error);

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

      <Section2_RequirementBasics
        customerData={customerData}
        updateSection={updateSection}
      />

      <Section3_Uploads
        customerData={customerData}
        updateMedia={updateMedia}
      />

      <CustomerActions
        submit={submit}
      />

    </div>

  );

}
