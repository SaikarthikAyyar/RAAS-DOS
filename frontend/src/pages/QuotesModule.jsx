import {

    useEffect,

    useState,

    useCallback

} from "react";

import "../components/quotesModule/QuotesModule.css";

import { formatApiError } from "../utils/apiError";

import QuotesHeader from "../components/quotesModule/QuotesHeader";
import QuotesToolbar from "../components/quotesModule/QuotesToolbar";
import QuotesStatusTabs from "../components/quotesModule/QuotesStatusTabs";
import QuotesSearchBar from "../components/quotesModule/QuotesSearchBar";
import QuotesTable from "../components/quotesModule/QuotesTable";
import QuotesPagination from "../components/quotesModule/QuotesPagination";

import { getQuotesList } from "../services/quotesModuleService";


// ====================================
// CSV EXPORT
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

export default function QuotesModule(){

    const [items, setItems] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [status, setStatus] = useState("Active");

    const [searchText, setSearchText] = useState("");

    const [page, setPage] = useState(1);

    const [total, setTotal] = useState(0);

    const [exporting, setExporting] = useState(false);

    const pageSize = 10;

    const loadQuotes = useCallback(async()=>{

        setLoading(true);

        setError("");

        try{

            const response = await getQuotesList({

                status,

                search:searchText,

                page,

                pageSize

            });

            setItems(response.items ?? []);

            setTotal(response.total ?? 0);

        }

        catch(err){

            console.error(err);

            setError(formatApiError(err, "Unable to load quotes."));

        }

        finally{

            setLoading(false);

        }

    }, [status, searchText, page]);

    useEffect(()=>{

        loadQuotes();

    }, [loadQuotes]);

    function handleTabChange(value){

        setStatus(value);

        setPage(1);

    }

    function handleSearchChange(value){

        setSearchText(value);

        setPage(1);

    }

    async function handleExport(){

        setExporting(true);

        try{

            const response = await getQuotesList({

                status,

                search:searchText,

                page:1,

                pageSize:9999

            });

            const rows = (response.items ?? []).map(item=>[

                `QT-${item.enquiry_id ?? item.ops_selection_id}-v${item.revision_number}`,
                item.customer_name ?? "",
                item.combined_budgetary_value_min ?? "",
                item.combined_budgetary_value_max ?? "",
                item.status_label

            ]);

            downloadCSV(

                "RAAS_DOS_Quotes.csv",

                ["Quote ID", "Customer", "Range Min", "Range Max", "Status"],

                rows

            );

        }

        catch(err){

            console.error(err);

            alert("Unable to export quotes.");

        }

        finally{

            setExporting(false);

        }

    }

    return (

        <div className="quotes-page">

            <QuotesHeader total={total} />

            <QuotesToolbar

                onExport={handleExport}

                exporting={exporting}

            />

            <QuotesStatusTabs

                activeTab={status}

                onTabChange={handleTabChange}

            />

            <QuotesSearchBar

                searchText={searchText}

                onSearchChange={handleSearchChange}

            />

            <QuotesTable

                items={items}

                loading={loading}

                error={error}

            />

            <QuotesPagination

                page={page}

                pageSize={pageSize}

                total={total}

                onPageChange={setPage}

            />

        </div>

    );

}
