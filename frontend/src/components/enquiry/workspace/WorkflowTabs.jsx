// ====================================
// WORKFLOW TABS
// ====================================

// Order and labels match the RAAS DOS wireframe's TABS array
// exactly (opsReviewTab()'s [id].js source).
const WORKFLOW_TABS = [

    {
        id: "survey",
        label: "Survey"
    },

    {
        id: "ops-review",
        label: "Ops Review"
    },

    {
        id: "techno-commercial-approval",
        label: "Techno-Commercial Approval"
    },

    {
        id: "quote-commercial",
        label: "Quote & Commercial"
    },

    {
        id: "commercial-approval",
        label: "Commercial Approval"
    },

    {
        id: "po",
        label: "PO"
    },

    {
        id: "job-created",
        label: "Job Created"
    },

    {
        id: "execution",
        label: "Execution / Job"
    },

    {
        id: "audit",
        label: "Audit Trail"
    }

];


// ====================================
// COMPONENT
// ====================================

export default function WorkflowTabs({

    activeTab,

    onTabChange

}){

    return(

        <div className="workflow-tabs">

            {

                WORKFLOW_TABS.map(

                    tab=>(

                        <button

                            key={tab.id}

                            type="button"

                            className={

                                activeTab===tab.id

                                    ? "workflow-tab workflow-tab-active"

                                    : "workflow-tab"

                            }

                            onClick={

                                ()=>onTabChange?.(

                                    tab.id

                                )

                            }

                        >

                            {tab.label}

                        </button>

                    )

                )

            }

        </div>

    );

}