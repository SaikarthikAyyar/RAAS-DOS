# ====================================
# IMPORTS
# ====================================

from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.reporting.business_masters_export_xlsx import build_tab_export_workbook_bytes

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
from backend.models.personnel import Personnel
from backend.models.personnel_document import PersonnelDocument
from backend.models.hr_role import HrRole
from backend.models.gst_settings import GstSettings


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

    "pumps": [(Pump, "Pumps")],

    "personnel": [
        (Personnel, "Personnel"),
        (PersonnelDocument, "Personnel Documents")
    ],

    "hr": [(HrRole, "HR Roles")],

    "gst": [(GstSettings, "GST Settings")]

}


# ====================================
# TAB LABELS
# Mirrors frontend/src/data/businessMastersTabs.js exactly - used only
# for this export's subtitle banner, not for anything access-related.
# ====================================

TAB_LABELS = {

    "customers": "Customers",
    "machines": "Machine Specs",
    "machineinventory": "Machine Inventory",
    "pumps": "Pump Master",
    "personnel": "Personnel",
    "accessories": "Accessories",
    "hr": "Human Resources",
    "dewatering": "Dewatering Methods",
    "serviceconfig": "Service Configurations",
    "rules": "Commercial Rules",
    "hubs": "Hubs",
    "fleetunits": "Fleet Units",
    "quotetemplates": "Quote Templates",
    "emailtemplates": "Email Templates",
    "lists": "Lookup Lists",
    "gst": "GST & Tax"

}


# ====================================
# EXPORT CURRENT TAB
# Streams a real, styled .xlsx built server-side (matching the
# Customer 360 export's own design) - one sheet per backing table,
# every real DB column, in the same order as before. Content is
# unchanged from what this endpoint used to hand the frontend as raw
# JSON for it to build client-side; only the rendering moved server-
# side, the same fix already applied to the Customer 360 export.
# ====================================

def _gather_tab_sheets(tab_key, db):

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

        return [
            {"name": "Hubs", "rows": hub_rows},
            {"name": "Hub Approvers", "rows": approver_rows}
        ]

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

    return sheets


# ====================================
# ROUTE
# ====================================

@api.get("/business-master/export/{tab_key}")
def export_tab(
        tab_key: str,
        db: Session = Depends(get_db)
):
    sheets = _gather_tab_sheets(tab_key, db)

    if all(not sheet["rows"] for sheet in sheets):
        raise HTTPException(
            status_code=404,
            detail="No data to export for this tab yet."
        )

    tab_label = TAB_LABELS.get(tab_key, tab_key)

    buffer = build_tab_export_workbook_bytes(tab_label, sheets)

    safe_label = tab_label.replace(" ", "_")
    filename = f"{safe_label}_Export_{date.today().isoformat()}.xlsx"

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
