import { Pencil, FolderOpen, Archive, ArchiveRestore, Ban, CheckCheck, Trash2 } from "lucide-react";

import { STAGE_LABELS } from "../../data/workflowStages";

// =========================================
// ACTION BUTTON
// Icon button with a custom hover tooltip - the native `title`
// attribute has an inconsistent OS/browser-controlled delay and
// position, so this renders its own instead for a reliable, styled
// hover label.
// =========================================

function ActionButton({ icon: Icon, label, className, onClick }){

    return(

        <span className="enquiry-action-wrap">

            <button
                type="button"
                className={className}
                aria-label={label}
                onClick={onClick}
            >
                <Icon size={15} strokeWidth={2}/>
            </button>

            <span className="enquiry-action-tooltip">
                {label}
            </span>

        </span>

    );

}

// =========================================
// COMPONENT
// =========================================

export default function EnquiryTableRow({

    enquiry,

    onView,

    onEdit,

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
            {/* JOB ON (site location + asset name) */}
            {/* ===================================== */}

            <td>

                {enquiry.job_on || "—"}

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

                {STAGE_LABELS[enquiry.stage] || enquiry.stage}

            </td>


            {/* ===================================== */}
            {/* AGING */}
            {/* ===================================== */}

            <td>

                {enquiry.aging_display || "—"}

            </td>


            {/* ===================================== */}
            {/* VALUE */}
            {/* ===================================== */}

            <td>

                {enquiry.value_display || "—"}

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

                    enquiry.owner

                    ||

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

                <ActionButton
                    icon={Pencil}
                    label="Edit"
                    className="enquiry-edit"
                    onClick={()=>onEdit?.(enquiry)}
                />

                <ActionButton
                    icon={FolderOpen}
                    label="Open"
                    className="enquiry-view"
                    onClick={()=>onView?.(enquiry)}
                />

                <ActionButton
                    icon={Archive}
                    label="Archive"
                    className="enquiry-archive"
                    onClick={()=>onArchive?.(enquiry.id)}
                />

                <ActionButton
                    icon={ArchiveRestore}
                    label="Restore"
                    className="enquiry-restore"
                    onClick={()=>onRestore?.(enquiry.id)}
                />

                <ActionButton
                    icon={Ban}
                    label="Lost"
                    className="enquiry-lost"
                    onClick={()=>onLost?.(enquiry.id)}
                />

                <ActionButton
                    icon={CheckCheck}
                    label="Close"
                    className="enquiry-close"
                    onClick={()=>onClose?.(enquiry.id)}
                />

                <ActionButton
                    icon={Trash2}
                    label="Delete"
                    className="enquiry-delete"
                    onClick={()=>onDelete?.(enquiry.id)}
                />

            </td>

        </tr>

    );

}