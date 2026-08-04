export default function EnquiryToolbar({

    onExport,

    exporting,

    onNewEnquiry

}){

    return(

        <div className="enquiry-toolbar">

            <div className="enquiry-toolbar-spacer"></div>

            <div className="enquiry-toolbar-actions">

                <button
                    className="enquiry-export-button"
                    onClick={onExport}
                    disabled={exporting}
                >
                    {exporting ? "Exporting..." : "↓ Export to Excel"}
                </button>

                <button
                    className="enquiry-new-button"
                    onClick={onNewEnquiry}
                >
                    + New enquiry
                </button>

            </div>

        </div>

    );

}