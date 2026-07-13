// ====================================
// IMPORTS
// ====================================

import "../components/jobCreation/JobCreation.css";

import useJobCreation from "../hooks/useJobCreation";

import JobHeaderCard from "../components/jobCreation/JobHeaderCard";

import AllocationCard from "../components/jobCreation/AllocationCard";

import ManpowerCard from "../components/jobCreation/ManpowerCard";

import ReadinessChecklist from "../components/jobCreation/ReadinessChecklist";


// ====================================
// PAGE
// ====================================

export default function JobCreation(){

    const{

        jobData,

        loading,

        error,

        approvedQuotes,

        selectedQuote,

        handleQuoteChange

    } = useJobCreation();

    // ====================================
    // VERIFICATION
    // ====================================

    console.log(

        "\n========== JOB CREATION PAGE =========="

    );

    console.log(

        "Loading:",

        loading

    );

    console.log(

        "Error:",

        error

    );

    console.log(

        "Job Data:",

        jobData

    );

    console.log(

        "=======================================\n"

    );

    if(

        loading

    ){

        return(

            <div>

                Loading Job Creation...

            </div>

        );

    }

    if(

        error

    ){

        return(

            <div>

                Failed to load Job Creation.

            </div>

        );

    }

    return(

        <div className="jobCreationPage">

            <JobHeaderCard

                header={

                    jobData.header

                }

                quotes={

                    approvedQuotes

                }

                selectedQuote={

                    selectedQuote

                }

                handleQuoteChange={

                    handleQuoteChange

                }

            />

            <AllocationCard

                allocation={

                    jobData.recommended

                }

            />

            <div className="jobCreationBottom">

                <ManpowerCard

                    manpower={

                        jobData.manpower

                    }

                />

                <ReadinessChecklist

                    checklist={

                        jobData.readiness

                    }

                />

            </div>

        </div>

    );

}