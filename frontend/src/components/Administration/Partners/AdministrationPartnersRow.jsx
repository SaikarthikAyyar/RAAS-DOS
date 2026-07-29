// =========================================
// COMPONENT
// =========================================

export default function AdministrationPartnersRow({

    partner,

    onEdit,

    onDelete

}){

    console.log(

        "[AdministrationPartnersRow] Rendering:",

        partner

    );

    return(

        <tr>

            {/* ===================================== */}
            {/* PARTNER FIRM */}
            {/* ===================================== */}

            <td>

                {

                    partner.partner_firm_name

                }

            </td>


            {/* ===================================== */}
            {/* PRIMARY CONTACT */}
            {/* ===================================== */}

            <td>

                {

                    partner.primary_contact

                }

            </td>


            {/* ===================================== */}
            {/* EMAIL */}
            {/* ===================================== */}

            <td>

                {

                    partner.email

                }

            </td>


            {/* ===================================== */}
            {/* PHONE */}
            {/* ===================================== */}

            <td>

                {

                    partner.phone

                }

            </td>


            {/* ===================================== */}
            {/* COMMISSION */}
            {/* ===================================== */}

            <td>

                {

                    Number(

                        partner.commission_percentage

                    ).toFixed(2)

                }%

            </td>


            {/* ===================================== */}
            {/* LINKED COMPANY */}
            {/* ===================================== */}

            <td>

                {

                    partner.linked_customer_company_record

                    ||

                    "—"

                }

            </td>


            {/* ===================================== */}
            {/* STATUS */}
            {/* ===================================== */}

            <td>

                <span

                    className={

                        partner.is_active

                        ?

                        "administration-status active"

                        :

                        "administration-status inactive"

                    }

                >

                    {

                        partner.is_active

                        ?

                        "Active"

                        :

                        "Inactive"

                    }

                </span>

            </td>


            {/* ===================================== */}
            {/* ACTIONS */}
            {/* ===================================== */}

            <td

                className="administration-actions"

            >

                <button

                    type="button"

                    className="administration-edit"

                    onClick={

                        ()=>onEdit(

                            partner

                        )

                    }

                >

                    Edit

                </button>

                <span>

                    &nbsp;•&nbsp;

                </span>

                <button

                    type="button"

                    className="administration-delete"

                    onClick={

                        ()=>onDelete(

                            partner

                        )

                    }

                >

                    Remove

                </button>

            </td>

        </tr>

    );

}