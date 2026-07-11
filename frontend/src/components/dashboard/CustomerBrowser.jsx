// ====================================
// IMPORTS
// ====================================



import {

    useState

} from "react";

import "./Dashboard.css";


// ====================================
// COMPONENT
// ====================================

export default function CustomerBrowser({

    customers,

    customerNavigator,

    selectedCustomerId,

    setSelectedCustomerId,

    startCustomerId,

    setStartCustomerId

}){

    console.log(

        "\n========== CUSTOMER BROWSER =========="

    );

    console.log(

        "Visible Customers:",

        customerNavigator?.map(

            customer=>customer.id

        )

    );

    console.log(

        "Selected Customer:",

        selectedCustomerId

    );

    console.log(

        "======================================\n"

    );

    const [

        dropdownOpen,

        setDropdownOpen

    ] = useState(

        false

    );

    if(

        !customers

    ){

        return null;

    }



    function previous(){

        if(

            startCustomerId>1

        ){

            const nextCustomer =

                startCustomerId-1;

            setStartCustomerId(

                nextCustomer

            );

            setSelectedCustomerId(

                nextCustomer

            );

        }

    }

    function next(){

        const nextCustomer =

            startCustomerId+1;

        setStartCustomerId(

            nextCustomer

        );

        setSelectedCustomerId(

            nextCustomer

        );

    }

    return(

        <div className="dashboard-browser">

            <div className="dashboard-browser-top">

                <button

                    className="dashboard-nav-button"

                    onClick={previous}

                >

                    ◀

                </button>

                <div className="dashboard-customer-strip">

                    {

                        customers.map(

                            customer=>(

                                <button

                                    key={customer.id}

                                    className={

                                        customer.id===selectedCustomerId

                                        ?

                                        "dashboard-customer active"

                                        :

                                        "dashboard-customer"

                                    }

                                    onClick={()=>{

                                        console.log(

                                            "Customer Selected:",

                                            customer.id

                                        );

                                        setSelectedCustomerId(

                                            customer.id

                                        );

                                        setStartCustomerId(

                                            customer.id

                                        );

                                    }}

                                >

                                    CR-{customer.id}

                                </button>

                            )

                        )

                    }

                </div>

                <button

                    className="dashboard-nav-button"

                    onClick={next}

                >

                    ▶

                </button>

            </div>

            <div className="dashboard-browser-bottom">

                <button

                    className="dashboard-dropdown-button"

                    onClick={()=>{

                        setDropdownOpen(

                            !dropdownOpen

                        );

                    }}

                >

                    Customer Request {selectedCustomerId}

                    <span>

                        {dropdownOpen ? "▲" : "▼"}

                    </span>

                </button>

                {

                    dropdownOpen && (

                        <div className="dashboard-dropdown-list">

                            {

                                customers.map(

                                    customer=>(

                                        <div

                                            key={customer.id}

                                            className={

                                                customer.id===selectedCustomerId

                                                ?

                                                "dashboard-dropdown-item active"

                                                :

                                                "dashboard-dropdown-item"

                                            }

                                            onClick={()=>{

                                                console.log(

                                                    "Dropdown Customer:",

                                                    customer.id

                                                );

                                                setSelectedCustomerId(

                                                    customer.id

                                                );

                                                setStartCustomerId(

                                                    customer.id

                                                );

                                                setDropdownOpen(

                                                    false

                                                );

                                            }}

                                        >

                                            Customer Request {customer.id}

                                        </div>

                                    )

                                )

                            }

                        </div>

                    )

                }

            </div>

        </div>

    );

}