// =========================================
// IMPORTS
// =========================================

import { useState } from "react";

import "../components/Administration/administration.css";

import AdministrationUsers
from "../components/Administration/Users/AdministrationUsers";

import AdministrationPartners
from "../components/Administration/Partners/AdministrationPartners";


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

        createPartnerSignal,

        setCreatePartnerSignal

    ] = useState(

        0

    );

    const [

        createUserSignal,

        setCreateUserSignal

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

                            onClick={()=>{

                                if(

                                    activeTab==="users"

                                ){

                                    setCreateUserSignal(

                                        previous=>previous+1

                                    );

                                }

                                else if(

                                    activeTab==="partners"

                                ){

                                    setCreatePartnerSignal(

                                        previous=>previous+1

                                    );

                                }

                            }}

                        >

                            {

                                activeTab==="users"

                                ?

                                "Add User"

                                :

                                activeTab==="partners"

                                ?

                                "Add Partner"

                                :

                                "Add"

                            }

                        </button>

                    </div>

                    <AdministrationUsers

                        createSignal={

                            createUserSignal

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

                            Partner Firms

                        </div>

                        <button

                            className="administration-add-button"

                            onClick={()=>{

                                setCreatePartnerSignal(

                                    previous=>previous+1

                                );

                            }}

                        >

                            Add Partner

                        </button>

                    </div>

                    <AdministrationPartners

                        createSignal={

                            createPartnerSignal

                        }

                    />

                </section>

            }

        </div>

    );

}