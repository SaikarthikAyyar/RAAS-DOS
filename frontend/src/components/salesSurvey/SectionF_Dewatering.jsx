// ====================================
// IMPORTS
// ====================================

import LookupSelect from "../shared/LookupSelect";

import FieldTooltip from "../shared/FieldTooltip";


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
                    value={dewatering.dewatering_required || ""}
                    section="dewatering"
                    field="dewatering_required"
                    updateSection={updateSection}
                    tooltip="Whether the removed material needs to be dried/separated from water before disposal."
                />


                <FieldInput
                    label="Dewatering Volume (m³)"
                    value={dewatering.dewatering_volume}
                    section="dewatering"
                    field="dewatering_volume"
                    type="number"
                    disabled={disabled}
                    updateSection={updateSection}
                    tooltip="The estimated volume of material that will need dewatering, in cubic metres."
                />


                <FieldInput
                    label="Inlet Moisture %"
                    value={dewatering.inlet_moisture}
                    section="dewatering"
                    field="inlet_moisture"
                    type="number"
                    disabled={disabled}
                    updateSection={updateSection}
                    tooltip="The estimated moisture content of the material before dewatering."
                />


                <FieldInput
                    label="Target Final Moisture %"
                    value={dewatering.target_final_moisture}
                    section="dewatering"
                    field="target_final_moisture"
                    type="number"
                    disabled={disabled}
                    updateSection={updateSection}
                    tooltip="The desired moisture content of the material after dewatering."
                />


                <LookupSelect
                    listKey="finalForm"
                    label="Expected Final Form"
                    value={dewatering.expected_final_form}
                    section="dewatering"
                    field="expected_final_form"
                    disabled={disabled}
                    updateSection={updateSection}
                    tooltip="What the dewatered material will look like/behave like once processed (e.g. cake, granular)."
                />


                <LookupSelect
                    listKey="yesNoNA"
                    label="Visible Free Water?"
                    value={dewatering.visible_free_water}
                    section="dewatering"
                    field="visible_free_water"
                    disabled={disabled}
                    updateSection={updateSection}
                    tooltip="Whether standing water is visibly separate from the material."
                />


                <LookupSelect
                    listKey="settling"
                    label="Natural Settling Ability"
                    value={dewatering.natural_settling}
                    section="dewatering"
                    field="natural_settling"
                    disabled={disabled}
                    updateSection={updateSection}
                    tooltip="How readily the solids in the material settle out on their own, without chemical treatment."
                />


                <LookupSelect
                    listKey="yesNoNA"
                    label="Oily / Emulsified?"
                    value={dewatering.oily_emulsified}
                    section="dewatering"
                    field="oily_emulsified"
                    disabled={disabled}
                    updateSection={updateSection}
                    tooltip="Whether the material contains oil or an oil-water emulsion - affects the dewatering method."
                />


                <LookupSelect
                    listKey="space"
                    label="Space for Bags / Holding?"
                    value={dewatering.space_available}
                    section="dewatering"
                    field="space_available"
                    disabled={disabled}
                    updateSection={updateSection}
                    tooltip="Whether there's on-site space to hold dewatering bags or containers."
                />


                <LookupSelect
                    listKey="yesNoNA"
                    label="Filtrate Route Available?"
                    value={dewatering.filtrate_route}
                    section="dewatering"
                    field="filtrate_route"
                    disabled={disabled}
                    updateSection={updateSection}
                    tooltip="Whether there's somewhere to route the liquid separated out during dewatering (e.g. a drain)."
                />


                <LookupSelect
                    listKey="yesNoNA"
                    label="Customer Demands Final Moisture Guarantee?"
                    value={dewatering.moisture_guarantee}
                    section="dewatering"
                    field="moisture_guarantee"
                    disabled={disabled}
                    updateSection={updateSection}
                    tooltip="Whether the customer requires a contractual guarantee on the final moisture percentage."
                />


                <LookupSelect
                    listKey="cakeHandling"
                    label="Cake Handling Scope"
                    value={dewatering.cake_handling_scope}
                    section="dewatering"
                    field="cake_handling_scope"
                    disabled={disabled}
                    updateSection={updateSection}
                    tooltip="Who is responsible for handling/removing the dewatered solid cake after processing."
                />

                {
                    dewatering.filtrate_route === "Yes" && (
                        <FieldInput
                            label="Filtrate Route Detail"
                            value={dewatering.filtrate_route_detail}
                            section="dewatering"
                            field="filtrate_route_detail"
                            disabled={disabled}
                            updateSection={updateSection}
                            tooltip="A description of where the separated liquid (filtrate) will be routed to."
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
                    tooltip="Whether the customer permits using flocculant/polymer chemicals to speed up dewatering."
                />

                <FieldInput
                    label="Commitment"
                    value={dewatering.commitment}
                    section="dewatering"
                    field="commitment"
                    disabled={disabled}
                    updateSection={updateSection}
                    tooltip="Any specific commitment made to the customer regarding the dewatering outcome."
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

    updateSection,

    tooltip

}){

    return(

        <div className={`survey-field${disabled ? " disabled" : ""}`}>

            <label>{label}<FieldTooltip text={tooltip}/></label>

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


