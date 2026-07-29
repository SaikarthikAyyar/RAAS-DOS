import {

    useEffect,

    useState

} from "react";

import {

    getRoles,

    createRole,

    updateRole,

    deleteRole

} from "../../services/administrationRolesService";

import AdministrationRoleCard
from "./AdministrationRoleCard";

import AdministrationRoleDialog
from "./AdministrationRoleDialog";

import AdministrationRoleForm
from "./AdministrationRoleForm";


export default function AdministrationRoles({

    createSignal

}){

    console.log(

        "[AdministrationRoles] Component Loaded"

    );

    const [

        roles,

        setRoles

    ] = useState([]);

    const [

        loading,

        setLoading

    ] = useState(false);

    const [

        dialogOpen,

        setDialogOpen

    ] = useState(false);

    const [

        editingRole,

        setEditingRole

    ] = useState(null);


    async function loadRoles(){

        console.log(

            "[AdministrationRoles] Loading Roles..."

        );

        setLoading(

            true

        );

        try{

            const response = await getRoles();

            console.log(

                "[AdministrationRoles] Roles Loaded",

                response

            );

            setRoles(

                response

            );

        }

        catch(

            error

        ){

            console.error(

                "[AdministrationRoles] Failed",

                error

            );

        }

        finally{

            setLoading(

                false

            );

        }

    }


    useEffect(

        ()=>{

            loadRoles();

        },

        []

    );


    useEffect(

        ()=>{

            if(

                createSignal

            ){

                setEditingRole(

                    null

                );

                setDialogOpen(

                    true

                );

            }

        },

        [

            createSignal

        ]

    );


    function handleEdit(

        role

    ){

        console.log(

            "[AdministrationRoles] Edit",

            role

        );

        setEditingRole(

            role

        );

        setDialogOpen(

            true

        );

    }


    async function handleDelete(

        role

    ){

        console.log(

            "[AdministrationRoles] Delete",

            role.id

        );

        if(

            !window.confirm(

                `Delete ${role.name}?`

            )

        ){

            return;

        }

        await deleteRole(

            role.id

        );

        await loadRoles();

    }


    async function handleSave(

        payload

    ){

        console.log(

            "[AdministrationRoles] Saving",

            payload

        );

        if(

            editingRole

        ){

            await updateRole(

                editingRole.id,

                payload

            );

        }

        else{

            await createRole(

                payload

            );

        }

        setDialogOpen(

            false

        );

        setEditingRole(

            null

        );

        await loadRoles();

    }


    function handleClose(){

        console.log(

            "[AdministrationRoles] Closing Dialog"

        );

        setDialogOpen(

            false

        );

        setEditingRole(

            null

        );

    }


    return(

        <>

            <div className="administration-roles-sidebar">

            <button

            className="administration-add-button"

            onClick={()=>{

                setEditingRole(

                    null

                );

                setDialogOpen(

                    true

                );

            }}

        >

            + New Role

        </button>

                {

                    roles.map(

                        role => (

                            <AdministrationRoleCard

                                key={role.id}

                                role={role}

                                onEdit={handleEdit}

                                onDelete={handleDelete}

                            />

                        )

                    )

                }

            </div>

            <AdministrationRoleDialog

                open={dialogOpen}

                title={

                    editingRole

                    ?

                    "Edit Role"

                    :

                    "Add Role"

                }

                onClose={handleClose}

            >

                <AdministrationRoleForm

                    initialData={editingRole}

                    loading={loading}

                    onCancel={handleClose}

                    onSubmit={handleSave}

                />

            </AdministrationRoleDialog>

        </>

    );

}