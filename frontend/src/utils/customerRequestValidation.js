import { isValidEmail, isValidPhone } from "./validators";


// ====================================
// CUSTOMER REQUEST ERRORS
// Required fields mirror backend/schemas/customer_schema.py's
// CustomerRequestSchema exactly (company_name, plant_site_location,
// nature_of_job, cleaning_date, cleaning_frequency are the only
// non-Optional fields there). contact_number/client_contact_email
// are Optional in the schema, so they only error when non-empty and
// malformed, never for being blank.
// ====================================

export function getCustomerRequestErrors(customer, requirement) {

    return {

        company_name: !customer.company_name,

        plant_site_location: !customer.plant_site_location,

        nature_of_job: !customer.nature_of_job,

        cleaning_date: !requirement.cleaning_date,

        cleaning_frequency: !requirement.cleaning_frequency,

        contact_number: !isValidPhone(customer.contact_number),

        client_contact_email: !isValidEmail(customer.client_contact_email)

    };

}
