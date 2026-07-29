// =========================================
// IMPORTS
// =========================================

import { useState } from "react";

import "../components/Administration/administration.css";

import AdministrationUsers
from "../components/Administration/Users/AdministrationUsers";

import AdministrationPartners
from "../components/Administration/Partners/AdministrationPartners";

import AdministrationRoles
from "../components/Administration/AdministrationRoles";


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

    const [

        createRoleSignal,

        setCreateRoleSignal

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

                                    activeTab==="roles"

                                ){

                                    setCreateRoleSignal(

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

                            activeTab==="roles"

                            ?

                            "Add Role"

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

                <AdministrationRoles

                    createSignal={

                        createRoleSignal

                    }

                />

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