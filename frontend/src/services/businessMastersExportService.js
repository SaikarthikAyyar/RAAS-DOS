import { withDateStamp } from "../utils/exportFilename";


// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// SHARED BLOB DOWNLOAD
// Both exports below are now real, styled .xlsx files streamed
// server-side (matching the Customer 360 export's own design) rather
// than raw JSON the frontend used to build a plain workbook from -
// this is the one place that actually triggers the browser download.
// The server's Content-Disposition filename isn't readable here (no
// CORS expose_headers entry for it), so the filename is computed
// client-side instead, same convention already used for Customer 360.
// ====================================

async function downloadExportBlob(url, filename){

    const response = await fetch(url);

    if(!response.ok){
        throw await response.json().catch(()=>({detail:"Unable to export this tab."}));
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = withDateStamp(filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(objectUrl);

}


// ====================================
// EXPORT CURRENT TAB (generic - every DB column for whichever
// tab's backing table(s), regardless of whether the frontend
// currently displays all of them)
// ====================================

export async function exportTab(

    tabKey,

    tabLabel

){

    const safeLabel = (tabLabel || tabKey).replace(/\s+/g, "_");

    await downloadExportBlob(

        `${API}/business-master/export/${tabKey}`,

        `${safeLabel}.xlsx`

    );

}


// ====================================
// CUSTOMERS TAB'S OWN "EXPORT CURRENT TAB" (the 3-sheet Customer
// Summary / Assets / Company & POC report, distinct from the
// per-customer "Export Current Customer" 360 export)
// ====================================

export async function exportCustomersReport(){

    await downloadExportBlob(

        `${API}/business-master/customers-report`,

        "Customers_Report.xlsx"

    );

}
