# ====================================
# JOB ON
# "Site location + asset name" combined into one display string for an
# enquiry - shown as the "Job On" column on both the Enquiries
# frontpage and the Business Masters Customer 360's Linked Orders
# table. Prefers the linked Asset's own plant/name (the real site this
# job is actually against); falls back to the Customer Request's own
# plant_site_location for an enquiry that hasn't resolved/created a
# real Asset yet (asset_id still null) - never fabricates a value that
# isn't there.
# ====================================

def compute_job_on(site, asset_name, fallback_site_location):

    if site and asset_name:
        return f"{site} - {asset_name}"

    if site:
        return site

    if asset_name:
        return asset_name

    if fallback_site_location:
        return fallback_site_location

    return None
