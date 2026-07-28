import {

    useEffect,

    useState

} from "react";

import {

    getUsers,

    createUser,

    updateUser,

    deleteUser

} from "../../../services/administrationUsersService";

import AdministrationUserTable from "./AdministrationUsersTable";

import AdministrationUserDialog from "./AdministrationUserDialog";

import AdministrationUserForm
from "./AdministrationUserForm";



export default function AdministrationUsers({

    createSignal

}){

    console.log(

        "[AdministrationUsers] Component Loaded"

    );

    const [

        users,

        setUsers

    ] = useState([]);

    const roles = [

        ...new Set(

            users

                .map(

                    user => user.role

                )

                .filter(Boolean)

        )

    ].sort();

    const [

        loading,

        setLoading

    ] = useState(false);

    const [

        dialogOpen,

        setDialogOpen

    ] = useState(false);

    const [

        selectedUser,

        setSelectedUser

    ] = useState(null);

    async function loadUsers(){

        console.log(

            "[AdministrationUsers] Loading Users..."

        );

        setLoading(

            true

        );

        try{

            const response = await getUsers();

            console.log(

                "[AdministrationUsers] Users Loaded",

                response

            );

            setUsers(

                response

            );

        }

        catch(

            error

        ){

            console.error(

                "[AdministrationUsers] Failed",

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

            loadUsers();

        },

        []

    );

    useEffect(

        ()=>{

            if(

                createSignal

            ){

                setSelectedUser(

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

        user

    ){

        console.log(

            "[AdministrationUsers] Edit",

            user

        );

        setSelectedUser(

            user

        );

        setDialogOpen(

            true

        );

    }

    async function handleDelete(

        user

    ){

        console.log(

            "[AdministrationUsers] Delete",

            user.id

        );

        if(

            !window.confirm(

                `Delete ${user.name}?`

            )

        ){

            return;

        }

        await deleteUser(

            user.id

        );

        await loadUsers();

    }

    async function handleSave(

        payload

    ){

        console.log(

            "[AdministrationUsers] Saving",

            payload

        );

        if(

            selectedUser

        ){

            await updateUser(

                selectedUser.id,

                payload

            );

        }

        else{

            await createUser(

                payload

            );

        }

        setDialogOpen(

            false

        );

        setSelectedUser(

            null

        );

        await loadUsers();

    }

    function handleClose(){

        console.log(

            "[AdministrationUsers] Closing Dialog"

        );

        setDialogOpen(

            false

        );

        setSelectedUser(

            null

        );

    }

    return(

        <>

            <AdministrationUserTable

                users={users}

                loading={loading}

                error={null}

                onEdit={handleEdit}

                onDelete={handleDelete}

            />

            <AdministrationUserDialog

                open={dialogOpen}

                title={

                    selectedUser

                    ?

                    "Edit User"

                    :

                    "Add User"

                }

                onClose={handleClose}

            >

                <AdministrationUserForm

                    initialData={selectedUser}

                    roles={roles}

                    loading={loading}

                    onCancel={handleClose}

                    onSubmit={handleSave}

                />

            </AdministrationUserDialog>

        </>

    );

}