-- Direct follow-up correction after 054, based on the user pointing
-- out three real gaps against their own reference edit and the
-- source PDF:
--   - "PROJECT OVERVIEW" restored as its own explicit numbered
--     heading (054 had folded it into "TANK / MACHINE DETAILS" to
--     force them onto one page - the generator's page-break behavior
--     is what actually changed instead, see quote_release_docx.py,
--     so the heading no longer needs to be sacrificed for that).
--   - The sector list, and the "JanyuTech responsible for" / "Client
--     responsible for" lists, are now real "- " bulleted lines
--     (rendered as genuine Word bullet-list items by the generator),
--     matching the reference document's own real bulleted lists -
--     previously plain unbulleted text / one crammed paragraph.
--   - A real "Note:" block added under "COMMERCIAL PROPOSAL" -
--     matching the two notes the user had already drafted in their
--     own edit (JanyuTech's scope excludes disposal; internal
--     movement/water/electricity is the customer's scope), generic
--     via {customer} instead of hardcoded to any one client.

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
- Oil & Gas
- Chemical & Processing Industry
- Municipal, Bulk Liquid & Bulk Solid Handling
- Industrial Automation with a specific focus on Flexible Automation
- Defence, Space and Industrial applications
- Mining

PROJECT OVERVIEW
With an increase in production capacity and a view on safety mandates, the need to streamline the cleaning and maintenance operations of bulk liquid storage tanks is apparent. A robotic system with remote operation is suggested to perform these operations in an online condition in a risk-free manner.

TANK / MACHINE DETAILS
{tank_machine_table}

Machine Overview:
{machine_features}

COMMERCIAL PROPOSAL
Please find below the full rate breakdown for the combined budgetary value arrived at for your enquiry.
{commercial_table}

Valid till: {valid_till}

Payment terms: Within 7 days from the date of invoice.

Note:
a) JanyuTech''s scope is limited to the removal of sludge - disposal of sludge is not in our scope.
b) Internal movement at site for the team, water and electricity is in {customer}''s scope.

JanyuTech responsible for:
- Mobilization of equipment and plant as mutually agreed.
- Site supervisor, machine operators, and technicians for support included in the quote.
- JanyuTech team stay, food & local travel is in JT scope.
- Installation & Commissioning site support.

Client responsible for:
- Hydra / crane required for deployment / removal of the robot is in client scope.
- Confirmation of working hours in advance, to enable mobilisation of manpower.
- All necessary co-ordination.
- PTW (work permit), tool box talk, checklist certification.

We look forward to your valuable orders.

TERMS & CONDITIONS
Prices are exclusive of GST as applicable. JanyuTech is responsible for mobilization of equipment and plant as mutually agreed, site supervisor/machine operators/technicians included in the quote, and installation & commissioning site support. The customer is responsible for hydra/crane required for deployment/removal of the robot, gate pass clearance, confirmation of working hours in advance, and clearance of bills within 7 days from submission.

We look forward to receiving your valued purchase order.

Thanks & regards,
Janyu Technologies Pvt Ltd'
WHERE name = 'Standard Quote';
