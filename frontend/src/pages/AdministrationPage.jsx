// =========================================
// IMPORTS
// =========================================

import { useState } from "react";

import "../components/Administration/administration.css";

import AdministrationUsers
from "../components/Administration/Users/AdministrationUsers";


// =========================================
// COMPONENT
// =========================================

export default function AdministrationPage(){

    const [

        activeTab,

        setActiveTab

    ] = useState(

        "users"

    );

    const [

        createSignal,

        setCreateSignal

    ] = useState(

        0

    );

    return(

        <div className="administration-page">

            {/* ===================================== */}
            {/* PAGE HEADER */}
            {/* ===================================== */}

            <div className="administration-header">

                <h1>

                    Administration

                </h1>

                <p>

                    Permissions only: Partners, Roles & Permissions, Users. Matrix belongs to selected role.

                </p>

            </div>


            {/* ===================================== */}
            {/* PAGE TABS */}
            {/* ===================================== */}

            <div className="administration-tabs">

                <button

                    className={

                        activeTab==="partners"

                        ?

                        "administration-tab active"

                        :

                        "administration-tab"

                    }

                    onClick={()=>setActiveTab("partners")}

                >

                    Partners

                </button>

                <button

                    className={

                        activeTab==="roles"

                        ?

                        "administration-tab active"

                        :

                        "administration-tab"

                    }

                    onClick={()=>setActiveTab("roles")}

                >

                    Roles & Permissions

                </button>

                <button

                    className={

                        activeTab==="users"

                        ?

                        "administration-tab active"

                        :

                        "administration-tab"

                    }

                    onClick={()=>setActiveTab("users")}

                >

                    Users

                </button>

            </div>


            {/* ===================================== */}
            {/* USERS CARD */}
            {/* ===================================== */}

            {

                activeTab==="users"

                &&

                <section className="administration-card">

                    <div className="administration-card-header">

                        <div className="administration-card-title">

                            Users

                        </div>

                        <button

                            className="administration-add-button"

                            onClick={()=>

                                setCreateSignal(

                                    value=>value+1

                                )

                            }

                        >

                            + Add User

                        </button>

                    </div>

                    <AdministrationUsers

                        createSignal={

                            createSignal

                        }

                    />

                </section>

            }


            {/* ===================================== */}
            {/* ROLES CARD */}
            {/* ===================================== */}

            {

                activeTab==="roles"

                &&

                <section className="administration-card">

                    <div className="administration-card-header">

                        <div className="administration-card-title">

                            Roles & Permissions

                        </div>

                    </div>

                </section>

            }


            {/* ===================================== */}
            {/* PARTNERS CARD */}
            {/* ===================================== */}

            {

                activeTab==="partners"

                &&

                <section className="administration-card">

                    <div className="administration-card-header">

                        <div className="administration-card-title">

                            Partners

                        </div>

                    </div>

                </section>

            }

        </div>

    );

}