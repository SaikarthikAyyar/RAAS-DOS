// =========================================
// COMPONENT
// =========================================

export default function AdministrationPartnerDialog({

    open,

    title,

    children,

    onClose

}){

    console.log(

        "[AdministrationPartnerDialog] Rendering"

    );

    if(

        !open

    ){

        return null;

    }

    return(

        <div

            className="administration-user-dialog-overlay"

            onClick={onClose}

        >

            <div

                className="administration-user-dialog"

                onClick={(event)=>

                    event.stopPropagation()

                }

            >

                {/* ===================================== */}
                {/* HEADER */}
                {/* ===================================== */}

                <div

                    className="administration-user-dialog-header"

                >

                    <h2>

                        {

                            title ||

                            "Add Partner"

                        }

                    </h2>

                </div>


                {/* ===================================== */}
                {/* BODY */}
                {/* ===================================== */}

                <div

                    className="administration-user-dialog-body"

                >

                    {

                        children

                    }

                </div>

            </div>

        </div>

    );

}