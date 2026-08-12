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

import {

    getRoles

} from "../../../services/administrationRolesService";

import AdministrationUserTable from "./AdministrationUsersTable";

import AdministrationUserDialog from "./AdministrationUserDialog";

import AdministrationUserForm
from "./AdministrationUserForm";

import { useAuth } from "../../../contexts/AuthContext";



export default function AdministrationUsers({

    createSignal

}){

    const { user: currentUser } = useAuth();

    console.log(

        "[AdministrationUsers] Component Loaded"

    );

    const [

        users,

        setUsers

    ] = useState([]);

    // Was previously derived from whichever roles existing users
    // already had (plus a hardcoded "partner" fallback) - meant any
    // real role with zero users assigned yet (a brand-new role, e.g.
    // one just added in Administration -> Roles & Permissions) never
    // appeared in this dropdown. Fetched from the real roles table
    // instead so every active role is always selectable here.
    const [

        roles,

        setRoles

    ] = useState([]);

    async function loadRoles(){

        try{

            const response = await getRoles();

            const activeRoleNames = response

                .filter(role => role.is_active)

                .map(role => role.name)

                .sort();

            setRoles(activeRoleNames);

        }

        catch(error){

            console.error("[AdministrationUsers] Failed to load roles", error);

        }

    }

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

            loadRoles();

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

                {

                    ...payload,

                    actor: currentUser ? {

                        user_id: currentUser.id,
                        name: currentUser.name,
                        role: currentUser.role

                    } : null

                }

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