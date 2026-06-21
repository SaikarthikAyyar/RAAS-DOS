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

export default function SectionF_Dewatering() {

    return (

        <div className="survey-card">

            <div className="survey-header">

                <h2>

                    F. Dewatering Basic Questions

                </h2>

                <span>

                    Sales/customer observation

                </span>

            </div>


            <div className="survey-grid">


                <div className="survey-field">

                    <label>Dewatering Required?</label>

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


                <div className="survey-field">

                    <label>Dewatering Volume</label>

                    <input />

                </div>


                <div className="survey-field">

                    <label>Inlet Moisture %</label>

                    <input />

                </div>


                <div className="survey-field">

                    <label>Target Final Moisture %</label>

                    <input />

                </div>


                <div className="survey-field">

                    <label>Expected Final Form</label>

                    <select>

                        {

                            finalFormOptions.map(item=>(

                                <option key={item}>

                                    {item}

                                </option>

                            ))

                        }

                    </select>

                </div>


                <div className="survey-field">

                    <label>Visible Free Water?</label>

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


                <div className="survey-field">

                    <label>Natural Settling Ability</label>

                    <select>

                        {

                            settlingOptions.map(item=>(

                                <option key={item}>

                                    {item}

                                </option>

                            ))

                        }

                    </select>

                </div>


                <div className="survey-field">

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


                <div className="survey-field">

                    <label>Space for Bags / Holding?</label>

                    <select>

                        {

                            spaceOptions.map(item=>(

                                <option key={item}>

                                    {item}

                                </option>

                            ))

                        }

                    </select>

                </div>


                <div className="survey-field">

                    <label>Filtrate Route Available?</label>

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


                <div className="survey-field">

                    <label>Customer Demands Final Moisture Guarantee?</label>

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


                <div className="survey-field">

                    <label>Cake Handling Scope</label>

                    <select>

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