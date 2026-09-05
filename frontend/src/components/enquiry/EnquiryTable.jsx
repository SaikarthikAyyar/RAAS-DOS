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

    onEdit,

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

            {/* Explicit column widths - Enquiry ID/Nature/Stage are
                trimmed down (short content: a number, a couple of
                words, a stage label) to make room for Job On without
                the table needing to scroll horizontally. */}
            <colgroup>

                <col style={{width:"5%"}}/>
                <col style={{width:"13%"}}/>
                <col style={{width:"15%"}}/>
                <col style={{width:"7%"}}/>
                <col style={{width:"8%"}}/>
                <col style={{width:"5%"}}/>
                <col style={{width:"8%"}}/>
                <col style={{width:"6%"}}/>
                <col style={{width:"8%"}}/>
                <col style={{width:"5%"}}/>
                <col style={{width:"20%"}}/>

            </colgroup>

            <thead>

                <tr>

                    <th>

                        Enquiry ID

                    </th>

                    <th>

                        Customer

                    </th>

                    <th>

                        Job On

                    </th>

                    <th>

                        Nature

                    </th>

                    <th>

                        Stage

                    </th>

                    <th>

                        Aging

                    </th>

                    <th>

                        Value

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

                                onEdit={onEdit}

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