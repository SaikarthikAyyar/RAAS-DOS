// ====================================
// IMPORTS
// ====================================

import {

    useEffect,

    useState,

    useCallback

} from "react";

import { useNavigate } from "react-router-dom";

import "./EnquiryModuleFrontPage.css";

import EnquiryHeader from "./EnquiryHeader";

import EnquiryStatusTabs from "./EnquiryStatusTabs";

import EnquirySearchBar from "./EnquirySearchBar";

import EnquiryToolbar from "./EnquiryToolbar";

import EnquiryTable from "./EnquiryTable";

import EnquiryPagination from "./EnquiryPagination";

import { formatApiError } from "../../utils/apiError";

import {

    getEnquiries,

    archiveEnquiry,

    restoreEnquiry,

    markEnquiryLost,

    closeEnquiry,

    deleteEnquiry

} from "../../services/enquiryService";


// ====================================
// CSV EXPORT (client-side, same pattern as QuotesModule/
// BusinessMastersModule)
// ====================================

function downloadCSV(filename, headers, rows){

    const escapeCell = value=>{

        const text = value===null || value===undefined ? "" : String(value);

        return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;

    };

    const csv = [

        headers.map(escapeCell).join(","),

        ...rows.map(row=>row.map(escapeCell).join(","))

    ].join("\n");

    const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}


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

    const [

        exporting,

        setExporting

    ] = useState(false);

    const navigate = useNavigate();

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

                setError(formatApiError(error, "Unable to load enquiries."));

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

            setError(formatApiError(error, "Operation failed."));

        }

    }


    // ====================================
    // OPEN
    // ====================================

    function handleOpen(

        enquiry

    ){

        console.log(

            "[EnquiryModuleFrontPage] Opening Workspace:",

            enquiry

        );

        navigate(

            `/enquiries/workspace/${enquiry.id}`

        );

    }


    // ====================================
    // EDIT
    // Loads the linked Customer Request (via its own ID, not the
    // Enquiry ID) into the Customer Request form's edit mode, so the
    // user can correct the original enquiry-creation details post-
    // creation without touching anything workflow-related.
    // ====================================

    function handleEdit(

        enquiry

    ){

        if(!enquiry.customer_request_id){

            alert("This enquiry has no linked Customer Request to edit.");

            return;

        }

        navigate(

            `/customer-request/edit/${enquiry.customer_request_id}`

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

    async function handleExport(){

        setExporting(true);

        try{

            // The list endpoint caps page_size at 100, so a full
            // export has to page through everything rather than
            // requesting one oversized page.
            const maxPageSize = 100;

            let exportPage = 1;

            let allItems = [];

            while(true){

                const response = await getEnquiries({

                    status,

                    search:searchText,

                    page:exportPage,

                    pageSize:maxPageSize

                });

                const items = response.items ?? [];

                allItems = allItems.concat(items);

                if(items.length < maxPageSize || allItems.length >= (response.total ?? allItems.length)){

                    break;

                }

                exportPage += 1;

            }

            const rows = allItems.map(item=>[

                item.id,
                item.customer_name ?? "",
                item.nature ?? "",
                item.stage,
                item.status,
                item.owner_role ?? "",
                item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : ""

            ]);

            downloadCSV(

                "RAAS_DOS_Enquiries.csv",

                ["Enquiry ID", "Customer", "Nature", "Stage", "Status", "Owner", "Created"],

                rows

            );

        }

        catch(error){

            console.error(error);

            alert("Unable to export enquiries.");

        }

        finally{

            setExporting(false);

        }

    }

    function handleNewEnquiry(){

        console.log(

            "[Enquiry] New enquiry requested"

        );

        navigate("/customer-request");

    }

    // ====================================
    // RENDER
    // ====================================

    return(

        <div className="enquiry-module-front-page">

            <EnquiryHeader />

            <EnquiryToolbar

                onExport={handleExport}

                exporting={exporting}

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

                onEdit={handleEdit}

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