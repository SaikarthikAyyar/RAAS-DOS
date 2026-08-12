# ====================================
# VALUE DISPLAY
# The Enquiries list's "Value" column - the wireframe shows a single
# flat number; our Quote model tracks a min/max range pre-approval and
# collapses to one real number only once approved. Rather than fake a
# single figure before that, show the honest range until one exists.
# ====================================

def compute_value_display(quote):

    if quote is None:
        return None

    if quote.final_approved_value is not None:
        return f"₹{quote.final_approved_value:,.0f}"

    if quote.combined_budgetary_value_min is not None and quote.combined_budgetary_value_max is not None:
        return f"₹{quote.combined_budgetary_value_min:,.0f} – ₹{quote.combined_budgetary_value_max:,.0f}"

    return None
