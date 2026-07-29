import {

    useEffect,

    useState

} from "react";

export default function AdministrationPartnerForm({

    initialData,

    onSubmit,

    onCancel,

    loading

}){

    console.log(

        "[AdministrationPartnerForm] Rendering"

    );

    const [

        form,

        setForm

    ] = useState({


        partner_firm_name:"",

        primary_contact:"",

        email:"",

        phone:"",

        commission_percentage:5,

        linked_customer_company_record:"",

        is_active:true

    });

    useEffect(

        ()=>{

            console.log(

                "[AdministrationPartnerForm] Loading Initial Data",

                initialData

            );

            if(

                initialData

            ){

                setForm({


                    partner_firm_name:

                        initialData.partner_firm_name || "",

                    primary_contact:

                        initialData.primary_contact || "",

                    email:

                        initialData.email || "",

                    phone:

                        initialData.phone || "",

                    commission_percentage:

                        initialData.commission_percentage ?? 5,

                    linked_customer_company_record:

                        initialData.linked_customer_company_record || "",

                    is_active:

                        initialData.is_active ?? true

                });

            }

            else{

                setForm({

                    user_id:"",

                    partner_firm_name:"",

                    primary_contact:"",

                    email:"",

                    phone:"",

                    commission_percentage:5,

                    linked_customer_company_record:"",

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

            checked,

            type

        } = event.target;

        setForm(

            previous=>({

                ...previous,

                [

                    name

                ]:

                type==="checkbox"

                ?

                checked

                :

                name==="commission_percentage"

                ?

                Number(value)

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

            "[AdministrationPartnerForm] Submit",

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

            <div

                className="administration-form-grid"

            >

                {/* ===================================== */}
                {/* PARTNER FIRM NAME */}
                {/* ===================================== */}

                <div

                    className="administration-form-group"

                >

                    <label>

                        Partner Firm Name

                    </label>

                    <input

                        type="text"

                        name="partner_firm_name"

                        value={form.partner_firm_name}

                        onChange={handleChange}

                        required

                    />

                </div>


                {/* ===================================== */}
                {/* PRIMARY CONTACT */}
                {/* ===================================== */}

                <div

                    className="administration-form-group"

                >

                    <label>

                        Primary Contact

                    </label>

                    <input

                        type="text"

                        name="primary_contact"

                        value={form.primary_contact}

                        onChange={handleChange}

                        required

                    />

                </div>


                {/* ===================================== */}
                {/* EMAIL */}
                {/* ===================================== */}

                <div

                    className="administration-form-group"

                >

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
                {/* PHONE */}
                {/* ===================================== */}

                <div

                    className="administration-form-group"

                >

                    <label>

                        Phone

                    </label>

                    <input

                        type="text"

                        name="phone"

                        value={form.phone}

                        onChange={handleChange}

                        required

                    />

                </div>


                {/* ===================================== */}
                {/* COMMISSION */}
                {/* ===================================== */}

                <div

                    className="administration-form-group"

                >

                    <label>

                        Commission %

                    </label>

                    <input

                        type="number"

                        name="commission_percentage"

                        value={form.commission_percentage}

                        onChange={handleChange}

                        step="0.01"

                        min="0"

                    />

                </div>


                {/* ===================================== */}
                {/* LINKED COMPANY */}
                {/* ===================================== */}

                <div

                    className="administration-form-group"

                >

                    <label>

                        Linked Customer / Company

                    </label>

                    <input

                        type="text"

                        name="linked_customer_company_record"

                        value={form.linked_customer_company_record}

                        onChange={handleChange}

                    />

                </div>

            </div>


            {/* ===================================== */}
            {/* ACTIVE */}
            {/* ===================================== */}

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

                    Active Partner

                </label>

            </div>


            {/* ===================================== */}
            {/* ACTIONS */}
            {/* ===================================== */}

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