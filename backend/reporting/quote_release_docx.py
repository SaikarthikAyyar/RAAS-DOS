# ====================================
# QUOTE RELEASE DOCX - DYNAMIC TABLES
#
# The two segments a Quote Template can't reasonably hand-type per
# quote, because they're relational (tank/machine specs) or derived
# (the commercial rate) rather than boilerplate. Everything else in
# the document is plain admin-edited text, substituted via the same
# {token} mechanism Email Templates already uses.
#
# Matches the real reference proposal's own shape: the commercial
# table shows one customer-facing rate line (UoM/Qty/Rate), never our
# internal cost breakdown (mobilisation/overhead/margin/etc.) - same
# "final number only, no internal breakdown" principle already
# established for the Quote & Commercial tab's customer-facing preview.
# ====================================


# ====================================
# TANK / MACHINE DETAILS TABLE
# ====================================

def build_tank_machine_table(doc, sales_survey, machine):

    table = doc.add_table(rows=1, cols=2)
    table.style = "Light Grid Accent 1"

    header = table.rows[0].cells
    header[0].text = "Parameter"
    header[1].text = "Value"

    rows = []

    if sales_survey is not None:

        rows.append(("Tank Type", sales_survey.tank_type or "-"))
        rows.append(("Tank Length / Diameter (m)", sales_survey.tank_length or "-"))
        rows.append(("Tank Width (m)", sales_survey.tank_width or "-"))
        rows.append(("Tank Depth (m)", sales_survey.tank_depth or "-"))
        rows.append(("Estimated Volume (m3)", sales_survey.estimated_volume or "-"))

    if machine is not None:

        rows.append(("Recommended Machine", machine.name or "-"))
        rows.append(("Power Type", machine.power_type or "-"))

        base_output = (
            f"{machine.base_output_per_day} {machine.base_output_basis}"
            if machine.base_output_per_day
            else "-"
        )
        rows.append(("Base Output Capacity", base_output))
        rows.append(("Max Vertical Lift (m)", machine.max_vertical_lift or "-"))
        rows.append(("Hazard Rating", machine.hazard_rating or "-"))

    if not rows:
        rows.append(("-", "No tank or machine data available for this enquiry yet."))

    for label, value in rows:
        cells = table.add_row().cells
        cells[0].text = str(label)
        cells[1].text = str(value)

    return table


# ====================================
# COMMERCIAL RATE TABLE
# One customer-facing rate line, matching the reference document's
# Sr.No/Description/UoM/Qty/Rate shape - never the internal cost
# breakdown (mobilisation/overhead/margin/etc.).
# ====================================

def build_commercial_table(doc, description, estimated_volume, final_approved_value):

    table = doc.add_table(rows=1, cols=5)
    table.style = "Light Grid Accent 1"

    header = table.rows[0].cells
    header[0].text = "Sr. No."
    header[1].text = "Description"
    header[2].text = "UoM"
    header[3].text = "Qty"
    header[4].text = "Rate (INR per m3)"

    rate = (
        final_approved_value / estimated_volume
        if estimated_volume and final_approved_value is not None
        else None
    )

    row = table.add_row().cells
    row[0].text = "1"
    row[1].text = description or "Cleaning / sludge removal service"
    row[2].text = "CUM"
    row[3].text = f"{estimated_volume:,.0f}" if estimated_volume else "-"
    row[4].text = f"{rate:,.2f}" if rate is not None else "-"

    total_row = table.add_row().cells
    total_row[0].text = ""
    total_row[1].text = "Total Quoted Value (GST extra as applicable)"
    total_row[2].text = ""
    total_row[3].text = ""
    total_row[4].text = f"{final_approved_value:,.0f}" if final_approved_value is not None else "-"

    return table
