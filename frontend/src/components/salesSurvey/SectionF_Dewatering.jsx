// ====================================
// IMPORTS
// ====================================

import {

    yesNoOptions,

    finalFormOptions,

    settlingOptions,

    spaceOptions,

    cakeHandlingOptions

}

from "../../data/salesSurveyOptions";


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


                <FieldSelect
                    label="Dewatering Required?"
                    value={dewatering.dewatering_required || "Yes"}
                    section="dewatering"
                    field="dewatering_required"
                    options={yesNoOptions}
                    updateSection={updateSection}
                />


                <FieldInput
                    label="Dewatering Volume (m³)"
                    value={dewatering.dewatering_volume}
                    section="dewatering"
                    field="dewatering_volume"
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <FieldInput
                    label="Inlet Moisture %"
                    value={dewatering.inlet_moisture}
                    section="dewatering"
                    field="inlet_moisture"
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <FieldInput
                    label="Target Final Moisture %"
                    value={dewatering.target_final_moisture}
                    section="dewatering"
                    field="target_final_moisture"
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <FieldSelect
                    label="Expected Final Form"
                    value={dewatering.expected_final_form}
                    section="dewatering"
                    field="expected_final_form"
                    options={finalFormOptions}
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <FieldSelect
                    label="Visible Free Water?"
                    value={dewatering.visible_free_water}
                    section="dewatering"
                    field="visible_free_water"
                    options={yesNoOptions}
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <FieldSelect
                    label="Natural Settling Ability"
                    value={dewatering.natural_settling}
                    section="dewatering"
                    field="natural_settling"
                    options={settlingOptions}
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <FieldSelect
                    label="Oily / Emulsified?"
                    value={dewatering.oily_emulsified}
                    section="dewatering"
                    field="oily_emulsified"
                    options={yesNoOptions}
                    updateSection={updateSection}
                />


                <FieldSelect
                    label="Space for Bags / Holding?"
                    value={dewatering.space_available}
                    section="dewatering"
                    field="space_available"
                    options={spaceOptions}
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <FieldSelect
                    label="Filtrate Route Available?"
                    value={dewatering.filtrate_route}
                    section="dewatering"
                    field="filtrate_route"
                    options={yesNoOptions}
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <FieldSelect
                    label="Customer Demands Final Moisture Guarantee?"
                    value={dewatering.moisture_guarantee}
                    section="dewatering"
                    field="moisture_guarantee"
                    options={yesNoOptions}
                    disabled={disabled}
                    updateSection={updateSection}
                />


                <FieldSelect
                    label="Cake Handling Scope"
                    value={dewatering.cake_handling_scope}
                    section="dewatering"
                    field="cake_handling_scope"
                    options={cakeHandlingOptions}
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

    updateSection

}){

    return(

        <div className={`survey-field${disabled ? " disabled" : ""}`}>

            <label>{label}</label>

            <input

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


// ====================================
// SELECT
// ====================================

function FieldSelect({

    label,

    value,

    section,

    field,

    options,

    disabled,

    updateSection

}){

    return(

        <div className={`survey-field${disabled ? " disabled" : ""}`}>

            <label>{label}</label>

            <select

                disabled={disabled}

                value={value || ""}

                onChange={(e)=>

                    updateSection(

                        section,

                        field,

                        e.target.value

                    )

                }

            >

                <option value="">Select</option>

                {

                    options.map(item=>(

                        <option key={item} value={item}>

                            {item}

                        </option>

                    ))

                }

            </select>

        </div>

    );

}
