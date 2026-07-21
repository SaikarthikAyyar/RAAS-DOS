// ====================================
// IMPORTS
// ====================================

import { useEffect } from "react";

import { useState } from "react";

import {

    getApprovedQuotes,

    getJobCreation

} from "../services/jobCreationService";


// ====================================
// HOOK
// ====================================

export default function useJobCreation(){

    const[

        loading,

        setLoading

    ] = useState(

        true

    );

    const[

        error,

        setError

    ] = useState(

        false

    );

    const[

        jobData,

        setJobData

    ] = useState({

        header:{},

        recommended:{},

        manpower:{},

        readiness:{}

    });

    const[

        approvedQuotes,

        setApprovedQuotes

    ] = useState(

        []

    );


    const[

        selectedQuote,

        setSelectedQuote

    ] = useState(

        ""

    );


    // ====================================
    // LOAD
    // ====================================

    useEffect(

        ()=>{

            loadJob();

        },

        []

    );




    // ====================================
    // LOAD JOB
    // ====================================

    async function loadJob(){

        try{

            console.log(

                "\n========== JOB CREATION HOOK =========="

            );

            setLoading(

                true

            );

            const quotes = await getApprovedQuotes();

            setApprovedQuotes(

                quotes

            );

            if(

                quotes.length > 0

            ){

                await handleQuoteChange(

                    quotes[0].quote_id

                );

            }

            console.log(

                "=======================================\n"

            );

        }

        catch(

            exception

        ){

            console.log(

                exception

            );

            setError(

                true

            );

        }



    }



    // ====================================
    // HANDLE QUOTE CHANGE
    // ====================================

    async function handleQuoteChange(

        quoteId

    ){

        try{

            setLoading(

                true

            );

            setSelectedQuote(

                quoteId

            );

            const data = await getJobCreation(

                quoteId

            );

            setJobData(

                data

            );

        }

        catch(

            exception

        ){

            console.log(

                exception

            );

            setError(

                true

            );

        }

        finally{

            setLoading(

                false

            );

        }

    }


    // ====================================
    // RETURN
    // ====================================

    return{

        loading,

        error,

        jobData,

        approvedQuotes,

        selectedQuote,

        handleQuoteChange

    };



}