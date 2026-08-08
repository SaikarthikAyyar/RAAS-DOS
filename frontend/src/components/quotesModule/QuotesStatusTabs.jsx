const TABS = [

    { label: "Active", value: "Active" },
    { label: "Approved", value: "Approved" },
    { label: "All", value: "All" }

];

export default function QuotesStatusTabs({

    activeTab,

    onTabChange

}){

    return (

        <div className="quotes-status-tabs">

            {
                TABS.map(tab=>(

                    <button

                        key={tab.value}

                        type="button"

                        className={

                            activeTab===tab.value
                                ? "quotes-status-tab active"
                                : "quotes-status-tab"

                        }

                        onClick={()=>onTabChange?.(tab.value)}

                    >

                        {tab.label}

                    </button>

                ))
            }

        </div>

    );

}
