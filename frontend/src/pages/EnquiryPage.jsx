// ====================================
// IMPORTS
// ====================================

import EnquiryModuleFrontPage from "../components/enquiry/EnquiryModuleFrontPage";




// ====================================
// PAGE
// ====================================

export default function EnquiryPage(){

    console.log(

        "[EnquiryPage] Page Loaded"

    );

    return(

        <main className="enquiry-page">

            <EnquiryModuleFrontPage />

        </main>

    );

}