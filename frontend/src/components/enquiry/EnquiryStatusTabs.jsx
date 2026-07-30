// =========================================
// COMPONENT
// =========================================

export default function EnquiryStatusTabs({

    activeTab,

    onTabChange

}){

    console.log(

        "[EnquiryStatusTabs] Component Loaded"

    );

    const tabs = [

        {

            label: "Open",

            value: "OPEN"

        },

        {

            label: "Closed",

            value: "CLOSED"

        },

        {

            label: "Lost",

            value: "LOST"

        },

        {

            label: "Archived",

            value: "ARCHIVED"

        },

        {

            label: "All",

            value: null

        }

    ];

    return(

        <div className="enquiry-status-tabs">

            {

                tabs.map(

                    tab=>(

                        <button

                            key={

                                tab.label

                            }

                            type="button"

                            className={

                                activeTab===tab.value

                                ?

                                "enquiry-status-tab active"

                                :

                                "enquiry-status-tab"

                            }

                            onClick={

                                ()=>onTabChange?.(

                                    tab.value

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