# ====================================
# SHARED {token} SUBSTITUTION
# Factored out of email_template_service.py::render_template so Quote
# Templates can reuse the exact same substitution rule instead of
# reimplementing it - leaves an unmatched {token} as literal text
# rather than crashing if a variable value wasn't supplied.
# ====================================

import re


def substitute_tokens(text, variable_values):

    variable_values = variable_values or {}

    return re.sub(
        r"\{(\w+)\}",
        lambda match: str(variable_values.get(match.group(1), match.group(0))),
        text
    )
