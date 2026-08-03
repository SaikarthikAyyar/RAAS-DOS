export default function QuotesToolbar({

    onExport,

    exporting

}){

    return (

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

            </div>

        </div>

    );

}
