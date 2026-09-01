# ====================================
# RESOLVE ENQUIRY BY JOB CREATION ID
# The one safe way to find "the enquiry" for a given job_creation_id.
# A legacy code path (EnquiryService.create_allocation_enquiry, called
# from create_job_request until this fix) created a SECOND, separate
# Enquiry row carrying the exact same job_creation_id as the real,
# consolidated enquiry - approval_board_id and customer_name always
# NULL on that stub row (it's a leftover from an older peer-to-peer
# task-routing model, not a real case). Filtering on job_creation_id
# alone is genuinely ambiguous for any job created before that call
# site was removed, since two rows now share the same value with no
# natural tiebreak - whichever one Postgres happens to return first
# from an unordered query decides whether a stage-advance or a
# customer-name lookup lands on the real enquiry or the empty stub.
#
# This prefers the row with a real approval_board_id (the genuine,
# consolidated enquiry) over one with none (a stub), with the lowest
# id as a tiebreak (the real enquiry is always created before any
# stub that might share its job_creation_id) - so it resolves
# correctly both for jobs created after this fix (only one row ever
# exists) and for the already-affected historical jobs (the real row
# still wins, self-healing without needing a data migration first).
# ====================================

from backend.models.enquiry import Enquiry


def resolve_enquiry_by_job_creation_id(db, job_creation_id):

    return (
        db.query(Enquiry)
        .filter(Enquiry.job_creation_id == job_creation_id)
        .order_by(Enquiry.approval_board_id.isnot(None).desc(), Enquiry.id.asc())
        .first()
    )
