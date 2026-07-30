// ====================================
// IMPORTS
// ====================================

import {

    useEffect,

    useState,

    useCallback

} from "react";

import "./EnquiryModuleFrontPage.css";

import EnquiryHeader from "./EnquiryHeader";

import EnquiryStatusTabs from "./EnquiryStatusTabs";

import EnquirySearchBar from "./EnquirySearchBar";

import EnquiryToolbar from "./EnquiryToolbar";

import EnquiryTable from "./EnquiryTable";

import EnquiryPagination from "./EnquiryPagination";

import {

    getEnquiries,

    archiveEnquiry,

    restoreEnquiry,

    markEnquiryLost,

    closeEnquiry,

    deleteEnquiry

} from "../../services/enquiryService";


// ====================================
// COMPONENT
// ====================================

export default function EnquiryModuleFrontPage(){

    console.log(

        "[EnquiryModuleFrontPage] Component Loaded"

    );


    // ====================================
    // STATE
    // ====================================

    const [

        enquiries,

        setEnquiries

    ] = useState([]);

    const [

        loading,

        setLoading

    ] = useState(false);

    const [

        error,

        setError

    ] = useState("");

    const [

        status,

        setStatus

    ] = useState(null);

    const [

        searchText,

        setSearchText

    ] = useState("");

    const [

        page,

        setPage

    ] = useState(1);

    const [

        total,

        setTotal

    ] = useState(0);

    const pageSize = 20;


    // ====================================
    // LOAD DASHBOARD
    // ====================================

    const loadEnquiries = useCallback(

        async()=>{

            console.log(

                "[EnquiryModuleFrontPage] Loading Dashboard"

            );

            setLoading(

                true

            );

            setError(

                ""

            );

            try{

                const response = await getEnquiries({

                    status,

                    search:searchText,

                    page,

                    pageSize

                });

                setEnquiries(

                    response.items ?? []

                );

                setTotal(

                    response.total ?? 0

                );

            }

            catch(error){

                console.error(

                    error

                );

                setError(

                    error?.detail ||

                    "Unable to load enquiries."

                );

            }

            finally{

                setLoading(

                    false

                );

            }

        },

        [

            status,

            searchText,

            page

        ]

    );


    // ====================================
    // INITIAL LOAD
    // ====================================

    useEffect(

        ()=>{

            loadEnquiries();

        },

        [

            loadEnquiries

        ]

    );


    // ====================================
    // STATUS
    // ====================================

    function handleStatusChange(

        value

    ){

        setStatus(

            value

        );

        setPage(

            1

        );

    }


    // ====================================
    // SEARCH
    // ====================================

    function handleSearchChange(

        value

    ){

        setSearchText(

            value

        );

        setPage(

            1

        );

    }


    // ====================================
    // PAGINATION
    // ====================================

    function handlePageChange(

        nextPage

    ){

        setPage(

            nextPage

        );

    }


    // ====================================
    // COMMON LIFECYCLE EXECUTOR
    // ====================================

    async function executeLifecycleAction(

        action

    ){

        try{

            await action();

            await loadEnquiries();

        }

        catch(error){

            console.error(

                error

            );

            setError(

                error?.detail ||

                "Operation failed."

            );

        }

    }


    // ====================================
    // OPEN
    // ====================================

    function handleOpen(

        enquiryId

    ){

        console.log(

            "[EnquiryModuleFrontPage] Open Enquiry:",

            enquiryId

        );

        console.log(

            "Open workflow not implemented yet."

        );
    }


    // ====================================
    // ARCHIVE
    // ====================================

    async function handleArchive(

        enquiryId

    ){

        await executeLifecycleAction(

            ()=>archiveEnquiry(

                enquiryId

            )

        );

    }


    // ====================================
    // RESTORE
    // ====================================

    async function handleRestore(

        enquiryId

    ){

        await executeLifecycleAction(

            ()=>restoreEnquiry(

                enquiryId

            )

        );

    }


    // ====================================
    // LOST
    // ====================================

    async function handleLost(

        enquiryId

    ){

        await executeLifecycleAction(

            ()=>markEnquiryLost(

                enquiryId

            )

        );

    }


    // ====================================
    // CLOSE
    // ====================================

    async function handleClose(

        enquiryId

    ){

        await executeLifecycleAction(

            ()=>closeEnquiry(

                enquiryId

            )

        );

    }


    // ====================================
    // DELETE
    // ====================================

    async function handleDelete(

        enquiryId

    ){

        await executeLifecycleAction(

            ()=>deleteEnquiry(

                enquiryId

            )

        );

    }

    function handleExport(){

        console.log(

            "[Enquiry] Export requested"

        );

        // Backend endpoint will be connected later.

    }

    function handleNewEnquiry(){

        console.log(

            "[Enquiry] New enquiry requested"

        );

        // Will navigate to Customer Request module
        // after we integrate it.

    }

    // ====================================
    // RENDER
    // ====================================

    return(

        <div className="enquiry-module-front-page">

            <EnquiryHeader />

            <EnquiryToolbar

                onExport={handleExport}

                onNewEnquiry={handleNewEnquiry}

            />

            <EnquiryStatusTabs

                activeTab={status}

                onTabChange={handleStatusChange}

            />

            <EnquirySearchBar

                searchText={searchText}

                onSearchChange={handleSearchChange}

            />

            <EnquiryTable

                items={enquiries}

                loading={loading}

                error={error}

                onView={handleOpen}

                onArchive={handleArchive}

                onRestore={handleRestore}

                onLost={handleLost}

                onClose={handleClose}

                onDelete={handleDelete}

            />

            <EnquiryPagination

                page={page}

                pageSize={pageSize}

                total={total}

                onPageChange={handlePageChange}

            />

        </div>

    );

}