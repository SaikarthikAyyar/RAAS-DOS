// =========================================
// COMPONENT
// =========================================

export default function AdministrationUsersRow({

    user,

    onEdit,

    onDelete

}){

    console.log(

        "[AdministrationUsersRow] Rendering:",

        user

    );

    return(

        <tr>

            {/* ===================================== */}
            {/* NAME */}
            {/* ===================================== */}

            <td>

                {user.name}

            </td>


            {/* ===================================== */}
            {/* EMAIL */}
            {/* ===================================== */}

            <td>

                {user.email}

            </td>


            {/* ===================================== */}
            {/* ROLE */}
            {/* ===================================== */}

            <td>

                {user.role}

            </td>


            {/* ===================================== */}
            {/* HUB */}
            {/* ===================================== */}

            <td>

                {

                    user.hub

                    ||

                    "—"

                }

            </td>


            {/* ===================================== */}
            {/* STATUS */}
            {/* ===================================== */}

            <td>

                <span

                    className={

                        user.is_active

                        ?

                        "administration-status active"

                        :

                        "administration-status inactive"

                    }

                >

                    {

                        user.is_active

                        ?

                        "Active"

                        :

                        "Inactive"

                    }

                </span>

            </td>


            {/* ===================================== */}
            {/* ACTIONS */}
            {/* ===================================== */}

            <td className="administration-actions">

                <button

                    type="button"

                    className="administration-edit"

                    onClick={

                        ()=>onEdit(

                            user

                        )

                    }

                >

                    Edit

                </button>

                <span>

                    &nbsp;•&nbsp;

                </span>

                <button

                    type="button"

                    className="administration-delete"

                    onClick={

                        ()=>onDelete(

                            user

                        )

                    }

                >

                    Remove

                </button>

            </td>

        </tr>

    );

}