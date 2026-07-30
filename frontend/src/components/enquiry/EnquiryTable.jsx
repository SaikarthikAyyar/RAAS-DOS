// =========================================
// IMPORTS
// =========================================

import EnquiryTableRow from "./EnquiryTableRow";


// =========================================
// COMPONENT
// =========================================

export default function EnquiryTable({

    items,

    loading,

    error,

    onView,

    onArchive,

    onRestore,

    onLost,

    onClose,

    onDelete

}){

    console.log(

        "[EnquiryTable] Rendering"

    );

    if(

        loading

    ){

        return(

            <div className="enquiry-loading">

                Loading enquiries...

            </div>

        );

    }

    if(

        error

    ){

        return(

            <div className="enquiry-error">

                Failed to load enquiries.

            </div>

        );

    }

    if(

        !items ||

        items.length===0

    ){

        return(

            <div className="enquiry-empty">

                No enquiries found.

            </div>

        );

    }

    return(

        <table className="enquiry-table">

            <thead>

                <tr>

                    <th>

                        Enquiry ID

                    </th>

                    <th>

                        Customer

                    </th>

                    <th>

                        Nature

                    </th>

                    <th>

                        Stage

                    </th>

                    <th>

                        Status

                    </th>

                    <th>

                        Owner

                    </th>

                    <th>

                        Created

                    </th>

                    <th>

                        Actions
                    </th>

                </tr>

            </thead>

            <tbody>

                {

                    items.map(

                        enquiry=>(

                            <EnquiryTableRow

                                key={enquiry.id}

                                enquiry={enquiry}

                                onView={onView}

                                onArchive={onArchive}

                                onRestore={onRestore}

                                onLost={onLost}

                                onClose={onClose}

                                onDelete={onDelete}

                            />

                        )

                    )

                }

            </tbody>

        </table>

    );

}