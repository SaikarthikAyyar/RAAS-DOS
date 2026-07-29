import {

    useEffect,

    useState

} from "react";

export default function AdministrationRoleForm({

    initialData,

    onSubmit,

    onCancel,

    loading

}){

    console.log(

        "[AdministrationRoleForm] Rendering"

    );

    const [

        form,

        setForm

    ] = useState({

        name:"",

        role_type:"janyu",

        description:"",

        is_active:true

    });

    useEffect(

        ()=>{

            console.log(

                "[AdministrationRoleForm] Loading Initial Data",

                initialData

            );

            if(

                initialData

            ){

                setForm({

                    name:initialData.name || "",

                    role_type:initialData.role_type || "janyu",

                    description:initialData.description || "",

                    is_active:initialData.is_active ?? true

                });

            }

            else{

                setForm({

                    name:"",

                    role_type:"janyu",

                    description:"",

                    is_active:true

                });

            }

        },

        [

            initialData

        ]

    );

    function handleChange(

        event

    ){

        const{

            name,

            value,

            type,

            checked

        } = event.target;

        setForm(

            previous=>({

                ...previous,

                [name]:

                type==="checkbox"

                ?

                checked

                :

                value

            })

        );

    }

    function handleSubmit(

        event

    ){

        event.preventDefault();

        console.log(

            "[AdministrationRoleForm] Submit",

            form

        );

        onSubmit(

            form

        );

    }

    return(

        <form

            onSubmit={handleSubmit}

            className="administration-form"

        >

            <div className="administration-form-grid">

                {/* ===================================== */}
                {/* ROLE NAME */}
                {/* ===================================== */}

                <div className="administration-form-group">

                    <label>

                        Role Name

                    </label>

                    <input

                        type="text"

                        name="name"

                        value={form.name}

                        onChange={handleChange}

                        required

                    />

                </div>

                {/* ===================================== */}
                {/* ROLE TYPE */}
                {/* ===================================== */}

                <div className="administration-form-group">

                    <label>

                        Role Type

                    </label>

                    <select

                        name="role_type"

                        value={form.role_type}

                        onChange={handleChange}

                        required

                    >

                        <option value="janyu">

                            Janyu

                        </option>

                        <option value="partner">

                            Partner

                        </option>

                        <option value="customer">

                            Customer

                        </option>

                    </select>

                </div>

                {/* ===================================== */}
                {/* DESCRIPTION */}
                {/* ===================================== */}

                <div className="administration-form-group administration-form-group-full">

                    <label>

                        Description

                    </label>

                    <textarea

                        name="description"

                        value={form.description}

                        onChange={handleChange}

                        rows="4"

                    />

                </div>

            </div>

            <div

                className="administration-user-checkbox"

            >

                <label>

                    <input

                        type="checkbox"

                        name="is_active"

                        checked={form.is_active}

                        onChange={handleChange}

                    />

                    Active Role

                </label>

            </div>

            <div

                className="administration-user-actions"

            >

                <button

                    type="button"

                    className="administration-button secondary"

                    onClick={onCancel}

                >

                    Cancel

                </button>

                <button

                    type="submit"

                    className="administration-button primary"

                    disabled={loading}

                >

                    {

                        loading

                        ?

                        "Saving..."

                        :

                        "Save"

                    }

                </button>

            </div>

        </form>

    );

}