// ====================================
// WORKFLOW TABS
// ====================================

import { useAuth } from "../../../contexts/AuthContext";

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
        label: "Techno-Commercial Review"
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

    const { permissions } = useAuth();

    // Falls back to "all tabs" when permissions haven't loaded yet
    // (e.g. still fetching right after login) - avoids a flash of an
    // empty tab bar for roles that have full access anyway.
    const allowedTabs = permissions?.workspaceTabs?.length
        ? WORKFLOW_TABS.filter(
            tab=>permissions.workspaceTabs.includes(`enquiry-tab-${tab.id}`)
        )
        : WORKFLOW_TABS;

    return(

        <div className="workflow-tabs">

            {

                allowedTabs.map(

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