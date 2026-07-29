// =========================================
// IMPORTS
// =========================================

import AdministrationPartnersRow
from "./AdministrationPartnersRow";


// =========================================
// COMPONENT
// =========================================

export default function AdministrationPartnersTable({

    partners,

    loading,

    error,

    onEdit,

    onDelete

}){

    if(

        loading

    ){

        return(

            <div className="administration-loading">

                Loading partners...

            </div>

        );

    }

    if(

        error

    ){

        return(

            <div className="administration-error">

                Failed to load partners.

            </div>

        );

    }

    return(

        <table

            className="administration-table"

        >

            <thead>

                <tr>

                    <th>

                        Partner Firm Name

                    </th>

                    <th>

                        Primary Contact

                    </th>

                    <th>

                        Email

                    </th>

                    <th>

                        Phone

                    </th>

                    <th>

                        Commission

                    </th>

                    <th>

                        Linked Company

                    </th>

                    <th>

                        Status

                    </th>

                    <th>

                    </th>

                </tr>

            </thead>

            <tbody>

                {

                    partners.length===0

                    ?

                    <tr>

                        <td

                            colSpan={8}

                            className="administration-empty"

                        >

                            No partners found.

                        </td>

                    </tr>

                    :

                    partners.map(

                        partner=>(

                            <AdministrationPartnersRow

                                key={partner.id}

                                partner={partner}

                                onEdit={onEdit}

                                onDelete={onDelete}

                            />

                        )

                    )

                }

            </tbody>

        </table>

    );

}