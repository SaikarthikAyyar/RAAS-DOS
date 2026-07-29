import "./AdministrationRoles.css";


export default function AdministrationRoleCard({

    role,

    onEdit,

    onDelete

}){

    console.log(

        "[AdministrationRoleCard]",

        role

    );

    function getRoleTypeLabel(

        roleType

    ){

        switch(

            roleType

        ){

            case "janyu":

                return "Janyu Role";

            case "partner":

                return "Partner Role";

            case "customer":

                return "Customer Role";

            default:

                return roleType;

        }

    }

    return(

        <div

            className="role-card"

        >

            <div

                className="role-card-content"

            >

                <div

                    className="role-name"

                >

                    {role.name}

                </div>

                <div

                    className="role-type"

                >

                    {getRoleTypeLabel(

                        role.role_type

                    )}

                </div>

                <div

                    className={

                        role.is_active

                        ?

                        "role-status active"

                        :

                        "role-status inactive"

                    }

                >

                    {

                        role.is_active

                        ?

                        "Active"

                        :

                        "Inactive"

                    }

                </div>

            </div>

            <div

                className="role-actions"

            >

                <button

                    className="role-edit-button"

                    onClick={

                        ()=>onEdit(

                            role

                        )

                    }

                >

                    Edit

                </button>

                <button

                    className="role-delete-button"

                    onClick={

                        ()=>onDelete(

                            role

                        )

                    }

                >

                    Delete

                </button>

            </div>

        </div>

    );

}