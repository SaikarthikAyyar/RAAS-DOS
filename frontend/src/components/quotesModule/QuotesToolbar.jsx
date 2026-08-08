export default function QuotesToolbar({

    onExport,

    exporting

}){

    return (

        <div className="quotes-toolbar">

            <div className="quotes-toolbar-spacer"></div>

            <div className="quotes-toolbar-actions">

                <button

                    className="quotes-export-button"

                    onClick={onExport}

                    disabled={exporting}

                >

                    {exporting ? "Exporting..." : "↓ Export to Excel"}

                </button>

            </div>

        </div>

    );

}
