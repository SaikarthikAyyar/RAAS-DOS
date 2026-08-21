import { isValidEmail, isValidPhone } from "./validators";


// ====================================
// CUSTOMER REQUEST ERRORS
// company_name, plant_site_location, nature_of_job are required.
// cleaning_date is NOT required (matches Sales Survey's own
// cleaning_date, also non-compulsory - a plain optional field on
// both forms). contact_number/client_contact_email are Optional in
// the schema, so they only error when non-empty and malformed, never
// for being blank.
//
// asset_name is required only when no existing asset was picked
// (Section 2's Division/Department/Asset Name/Type block only renders
// in that case too) - Plant + Asset Name together are exactly what
// gate real Asset creation server-side (resolve_or_create_asset), so
// leaving asset_name blank on a genuinely new site silently produces
// an enquiry with no linked asset - no Business Masters asset record
// to update later from Sales Survey.
// ====================================

export function getCustomerRequestErrors(customer, requirement) {

    return {

        company_name: !customer.company_name,

        plant_site_location: !customer.plant_site_location,

        nature_of_job: !customer.nature_of_job,

        cleaning_frequency: !requirement.cleaning_frequency,

        asset_name: !customer.existing_asset_id && !requirement.asset_name,

        contact_number: !isValidPhone(customer.contact_number),

        client_contact_email: !isValidEmail(customer.client_contact_email)

    };

}
