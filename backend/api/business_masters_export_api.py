# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.models.business_masters_pricing import (
    ServiceConfiguration,
    DewateringMethod,
    Accessory,
    CommercialRules,
    CustomerCategory
)

from backend.models.hub import Hub
from backend.models.hub_approver import HubApprover
from backend.models.quote_template import QuoteTemplate, QuoteTemplateVariable
from backend.models.email_template import EmailTemplate, EmailTemplateVariable
from backend.models.lookup_list_model import LookupList, LookupListValue
from backend.models.machines_pumps import Machine, Pump
from backend.models.users import User


api = APIRouter(tags=["Business Masters Export"])


# ====================================
# GENERIC "EVERY DB COLUMN" ROW DUMP
# Introspects the model's real table columns rather than a
# hand-maintained field list, so a column added to a model later
# shows up in the export automatically with no code change here -
# this is what makes it genuinely "even if not shown on the
# frontend, it's in the export," not just a copy of the API response.
# ====================================

def _row_to_dict(row):
    return {
        column.name: getattr(row, column.name)
        for column in row.__table__.columns
    }


# ====================================
# TAB -> BACKING TABLE(S)
# One sheet per real table. Tabs backed by a parent + child table
# (Commercial Rules, Quote/Email Templates, Lookup Lists) get one
# sheet each, matching how those tabs are already modelled.
# Hubs is handled separately below since its second sheet
# (hub_approvers) needs each row's user_id resolved to a name to be
# readable, not just its raw column dump.
# ====================================

TAB_EXPORT_TABLES = {

    "accessories": [(Accessory, "Accessories")],

    "serviceconfig": [(ServiceConfiguration, "Service Configurations")],

    "dewatering": [(DewateringMethod, "Dewatering Methods")],

    "rules": [
        (CommercialRules, "Commercial Rules"),
        (CustomerCategory, "Customer Categories")
    ],

    "quotetemplates": [
        (QuoteTemplate, "Quote Templates"),
        (QuoteTemplateVariable, "Quote Template Variables")
    ],

    "emailtemplates": [
        (EmailTemplate, "Email Templates"),
        (EmailTemplateVariable, "Email Template Variables")
    ],

    "lists": [
        (LookupList, "Lookup Lists"),
        (LookupListValue, "Lookup List Values")
    ],

    "machines": [(Machine, "Machines")],

    "pumps": [(Pump, "Pumps")]

}


# ====================================
# EXPORT CURRENT TAB
# Returns full raw rows (every DB column) for whichever tab's
# backing table(s) - the frontend builds the actual .xlsx from this,
# matching the client-side workbook-building convention already used
# for the Customer 360 export (Phase 6).
# ====================================

@api.get("/business-master/export/{tab_key}")
def export_tab(
        tab_key: str,
        db: Session = Depends(get_db)
):
    if tab_key == "hubs":

        hub_rows = [
            _row_to_dict(row)
            for row in db.query(Hub).order_by(Hub.id).all()
        ]

        user_names = {
            user.id: user.name
            for user in db.query(User).all()
        }

        approver_rows = []

        for row in db.query(HubApprover).order_by(HubApprover.id).all():

            entry = _row_to_dict(row)
            entry["user_name"] = user_names.get(row.user_id)
            approver_rows.append(entry)

        return {
            "sheets": [
                {"name": "Hubs", "rows": hub_rows},
                {"name": "Hub Approvers", "rows": approver_rows}
            ]
        }

    tables = TAB_EXPORT_TABLES.get(tab_key)

    if not tables:
        raise HTTPException(
            status_code=404,
            detail="Nothing to export for this tab yet."
        )

    sheets = [
        {
            "name": sheet_name,
            "rows": [
                _row_to_dict(row)
                for row in db.query(model).order_by(model.id).all()
            ]
        }
        for model, sheet_name in tables
    ]

    return {"sheets": sheets}
