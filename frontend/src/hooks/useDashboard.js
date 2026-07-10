// ====================================
// IMPORTS
// ====================================

import {

    useEffect,

    useState

} from "react";

import {

    getDashboard,

    getDashboardCustomerList

} from "../services/dashboardService";


// ====================================
// HOOK
// ====================================

export default function useDashboard(){

    // ====================================
    // DASHBOARD DATA
    // ====================================

    const [

        dashboard,

        setDashboard

    ] = useState(

        null

    );

    const [

        customerNavigator,

        setCustomerNavigator

    ] = useState(

        []

    );

    // ====================================
    // SELECTIONS
    // ====================================

    const [

        startCustomerId,

        setStartCustomerId

    ] = useState(

        1

    );


    const [

        startSurveyId,

        setStartSurveyId

    ] = useState(1);

    const [

        selectedCustomerId,

        setSelectedCustomerId

    ] = useState(

        null

    );

    const [

        selectedSurveyId,

        setSelectedSurveyId

    ] = useState(

        null

    );

    // ====================================
    // LOAD DASHBOARD
    // ====================================

    async function loadDashboard(){

        try{

            const data = await getDashboard(

                startCustomerId,

                selectedCustomerId,

                selectedSurveyId

            );

            console.log(

                "Dashboard Loaded:",

                data

            );

            setDashboard(

                data

            );

        }

        catch(error){

            console.error(

                "Dashboard Load Failed:",

                error

            );

        }

    }

    // ====================================
    // RELOAD
    // ====================================

    useEffect(

        ()=>{

            loadDashboard();

        },

        [

            startCustomerId,

            selectedCustomerId,

            selectedSurveyId

        ]

    );

    useEffect(

        ()=>{

            loadCustomerNavigator();

        },

        []

    );

    // ====================================
    // RETURN
    // ====================================

    return{

        dashboard,
        customerNavigator,

        startCustomerId,

        setStartCustomerId,

        startSurveyId,

        setStartSurveyId,

        selectedCustomerId,

        setSelectedCustomerId,

        selectedSurveyId,

        setSelectedSurveyId,


        reloadDashboard: loadDashboard

    };

    // ====================================
// LOAD CUSTOMER NAVIGATOR
// ====================================

async function loadCustomerNavigator(){

        try{

            const customers = await getDashboardCustomerList();

            console.log(

                "Customer Navigator Loaded:",

                customers

            );

            setCustomerNavigator(

                customers

            );

        }

        catch(error){

            console.error(

                "Customer Navigator Failed:",

                error

            );

        }

    }

}

