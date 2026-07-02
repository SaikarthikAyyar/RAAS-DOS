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

import { useState } from "react";


// ====================================
// COMPONENT
// ====================================

export default function SectionF_Dewatering() {

    const [dewateringRequired, setDewateringRequired] = useState("Yes");

    const disabled = dewateringRequired === "No";

    return (

        <div className="survey-card">

            <div className="survey-header">

                <h2>

                    F. Dewatering Basic Questions

                </h2>


            </div>


            <div className="survey-grid">


                <div className="survey-field">

                    <label>Dewatering Required?</label>

                    <select value={dewateringRequired} onChange={e => setDewateringRequired(e.target.value)}>

                        {

                            yesNoOptions.map(item=>(

                                <option key={item} value={item}>

                                    {item}

                                </option>

                            ))

                        }

                    </select>

                </div>


                <div className={`survey-field${disabled ? " disabled" : ""}`}>

                    <label>Dewatering Volume (m³)</label>

                    <input disabled={disabled} />

                </div>


                <div className={`survey-field${disabled ? " disabled" : ""}`}>

                    <label>Inlet Moisture %</label>

                    <input disabled={disabled} />

                </div>


                <div className={`survey-field${disabled ? " disabled" : ""}`}>

                    <label>Target Final Moisture %</label>

                    <input disabled={disabled} />

                </div>


                <div className={`survey-field${disabled ? " disabled" : ""}`}>

                    <label>Expected Final Form</label>

                    <select disabled={disabled}>

                        {

                            finalFormOptions.map(item=>(

                                <option key={item}>

                                    {item}

                                </option>

                            ))

                        }

                    </select>

                </div>


                <div className={`survey-field${disabled ? " disabled" : ""}`}>

                    <label>Visible Free Water?</label>

                    <select disabled={disabled}>

                        {

                            yesNoOptions.map(item=>(

                                <option key={item}>

                                    {item}

                                </option>

                            ))

                        }

                    </select>

                </div>


                <div className={`survey-field${disabled ? " disabled" : ""}`}>

                    <label>Natural Settling Ability</label>

                    <select disabled={disabled}>

                        {

                            settlingOptions.map(item=>(

                                <option key={item}>

                                    {item}

                                </option>

                            ))

                        }

                    </select>

                </div>


                <div className={`survey-field${disabled ? " disabled" : ""}`}>

                    <label>Oily / Emulsified?</label>

                    <select>

                        {

                            yesNoOptions.map(item=>(

                                <option key={item}>

                                    {item}

                                </option>

                            ))

                        }

                    </select>

                </div>


                <div className={`survey-field${disabled ? " disabled" : ""}`}>

                    <label>Space for Bags / Holding?</label>

                    <select disabled={disabled}>

                        {

                            spaceOptions.map(item=>(

                                <option key={item}>

                                    {item}

                                </option>

                            ))

                        }

                    </select>

                </div>


                <div className={`survey-field${disabled ? " disabled" : ""}`}>

                    <label>Filtrate Route Available?</label>

                    <select disabled={disabled}>

                        {

                            yesNoOptions.map(item=>(

                                <option key={item}>

                                    {item}

                                </option>

                            ))

                        }

                    </select>

                </div>


                <div className={`survey-field${disabled ? " disabled" : ""}`}>

                    <label>Customer Demands Final Moisture Guarantee?</label>

                    <select disabled={disabled}>

                        {

                            yesNoOptions.map(item=>(

                                <option key={item}>

                                    {item}

                                </option>

                            ))

                        }

                    </select>

                </div>


                <div className={`survey-field${disabled ? " disabled" : ""}`}>

                    <label>Cake Handling Scope</label>

                    <select disabled={disabled}>

                        {

                            cakeHandlingOptions.map(item=>(

                                <option key={item}>

                                    {item}

                                </option>

                            ))

                        }

                    </select>

                </div>


            </div>

        </div>

    );

}