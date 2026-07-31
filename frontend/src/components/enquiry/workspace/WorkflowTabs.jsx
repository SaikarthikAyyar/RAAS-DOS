// ====================================
// WORKFLOW TABS
// ====================================

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
        id: "techno-commercial",
        label: "Techno Commercial"
    },

    {
        id: "commercial-approval",
        label: "Commercial Approval"
    },

    {
        id: "purchase-order",
        label: "Purchase Order"
    },

    {
        id: "job",
        label: "Job"
    },

    {
        id: "execution",
        label: "Execution"
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