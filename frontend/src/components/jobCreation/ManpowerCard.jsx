// ====================================
// IMPORTS
// ====================================

import { useMemo } from "react";

import { useState } from "react";

import "./JobCreation.css";


// ====================================
// COMPONENT
// ====================================

export default function ManpowerCard({

    manpower

}){

    const roles=[

        {

            role:"Supervisor",

            required:1

        },

        {

            role:"Operator",

            required:2

        },

        {

            role:"Helper",

            required:2

        },

        {

            role:"Safety Officer",

            required:1

        }

    ];

    const[

        assignments,

        setAssignments

    ] = useState({});

    const[

        confirmed,

        setConfirmed

    ] = useState({});



    // ====================================
    // INPUT CHANGE
    // ====================================

    function updateName(

        role,

        index,

        value

    ){

        setAssignments(

            previous=>{

                const next={

                    ...previous

                };

                if(

                    !next[role]

                ){

                    next[role]=[];

                }

                next[role][index]=value;

                return{

                    ...next

                };

            }

        );

    }



    // ====================================
    // STATUS
    // ====================================

    function isComplete(

        role,

        required

    ){

        const names=

        assignments[role] || [];

        return (

            names.filter(

                name=>name?.trim()

            ).length===required

        );

    }



    // ====================================
    // VERIFICATION
    // ====================================

    console.log(

        "\n========== MANPOWER =========="

    );

    console.log(

        assignments

    );

    console.log(

        confirmed

    );

    console.log(

        "==============================\n"

    );



    // ====================================
    // UI
    // ====================================

    return(

        <div className="jobCard">

            <h2>

                Manpower Allocation

            </h2>

            <div className="jobTable">

                <div className="jobTableHeader">

                    <div>

                        Role

                    </div>

                    <div>

                        Required

                    </div>

                    <div>

                        Assigned Personnel

                    </div>

                    <div>

                        Status

                    </div>

                </div>

                {

                    roles.map(

                        role=>(

                            <div

                                key={role.role}

                                className="jobTableRow"

                            >

                                <div>

                                    {

                                        role.role

                                    }

                                </div>

                                <div>

                                    {

                                        role.required

                                    }

                                </div>

                                <div>

                                    {

                                        Array.from(

                                            {

                                                length:

                                                role.required

                                            }

                                        ).map(

                                            (

                                                _,

                                                index

                                            )=>(

                                                <input

                                                    key={index}

                                                    className="jobInput"

                                                    placeholder={

                                                        `${role.role} ${index+1}`

                                                    }

                                                    value={

                                                        assignments[role.role]?.[index] ||

                                                        ""

                                                    }

                                                    onChange={

                                                        event=>

                                                        updateName(

                                                            role.role,

                                                            index,

                                                            event.target.value

                                                        )

                                                    }

                                                />

                                            )

                                        )

                                    }

                                    {

                                        isComplete(

                                            role.role,

                                            role.required

                                        )

                                        &&

                                        !confirmed[role.role]

                                        &&

                                        <button

                                            className="jobPrimaryButton"

                                            style={{

                                                marginTop:"12px"

                                            }}

                                            onClick={()=>{

                                                setConfirmed(

                                                    previous=>({

                                                        ...previous,

                                                        [

                                                            role.role

                                                        ]:true

                                                    })

                                                );

                                            }}

                                        >

                                            Confirm

                                        </button>

                                    }

                                </div>

                                <div>

                                    {

                                        confirmed[role.role]

                                        ?

                                        <span className="jobStatus jobStatusAssigned">

                                            Assigned

                                        </span>

                                        :

                                        <span className="jobStatus jobStatusPending">

                                            Pending

                                        </span>

                                    }

                                </div>

                            </div>

                        )

                    )

                }

            </div>

        </div>

    );

}