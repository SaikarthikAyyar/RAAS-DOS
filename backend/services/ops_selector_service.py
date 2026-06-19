# ====================================
# IMPORTS
# ====================================

from backend.repositories.ops_selector_repository import (

    create_ops_selection

)


# ====================================
# CREATE OPS SELECTION
# ====================================

def create_ops_selection_request(

        db,

        payload

):

    return create_ops_selection(

        db,

        payload

    )