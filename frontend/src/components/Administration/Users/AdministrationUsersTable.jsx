// =========================================
// IMPORTS
// =========================================

import AdministrationUsersRow from "./AdministrationUsersRow";


// =========================================
// COMPONENT
// =========================================

export default function AdministrationUsersTable({

    users,

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

                Loading users...

            </div>

        );

    }

    if(

        error

    ){

        return(

            <div className="administration-error">

                Failed to load users.

            </div>

        );

    }

    if(

        users.length===0

    ){

        return(

            <div className="administration-empty">

                No users found.

            </div>

        );

    }

    return(

        <table className="administration-table">

            <thead>

                <tr>

                    <th>

                        Name

                    </th>

                    <th>

                        Email

                    </th>

                    <th>

                        Role

                    </th>

                    <th>

                        Hub

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

                    users.map(

                        user=>(

                            <AdministrationUsersRow

                                key={user.id}

                                user={user}

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