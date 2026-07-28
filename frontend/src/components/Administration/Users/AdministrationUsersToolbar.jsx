export default function AdministrationUsersToolbar({

    onRefresh,

    onCreate

}){

    console.log(

        "[AdministrationUsersToolbar] Rendering"

    );

    return(

        <div
            className="administration-users-toolbar"
        >

            <div
                className="administration-users-toolbar-left"
            >

                <button

                    type="button"

                    onClick={onRefresh}

                >

                    Refresh

                </button>

            </div>

            <div
                className="administration-users-toolbar-right"
            >

                <button

                    type="button"

                    onClick={onCreate}

                >

                    Add User

                </button>

            </div>

        </div>

    );

}