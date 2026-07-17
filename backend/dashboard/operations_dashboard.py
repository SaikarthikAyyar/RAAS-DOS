from backend.dashboard.enquiry_loader import (
    get_received_enquiries,
    get_sent_enquiries
)

from backend.dashboard.stats_loader import (
    build_role_statistics
)

from backend.dashboard.summary_loader import (
    build_dashboard_summary
)


def get_customer_dashboard(
    db,
    selected_enquiry_id=None
):

    received = get_received_enquiries(
        db,
        "OPERATIONS"
    )

    sent = get_sent_enquiries(
        db,
        "OPERATIONS"
    )

    if selected_enquiry_id is None:

        if received:
            selected = received[0]
        elif sent:
            selected = sent[0]
        else:
            selected = None

    else:

        selected = None

        for enquiry in received + sent:

            if enquiry.id == selected_enquiry_id:

                selected = enquiry

                break

    return {

        "stats": build_role_statistics(
            received,
            sent
        ),

        "received": received,

        "sent": sent,

        "summary":

        build_dashboard_summary(
            db,
            selected
        )

        if selected

        else None

    }