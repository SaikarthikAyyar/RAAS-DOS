// ====================================
// IMPORTS
// ====================================

import "./JobCreation.css";

import { useState } from "react";


// ====================================
// COMPONENT
// ====================================

export default function ReadinessChecklist({

    checklist

}){

    console.log(

        "\n========== READINESS CHECKLIST =========="

    );

    console.log(

        checklist

    );

    console.log(

        "=========================================\n"

    );

    const[

        readiness,

        setReadiness

    ] = useState({

        machine_reserved:"Pending",

        pump_ready:"Pending",

        accessories_ready:"Pending",

        manpower_assigned:"Pending",

        customer_page:"Pending"

    });


    function updateStatus(

        key,

        value

    ){

        setReadiness({

            ...readiness,

            [key]:value

        });

    }


    const rows=[

        {

            label:"Machine Reserved",

            key:"machine_reserved"

        },

        {

            label:"Pump Package Ready",

            key:"pump_ready"

        },

        {

            label:"Accessories Available",

            key:"accessories_ready"

        },

        {

            label:"Manpower Assigned",

            key:"manpower_assigned"

        },

        {

            label:"Customer Status Page Published",

            key:"customer_page"

        }

    ];


    return(

        <div className="jobCard">

            <h2>

                Readiness Checklist

            </h2>

            <div className="jobTable">

                <div className="jobTableHeader">

                    <div>

                        Checklist Item

                    </div>

                    <div>

                        Status

                    </div>

                </div>

                {

                    rows.map(

                        row=>(

                            <div

                                key={

                                    row.key

                                }

                                className="jobTableRow"

                            >

                                <div>

                                    {

                                        row.label

                                    }

                                </div>

                                <div>

                                    <select

                                        value={

                                            readiness[

                                                row.key

                                            ]

                                        }

                                        onChange={

                                            event=>

                                            updateStatus(

                                                row.key,

                                                event.target.value

                                            )

                                        }

                                    >

                                        <option>

                                            Pending

                                        </option>

                                        <option>

                                            Partial

                                        </option>

                                        <option>

                                            Done

                                        </option>

                                        <option>

                                            Not Required

                                        </option>

                                    </select>

                                </div>

                            </div>

                        )

                    )

                }

            </div>

            <div className="jobActions">

                <button

                    className="jobPrimaryButton"

                >

                    Approve Job Plan

                </button>

            </div>

        </div>

    );

}