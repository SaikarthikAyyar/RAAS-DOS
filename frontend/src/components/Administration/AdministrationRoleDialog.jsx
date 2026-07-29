// =========================================
// COMPONENT
// =========================================

export default function AdministrationRoleDialog({

    open,

    title,

    children,

    onClose

}){

    if(

        !open

    ){

        return null;

    }

    return(

        <div

            className="administration-dialog-overlay"

            onClick={onClose}

        >

            <div

                className="administration-dialog"

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

                            "Add Role"

                        }

                    </h2>

                </div>


                {/* ===================================== */}
                {/* BODY */}
                {/* ===================================== */}

                <div

                    className="administration-user-dialog-body"

                >

                    {children}

                </div>

            </div>

        </div>

    );

}