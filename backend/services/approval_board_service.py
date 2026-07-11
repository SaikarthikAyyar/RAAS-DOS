# ====================================
# IMPORTS
# ====================================

from backend.repositories.approval_board_repository import (
    list_approval_quotes
)

from backend.repositories.approval_board_repository import (
    approve_quote
)

# ====================================
# GET APPROVAL BOARD
# ====================================

def get_approval_board_request(

    db

):

    print(

        "\n========== APPROVAL SERVICE =========="

    )

    approvals = list_approval_quotes(

        db

    )

    print(

        "Approval Records:",

        len(

            approvals

        )

    )

    for approval in approvals:

        print(

            approval

        )

    print(

        "======================================\n"

    )

    return approvals



# ====================================
# APPROVE QUOTE
# ====================================

def approve_quote_request(

    db,

    quote_id

):

    print(

        "\n========== APPROVAL SERVICE =========="

    )

    print(

        "Approve Request:",

        quote_id

    )

    approval = approve_quote(

        db,

        quote_id

    )

    print(

        "Approval Completed"

    )

    print(

        "======================================\n"

    )

    return approval