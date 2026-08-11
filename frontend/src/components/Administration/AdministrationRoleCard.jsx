import { Pencil, Trash2 } from "lucide-react";

import "./AdministrationRoles.css";


// =========================================
// ACTION BUTTON
// Icon button with a custom hover tooltip - same pattern as the
// Enquiries list's row actions (native `title` has an inconsistent
// OS/browser-controlled delay and position).
// =========================================

function RoleActionButton({ icon: Icon, label, className, onClick }){

    return(

        <span className="role-action-wrap">

            <button
                type="button"
                className={className}
                aria-label={label}
                onClick={onClick}
            >
                <Icon size={13} strokeWidth={2}/>
            </button>

            <span className="role-action-tooltip">
                {label}
            </span>

        </span>

    );

}


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

                <RoleActionButton
                    icon={Pencil}
                    label="Edit"
                    className="role-edit-button"
                    onClick={()=>onEdit(role)}
                />

                <RoleActionButton
                    icon={Trash2}
                    label="Delete"
                    className="role-delete-button"
                    onClick={()=>onDelete(role)}
                />

            </div>

        </div>

    );

}