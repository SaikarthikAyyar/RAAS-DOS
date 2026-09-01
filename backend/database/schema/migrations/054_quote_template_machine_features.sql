-- Quote Template restructure, matching the real reference proposal's
-- own flow (Section 3 Project Details -> Section 4 machine-specific
-- content, both ahead of the commercial section):
--   - "DESCRIPTION OF JOB" and "DETAILED SCOPE" sections removed -
--     not present in the reference document.
--   - "TECHNO-COMMERCIAL QUOTE SUMMARY" renamed to "COMMERCIAL
--     PROPOSAL", matching the reference document's own heading.
--   - "PROJECT OVERVIEW" folded into the "TANK / MACHINE DETAILS"
--     section (its own heading removed) so both render on the same
--     page - every ALL-CAPS heading forces a fresh page in the
--     generator's own formatting classifier, so this is the only way
--     to guarantee they share a page.
--   - New {machine_features} placeholder inserted right after
--     {tank_machine_table} - a real, dynamically-built narrative +
--     "Key Features" bullet list for whichever machine this specific
--     enquiry resolved to (backend/reporting/quote_release_docx.py::
--     build_machine_features), not hardcoded text for any one machine.

UPDATE quote_templates
SET body = 'Proposal to
M/s. {customer}
{site}

Proposal No: {proposal_no}
Enquiry reference no: {enquiry_ref}
Proposal Submission Date: {proposal_date}

Submitted to:
{contact_name}
{contact_designation}
{customer}
{contact_phone}
{contact_email}

Robot & System Developed and Manufactured by
Janyu Technologies Pvt Ltd
Unit 1 & 2, Dhuri Industrial Complex, MadhuVrinda Phase IV, Sativali Road, Vasai East - 401208, Palghar Dist., Maharashtra.
CIN U31900MH2016PTC283131
GST Number 27AADCJ7504J1ZG

INTRODUCTION
JanYu Technologies Pvt Ltd is a company incorporated with the primary objective of providing Portable Mobile Field Robotic & Remotely operated solutions and services to improve productivity in Non-Conducive work environments; Industrial Automation and Robotic solutions for better productivity and quality of production coupled with Production Data Management.

Conventional robotic systems are largely limited to assembly lines and replace human beings for repetitive jobs. At Janyu Tech we provide "Human enabling robots" as against the conventional "Human replacing robots".

JanYu Technologies offers cost-effective robotic platforms to enable and ease operations in hazardous, constrained and intensive skill dependent workspaces. The products shall assist humans in day-to-day operations. The safety, cost-saving and increase in productivity brought in by JanYu Technologies will help our customers grow.

The following sectors are in focus:
Municipal Water & Sewage
Industrial Automation with a specific focus on Flexible Automation
Automated Warehousing Systems
Defense, Space and Industrial applications.
Oil & Gas
Chemical & Processing Industry

TANK / MACHINE DETAILS
With an increase in production capacity and a view on safety mandates, the need to streamline the cleaning and maintenance operations of bulk liquid storage tanks is apparent. A robotic system with remote operation is suggested to perform these operations in an online condition in a risk-free manner.

{tank_machine_table}

Machine Overview:
{machine_features}

COMMERCIAL PROPOSAL
Please find below the full rate breakdown for the combined budgetary value arrived at for your enquiry.
{commercial_table}

Valid till: {valid_till}

Payment terms: Within 7 days from the date of invoice.

TERMS & CONDITIONS
Prices are exclusive of GST as applicable. JanyuTech is responsible for mobilization of equipment and plant as mutually agreed, site supervisor/machine operators/technicians included in the quote, and installation & commissioning site support. The customer is responsible for hydra/crane required for deployment/removal of the robot, gate pass clearance, confirmation of working hours in advance, and clearance of bills within 7 days from submission.

We look forward to receiving your valued purchase order.

Thanks & regards,
Janyu Technologies Pvt Ltd'
WHERE name = 'Standard Quote';
