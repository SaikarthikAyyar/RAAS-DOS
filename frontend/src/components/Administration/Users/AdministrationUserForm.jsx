import {

    useEffect,

    useState

} from "react";

export default function AdministrationUserForm({

    initialData,

    roles,

    onSubmit,

    onCancel,

    loading

}){

    console.log(

        "[AdministrationUserForm] Rendering"

    );

    const [

        form,

        setForm

    ] = useState({

        name:"",

        email:"",

        password:"",

        role:"",

        is_active:true

    });

    useEffect(

        ()=>{

            console.log(

                "[AdministrationUserForm] Loading Initial Data",

                initialData

            );

            if(

                initialData

            ){

                setForm({

                    name:initialData.name || "",

                    email:initialData.email || "",

                    password:"",

                    role:initialData.role || "",

                    is_active:initialData.is_active ?? true

                });

            }

            else{

                setForm({

                    name:"",

                    email:"",

                    password:"",

                    role:"",

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

                [

                    name

                ]:

                type==="checkbox"

                ? checked

                : value

            })

        );

    }

    function handleSubmit(

        event

    ){

        event.preventDefault();

        console.log(

            "[AdministrationUserForm] Submit",

            form

        );

        onSubmit(

            form

        );

    }

    return(

        <form

            onSubmit={handleSubmit}

            className="administration-user-form"

        >

        <div className="administration-form-grid">

            {/* ===================================== */}
            {/* NAME */}
            {/* ===================================== */}

            <div className="administration-form-group">

                <label>

                    Name

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
            {/* EMAIL */}
            {/* ===================================== */}

            <div className="administration-form-group">

                <label>

                    Email

                </label>

                <input

                    type="email"

                    name="email"

                    value={form.email}

                    onChange={handleChange}

                    required

                />

            </div>


            {/* ===================================== */}
            {/* ROLE */}
            {/* ===================================== */}

            <div className="administration-form-group">

                <label>

                    Role

                </label>

                <select

                    name="role"

                    value={form.role}

                    onChange={handleChange}

                    required

                >

                    <option value="">

                        Select Role

                    </option>

                    {

                        roles.map(

                            role=>(

                                <option

                                    key={role}

                                    value={role}

                                >

                                    {role}

                                </option>

                            )

                        )

                    }

                </select>

            </div>


            {/* ===================================== */}
            {/* PASSWORD */}
            {/* ===================================== */}

            <div className="administration-form-group">

                <label>

                    Password

                </label>

                <input

                    type="password"

                    name="password"

                    value={form.password}

                    onChange={handleChange}

                    placeholder={

                        initialData

                        ?

                        "Leave blank to keep current password"

                        :

                        ""

                    }

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

                    Active User

                </label>

            </div>

            <div

                className="administration-user-actions"

            >

                <button

                    type="button"

                    onClick={onCancel}

                >

                    Cancel

                </button>

                <button

                    type="submit"

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