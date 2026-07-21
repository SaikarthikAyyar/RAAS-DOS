// ====================================
// IMPORTS
// ====================================

import {

useEffect,

useState,

useCallback

}

from "react";

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

        management: "MANAGER",

        admin: "ADMIN"

    };

    const role =
        ROLE_MAP[
            (localStorage.getItem("userRole") || "").toLowerCase()
        ] || "";

    
    console.log("Dashboard role =", role);


    // ====================================
    // LOAD
    // ====================================

    const loadDashboard = useCallback(async()=>{

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

    },[
        role,
        receivedEnquiryId,
        sentEnquiryId
    ]);


    // ====================================
    // RELOAD
    // ====================================

    useEffect(()=>{

        loadDashboard();

    },[
        role,
        receivedEnquiryId,
        sentEnquiryId,
        loadDashboard
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