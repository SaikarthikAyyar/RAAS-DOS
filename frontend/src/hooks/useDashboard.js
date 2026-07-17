// ====================================
// IMPORTS
// ====================================

import { useEffect, useState } from "react";

import {

    getDashboard

} from "../services/dashboardService";


// ====================================
// HOOK
// ====================================

export default function useDashboard(){

    const [

        dashboard,

        setDashboard

    ] = useState(null);

    const [

        receivedEnquiryId,

        setReceivedEnquiryId

    ] = useState(null);

    const [

        sentEnquiryId,

        setSentEnquiryId

    ] = useState(null);

    const ROLE_MAP = {

        ops: "OPERATIONS",

        sales: "SALES",

        customer: "CUSTOMER",

        manager: "MANAGER",

        admin: "ADMIN"

    };

    const role =
        ROLE_MAP[
            (localStorage.getItem("userRole") || "").toLowerCase()
        ] || "";


    // ====================================
    // LOAD
    // ====================================

    async function loadDashboard(){

        try{

            const data = await getDashboard(

                role,

                receivedEnquiryId,

                sentEnquiryId

            );

            console.log(data);

            setDashboard(data);

        }

        catch(error){

            console.error(error);

        }

    }


    // ====================================
    // RELOAD
    // ====================================

    useEffect(()=>{

        loadDashboard();

    },[

        role,

        receivedEnquiryId,

        sentEnquiryId

    ]);


    // ====================================
    // RETURN
    // ====================================

    return{

        dashboard,

        receivedEnquiryId,

        setReceivedEnquiryId,

        sentEnquiryId,

        setSentEnquiryId,

        reloadDashboard: loadDashboard

    };

}