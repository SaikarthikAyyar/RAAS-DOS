import SurveySummaryCard from "./SurveySummaryCard";
import SurveyMediaCard from "./SurveyMediaCard";
import "./SurveySummary.css";

import { useNavigate } from "react-router-dom";

import {
    advanceStageAtLeast
}
from "../../../services/enquiryWorkspaceService";

export default function SurveySummary({

    enquiry,

    survey,

    reload

}){
    const navigate = useNavigate();

    function handleFillEditSurvey(){

        navigate(

            "/sales-survey",

            {

                state:{

                    enquiryId:

                        enquiry.id,

                    customerRequestId:

                        enquiry.customer_request_id,

                    salesSurveyId:

                        enquiry.sales_survey_id

                }

            }

        );

    }

    async function handleRequestOpsReview(){

        await advanceStageAtLeast(

            enquiry.id,

            "OPS_REVIEW"

        );

        reload();

    }

    return(

        <div className="survey-summary-grid">

            {
                survey && (
                <>
                               <SurveySummaryCard

                title="Customer Details"

                fields={[

                    {

                        label:"Company",

                        value:survey.customer.company_name

                    },

                    {

                        label:"Plant Site",

                        value:survey.customer.plant_site_location

                    },

                    {

                        label:"Contact Person",

                        value:survey.customer.contact_person

                    },

                    {

                        label:"Contact Number",

                        value:survey.customer.contact_number

                    },

                    {

                        label:"Nearest Hub",

                        value:survey.customer.nearest_hub

                    },

                    {

                        label:"Urgency",

                        value:survey.customer.urgency

                    },

                    {

                        label:"Survey Date",

                        value:survey.customer.survey_date

                    }

                ]}

            />

            <SurveySummaryCard

                title="Job Details"

                fields={[

                    {

                        label:"Job Type",

                        value:survey.job.job_type

                    },

                    {

                        label:"Cleaning Date",

                        value:survey.job.cleaning_date

                    },

                    {

                        label:"Cleaning Frequency",

                        value:survey.job.cleaning_frequency

                    },

                    {

                        label:"Hazard Level",

                        value:survey.job.hazard_level

                    },

                    {

                        label:"pH Min",

                        value:survey.job.ph_min

                    },

                    {

                        label:"pH Max",

                        value:survey.job.ph_max

                    },

                    {

                        label:"Temperature",

                        value:survey.job.temperature_range

                    },

                    {

                        label:"Pumpable",

                        value:survey.job.pumpable

                    },

                    {

                        label:"Sample Available",

                        value:survey.job.sample_available

                    }

                ]}

            />

            <SurveySummaryCard

                title="Sludge Details"

                fields={[

                    {

                        label:"Material Category",

                        value:survey.job.material_category

                    },

                    {

                        label:"Sludge Hardness",

                        value:survey.job.sludge_hardness

                    },

                    {

                        label:"Debris Level",

                        value:survey.job.debris_level

                    },

                    {

                        label:"Water Visibility",

                        value:survey.job.water_visibility

                    },

                    {

                        label:"Bulk Density",

                        value:survey.job.bulk_density

                    },

                    {

                        label:"Large Object Type",

                        value:survey.job.large_object_type

                    },

                    {

                        label:"Flow After Agitation",

                        value:survey.job.flow_after_agitation

                    },

                    {

                        label:"Estimated Volume",

                        value:survey.geometry.estimated_volume

                    }

                ]}

            />

            <SurveySummaryCard

                title="Geometry"

                fields={[

                    {

                        label:"Tank Type",

                        value:survey.geometry.tank_type

                    },

                    {

                        label:"Length / Diameter",

                        value:survey.geometry.length_dia

                    },

                    {

                        label:"Width",

                        value:survey.geometry.width

                    },

                    {

                        label:"Sludge Depth",

                        value:survey.geometry.sludge_depth

                    },

                    {

                        label:"Opening Length",

                        value:survey.geometry.opening_length

                    },

                    {

                        label:"Opening Width",

                        value:survey.geometry.opening_width

                    },

                    {

                        label:"Height From Ground",

                        value:survey.geometry.height_from_ground

                    },

                    {

                        label:"Drop To Floor",

                        value:survey.geometry.drop_to_floor

                    },

                    {

                        label:"Vertical Lift",

                        value:survey.geometry.vertical_lift

                    }

                ]}

            />

            <SurveySummaryCard

                title="Access & Setup"

                fields={[

                    {

                        label:"Setup Distance",

                        value:survey.geometry.setup_distance

                    },

                    {

                        label:"Hose Distance",

                        value:survey.geometry.hose_distance

                    },

                    {

                        label:"Access Path Width",

                        value:survey.geometry.access_path_width

                    },

                    {

                        label:"Access Support",

                        value:survey.geometry.access_support

                    },

                    {

                        label:"Customer Support",

                        value:survey.geometry.customer_support

                    },

                    {

                        label:"Average Output",

                        value:survey.geometry.average_output

                    }

                ]}

            />

            <SurveySummaryCard

                title="Safety"

                fields={[

                    {

                        label:"Power Available",

                        value:survey.safety.power_available

                    },

                    {

                        label:"Water Available",

                        value:survey.safety.water_available

                    },

                    {

                        label:"Air Supply Available",

                        value:survey.safety.air_supply_available

                    },

                    {

                        label:"Confined Space",

                        value:survey.safety.confined_space

                    },

                    {

                        label:"Ventilation Required",

                        value:survey.safety.ventilation_required

                    },

                    {

                        label:"Gas Testing Required",

                        value:survey.safety.gas_testing_required

                    },

                    {

                        label:"EHS Restriction",

                        value:survey.safety.ehs_restriction

                    }

                ]}

            />

            <SurveySummaryCard

                title="Pump Details"

                fields={[

                    {

                        label:"Discharge Pit Dimension",

                        value:survey.pump.discharge_pit_dimension

                    },

                    {

                        label:"Discharge Medium",

                        value:survey.pump.discharge_medium

                    },

                    {

                        label:"Disposal Route",

                        value:survey.pump.disposal_route

                    },

                    {

                        label:"Disposal Responsibility",

                        value:survey.pump.disposal_responsibility

                    },

                    {

                        label:"Discharge Point Distance",

                        value:survey.pump.discharge_point_distance

                    },

                    {

                        label:"Hose Route Bends",

                        value:survey.pump.hose_route_bends

                    }

                ]}

            />

            <SurveySummaryCard

                title="Customer Insights"

                fields={[

                    {

                        label:"Customer Pain",

                        value:survey.insights.customer_pain

                    },

                    {

                        label:"Shutdown Window",

                        value:survey.insights.shutdown_window

                    },

                    {

                        label:"Completion Deadline",

                        value:survey.insights.completion_deadline

                    }

                ]}

            />

            <SurveySummaryCard

                title="Geometry & Safety (Additional)"

                fields={[

                    {

                        label:"Opening Height",

                        value:survey.geometry.opening_height

                    },

                    {

                        label:"Access Type",

                        value:survey.geometry.access_type

                    },

                    {

                        label:"Equipment Nearby",

                        value:survey.geometry.equipment_nearby

                    },

                    {

                        label:"Scaffolding Needed",

                        value:survey.geometry.scaffolding_needed

                    },

                    {

                        label:"Crane Available",

                        value:survey.geometry.crane_available

                    },

                    {

                        label:"Power Availability Distance",

                        value:survey.safety.power_distance

                    }

                ]}

            />

            <SurveySummaryCard

                title="Pump Details (Additional)"

                fields={[

                    {

                        label:"Target Flow",

                        value:survey.pump.target_flow

                    },

                    {

                        label:"Suction Depth",

                        value:survey.pump.suction_depth

                    },

                    {

                        label:"Discharge Distance",

                        value:survey.pump.discharge_distance

                    },

                    {

                        label:"Discharge Height",

                        value:survey.pump.discharge_height

                    },

                    {

                        label:"Debris / Fibers Present",

                        value:survey.pump.debris_present

                    },

                    {

                        label:"pH / Corrosiveness",

                        value:survey.pump.ph_condition

                    },

                    {

                        label:"Pump Power Source",

                        value:survey.pump.pump_power_source

                    }

                ]}

            />

            <SurveySummaryCard

                title="Dewatering Details"

                fields={[

                    {

                        label:"Dewatering Required",

                        value:survey.dewatering.dewatering_required

                    },

                    {

                        label:"Dewatering Volume",

                        value:survey.dewatering.dewatering_volume

                    },

                    {

                        label:"Inlet Moisture %",

                        value:survey.dewatering.inlet_moisture

                    },

                    {

                        label:"Target Final Moisture %",

                        value:survey.dewatering.target_final_moisture

                    },

                    {

                        label:"Expected Final Form",

                        value:survey.dewatering.expected_final_form

                    },

                    {

                        label:"Visible Free Water",

                        value:survey.dewatering.visible_free_water

                    },

                    {

                        label:"Natural Settling Ability",

                        value:survey.dewatering.natural_settling

                    },

                    {

                        label:"Oily / Emulsified",

                        value:survey.dewatering.oily_emulsified

                    },

                    {

                        label:"Space for Bags / Holding",

                        value:survey.dewatering.space_available

                    }

                ]}

            />

            <SurveySummaryCard

                title="Dewatering Details (cont.)"

                fields={[

                    {

                        label:"Filtrate Route Available",

                        value:survey.dewatering.filtrate_route

                    },

                    {

                        label:"Final Moisture Guarantee",

                        value:survey.dewatering.moisture_guarantee

                    },

                    {

                        label:"Cake Handling Scope",

                        value:survey.dewatering.cake_handling_scope

                    }

                ]}

            />

            <SurveyMediaCard

                customerRequestId={enquiry.customer_request_id}

            />
                </>

                )
            }



            <SurveySummaryCard
                title="Completeness & Actions"
                actions={

                    <div className="survey-actions">

                        <button

                            className="survey-action-button"

                            onClick={handleFillEditSurvey}

                        >

                            {

                                survey

                                    ?

                                    "Edit Survey"

                                    :

                                    "Fill Survey"

                            }

                        </button>

                        <button

                            className="survey-action-button survey-action-button-orange"

                            onClick={handleRequestOpsReview}

                        >

                            Request Ops Review

                        </button>

                    </div>

                }
            />

        </div>

    );

}