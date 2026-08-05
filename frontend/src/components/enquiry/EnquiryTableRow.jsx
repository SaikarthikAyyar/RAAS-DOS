// =========================================
// COMPONENT
// =========================================

export default function EnquiryTableRow({

    enquiry,

    onView,

    onArchive,

    onRestore,

    onLost,

    onClose,

    onDelete

}){

    console.log(

        "[EnquiryTableRow] Rendering:",

        enquiry

    );

    return(

        <tr>

            {/* ===================================== */}
            {/* ENQUIRY ID */}
            {/* ===================================== */}

            <td>

                {enquiry.id}

            </td>


            {/* ===================================== */}
            {/* CUSTOMER */}
            {/* ===================================== */}

            <td>

                {

                    enquiry.customer_name

                        ? (
                            enquiry.customer_request_id
                                ? `CR${enquiry.customer_request_id} - ${enquiry.customer_name}`
                                : enquiry.customer_name
                        )

                        : "—"

                }

            </td>


            {/* ===================================== */}
            {/* NATURE */}
            {/* ===================================== */}

            <td>

                {

                    enquiry.nature

                    ||

                    "—"

                }

            </td>


            {/* ===================================== */}
            {/* STAGE */}
            {/* ===================================== */}

            <td>

                {enquiry.stage}

            </td>


            {/* ===================================== */}
            {/* STATUS */}
            {/* ===================================== */}

            <td>

                <span

                    className={

                        `enquiry-status enquiry-status-${enquiry.status.toLowerCase()}`

                    }

                >

                    {enquiry.status}

                </span>

            </td>


            {/* ===================================== */}
            {/* OWNER */}
            {/* ===================================== */}

            <td>

                {

                    enquiry.owner_role

                    ||

                    "—"

                }

            </td>


            {/* ===================================== */}
            {/* CREATED */}
            {/* ===================================== */}

            <td>

                {

                    enquiry.created_at

                        ? new Date(

                            enquiry.created_at

                        ).toLocaleDateString()

                        : "—"

                }

            </td>


            {/* ===================================== */}
            {/* ACTIONS */}
            {/* ===================================== */}

            <td className="enquiry-actions">

                <button

                    type="button"

                    className="enquiry-view"

                    onClick={

                        ()=>onView?.(

                            enquiry

                        )

                    }

                >

                    Open

                </button>

                <span>

                    &nbsp;•&nbsp;

                </span>

                <button

                    type="button"

                    className="enquiry-archive"

                    onClick={

                        ()=>onArchive?.(

                            enquiry.id

                        )

                    }

                >

                    Archive

                </button>

                <span>

                    &nbsp;•&nbsp;

                </span>

                <button

                    type="button"

                    className="enquiry-restore"

                    onClick={

                        ()=>onRestore?.(

                            enquiry.id

                        )

                    }

                >

                    Restore

                </button>

                <span>

                    &nbsp;•&nbsp;

                </span>

                <button

                    type="button"

                    className="enquiry-lost"

                    onClick={

                        ()=>onLost?.(

                            enquiry.id

                        )

                    }

                >

                    Lost

                </button>

                <span>

                    &nbsp;•&nbsp;

                </span>

                <button

                    type="button"

                    className="enquiry-close"

                    onClick={

                        ()=>onClose?.(

                            enquiry.id

                        )

                    }

                >

                    Close

                </button>

                <span>

                    &nbsp;•&nbsp;

                </span>

                <button

                    type="button"

                    className="enquiry-delete"

                    onClick={

                        ()=>onDelete?.(

                            enquiry.id

                        )

                    }

                >

                    Delete

                </button>

            </td>

        </tr>

    );

}