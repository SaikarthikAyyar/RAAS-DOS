// ====================================
// IMPORTS
// ====================================

import "./JobCreation.css";

import { useState } from "react";


// ====================================
// COMPONENT
// ====================================

export default function AllocationCard({

    allocation

}){

    console.log(

        "\n========== ALLOCATION CARD =========="

    );

    console.log(

        allocation

    );

    console.log(

        "=====================================\n"

    );

    return(

        <div className="jobCard">

            <h2>

                Recommended vs Approved Allocation

            </h2>

            <div className="jobTable">

                <div className="jobTableHeader">

                    <div>

                        Item

                    </div>

                    <div>

                        Recommended

                    </div>

                    <div>

                        Approved

                    </div>

                    <div>

                        Status

                    </div>

                </div>

                <AllocationRow

                    title="Service Configuration"

                    recommended={

                        allocation?.service_configuration

                    }

                    options={[

                        "SC-COMPACT",

                        "SC-STANDARD",

                        "SC-HEAVY",

                        "SC-AQUA"

                    ]}

                />

                <AllocationRow

                    title="Machine"

                    recommended={

                        allocation?.recommended_machine

                    }

                    options={[

                        "CD100M",

                        "CD160M",

                        "CD225M",

                        "CD400M",

                        "Matsya Diesel Operated Aqua Machine"

                    ]}

                />

                <AllocationRow

                    title="Pump Package"

                    recommended={

                        allocation?.pump_hose_package

                    }

                    options={[

                        "Package A",

                        "Package B",

                        "Package C",

                        "Aqua pump package | Floating hose"

                    ]}

                />

                <AllocationRow

                    title="Dewatering Package"

                    recommended={

                        allocation?.dewatering_method

                    }

                    options={[

                        "N/A",

                        "Basic",

                        "Standard",

                        "Advanced"

                    ]}

                />

            </div>

        </div>

    );

}


// ====================================
// ROW
// ====================================

function AllocationRow({

    title,

    recommended,

    options

}){

    const[

        approved,

        setApproved

    ] = useState(

        recommended || ""

    );

    const[

        confirmed,

        setConfirmed

    ] = useState(

        false

    );

    return(

        <div className="jobTableRow">

            <div>

                {title}

            </div>

            <div>

                {recommended || "-"}

            </div>

            <div>

                <select

                    className="jobSelect"

                    value={

                        approved

                    }

                    disabled={

                        confirmed

                    }

                    onChange={

                        event=>

                        setApproved(

                            event.target.value

                        )

                    }

                >

                    {

                        options.map(

                            option=>(

                                <option

                                    key={

                                        option

                                    }

                                    value={

                                        option

                                    }

                                >

                                    {option}

                                </option>

                            )

                        )

                    }

                </select>

                {

                    !confirmed && (

                        <button

                            className="jobPrimaryButton"

                            style={{

                                marginTop:"10px"

                            }}

                            onClick={

                                ()=>setConfirmed(

                                    true

                                )

                            }

                        >

                            Confirm

                        </button>

                    )

                }

            </div>

            <div>

                {

                    confirmed ? (

                        <span

                            className="jobStatus jobStatusAssigned"

                        >

                            Assigned

                        </span>

                    ) : (

                        <span

                            className="jobStatus jobStatusPending"

                        >

                            Pending

                        </span>

                    )

                }

            </div>

        </div>

    );

}