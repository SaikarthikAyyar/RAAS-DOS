# ====================================
# IMPORTS
# ====================================

from backend.repositories.approval_repository import (

    create_approval

)


# ====================================
# CREATE APPROVAL
# ====================================

def create_approval_decision(

        db,

        payload

):


    return create_approval(

        db,

        payload

    )