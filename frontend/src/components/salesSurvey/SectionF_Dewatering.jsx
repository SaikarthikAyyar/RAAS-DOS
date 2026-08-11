// ====================================
// IMPORTS
// ====================================

import LookupSelect from "../shared/LookupSelect";


// ====================================
// COMPONENT
// ====================================

export default function SectionF_Dewatering({

    surveyData,

    updateSection

}) {

    const dewatering = surveyData?.dewatering || {};

    const disabled = dewatering.dewatering_required === "No";

    return (

        <div className="survey-card">

            <div className="survey-header">

                <h2>

                    F. Dewatering Basic Questions

                </h2>


            </div>


            <div className="survey-grid">


                <LookupSelect
                    listKey="yesNoNA"
                    label="Dewatering Required?"
                    value={dewatering.dewatering_required || "Yes"}
                    section="dewatering"
                    field="dewatering_required"
                    updateSection={updateSection}
                />


                <FieldInput
                    label="Dewatering Volume (m³)"
                    value={dewatering.dewatering_volume}
                    section="dewatering"
                    field="dewatering_volume"
                    type="number"
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <FieldInput
                    label="Inlet Moisture %"
                    value={dewatering.inlet_moisture}
                    section="dewatering"
                    field="inlet_moisture"
                    type="number"
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <FieldInput
                    label="Target Final Moisture %"
                    value={dewatering.target_final_moisture}
                    section="dewatering"
                    field="target_final_moisture"
                    type="number"
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <LookupSelect
                    listKey="finalForm"
                    label="Expected Final Form"
                    value={dewatering.expected_final_form}
                    section="dewatering"
                    field="expected_final_form"
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <LookupSelect
                    listKey="yesNoNA"
                    label="Visible Free Water?"
                    value={dewatering.visible_free_water}
                    section="dewatering"
                    field="visible_free_water"
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <LookupSelect
                    listKey="settling"
                    label="Natural Settling Ability"
                    value={dewatering.natural_settling}
                    section="dewatering"
                    field="natural_settling"
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <LookupSelect
                    listKey="yesNoNA"
                    label="Oily / Emulsified?"
                    value={dewatering.oily_emulsified}
                    section="dewatering"
                    field="oily_emulsified"
                    updateSection={updateSection}
                />


                <LookupSelect
                    listKey="space"
                    label="Space for Bags / Holding?"
                    value={dewatering.space_available}
                    section="dewatering"
                    field="space_available"
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <LookupSelect
                    listKey="yesNoNA"
                    label="Filtrate Route Available?"
                    value={dewatering.filtrate_route}
                    section="dewatering"
                    field="filtrate_route"
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <LookupSelect
                    listKey="yesNoNA"
                    label="Customer Demands Final Moisture Guarantee?"
                    value={dewatering.moisture_guarantee}
                    section="dewatering"
                    field="moisture_guarantee"
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <LookupSelect
                    listKey="cakeHandling"
                    label="Cake Handling Scope"
                    value={dewatering.cake_handling_scope}
                    section="dewatering"
                    field="cake_handling_scope"
                    disabled={disabled}
                    updateSection={updateSection}
                />

                {
                    dewatering.filtrate_route === "Yes" && (
                        <FieldInput
                            label="Filtrate Route Detail"
                            value={dewatering.filtrate_route_detail}
                            section="dewatering"
                            field="filtrate_route_detail"
                            updateSection={updateSection}
                        />
                    )
                }

                <FieldInput
                    label="Polymer Allowed"
                    value={dewatering.polymer_allowed}
                    section="dewatering"
                    field="polymer_allowed"
                    disabled={disabled}
                    updateSection={updateSection}
                />

                <FieldInput
                    label="Commitment"
                    value={dewatering.commitment}
                    section="dewatering"
                    field="commitment"
                    disabled={disabled}
                    updateSection={updateSection}
                />


            </div>

        </div>

    );

}


// ====================================
// INPUT
// ====================================

function FieldInput({

    label,

    value,

    section,

    field,

    disabled,

    type,

    updateSection

}){

    return(

        <div className={`survey-field${disabled ? " disabled" : ""}`}>

            <label>{label}</label>

            <input

                type={type || "text"}

                disabled={disabled}

                value={value ?? ""}

                onChange={(e)=>

                    updateSection(

                        section,

                        field,

                        e.target.value

                    )

                }

            />

        </div>

    );

}


