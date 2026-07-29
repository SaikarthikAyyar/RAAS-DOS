import {

    useEffect,

    useState

} from "react";

import {

    getPartners,

    createPartner,

    updatePartner,

    deletePartner

} from "../../../services/administrationPartnersService";

import AdministrationPartnersTable
from "./AdministrationPartnersTable";

import AdministrationPartnerDialog
from "./AdministrationPartnerDialog";

import AdministrationPartnerForm
from "./AdministrationPartnerForm";


export default function AdministrationPartners({

    createSignal

}){

    console.log(

        "[AdministrationPartners] Component Loaded"

    );

    const [

        partners,

        setPartners

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

        selectedPartner,

        setSelectedPartner

    ] = useState(null);


    async function loadPartners(){

        console.log(

            "[AdministrationPartners] Loading Partners..."

        );

        setLoading(

            true

        );

        try{

            const response = await getPartners();

            console.log(

                "[AdministrationPartners] Loaded",

                response

            );

            setPartners(

                response

            );

        }

        catch(

            error

        ){

            console.error(

                "[AdministrationPartners] Failed",

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

            loadPartners();

        },

        []

    );


    useEffect(

        ()=>{

            if(

                createSignal

            ){

                setSelectedPartner(

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

        partner

    ){

        console.log(

            "[AdministrationPartners] Edit",

            partner

        );

        setSelectedPartner(

            partner

        );

        setDialogOpen(

            true

        );

    }


    async function handleDelete(

        partner

    ){

        if(

            !window.confirm(

                `Delete ${partner.partner_firm_name}?`

            )

        ){

            return;

        }

        try{

            await deletePartner(

                partner.id

            );

            await loadPartners();

        }

        catch(

            error

        ){

            console.error(

                error

            );

            alert(

                "Unable to delete partner."

            );

        }

    }


    async function handleSave(

        payload

    ){

        try{

            if(

                selectedPartner

            ){

                await updatePartner(

                    selectedPartner.id,

                    payload

                );

            }

            else{

                await createPartner(

                    payload

                );

            }

            setDialogOpen(false);

            setSelectedPartner(null);

            await loadPartners();

        }

        catch(

            error

        ){

            console.error(error);

            alert(

                error.detail ||

                "Unable to save partner."

            );

        }

    }


    function handleClose(){

        console.log(

            "[AdministrationPartners] Closing Dialog"

        );

        setDialogOpen(

            false

        );

        setSelectedPartner(

            null

        );

    }


    return(

        <>

            <AdministrationPartnersTable

                partners={partners}

                loading={loading}

                error={null}

                onEdit={handleEdit}

                onDelete={handleDelete}

            />

            <AdministrationPartnerDialog

                open={dialogOpen}

                title={

                    selectedPartner

                    ?

                    "Edit Partner"

                    :

                    "Add Partner"

                }

                onClose={handleClose}

            >

                <AdministrationPartnerForm

                    initialData={selectedPartner}

                    loading={loading}

                    onCancel={handleClose}

                    onSubmit={handleSave}

                />

            </AdministrationPartnerDialog>

        </>

    );

}