-- ====================================
-- QUOTE TEMPLATES (Business Master)
-- Mirrors email_templates/email_template_variables exactly - a long
-- admin-edited body with {token} placeholders, plus two RESERVED
-- placeholder tokens ({tank_machine_table}/{commercial_table}) the
-- generator special-cases into real dynamic tables instead of plain
-- text substitution. See backend/services/quote_release_service.py.
-- ====================================

CREATE TABLE IF NOT EXISTS quote_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quote_template_variables (
    id SERIAL PRIMARY KEY,
    quote_template_id INTEGER NOT NULL REFERENCES quote_templates(id) ON DELETE CASCADE,
    key VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT uq_quote_template_variable_key UNIQUE (quote_template_id, key)
);

-- One row per generated quote-release document (the resolved .docx a
-- user downloads from Commercial Approval, then finishes externally
-- and attaches as a PDF when sending). File itself lives on local
-- disk under backend/uploads/quote_releases/{enquiry_id}/, same
-- convention as customer_media.
CREATE TABLE IF NOT EXISTS quote_release_documents (
    id SERIAL PRIMARY KEY,
    quote_id INTEGER NOT NULL REFERENCES quotes(id),
    enquiry_id INTEGER REFERENCES enquiries(id),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    generated_by VARCHAR(150),
    created_at TIMESTAMP DEFAULT now()
);

-- Real PO uploads. Leaf records nothing else references, so a real
-- delete (not soft-delete) is fine - unlike Business Masters, which
-- need soft-delete for FK safety against live data.
CREATE TABLE IF NOT EXISTS purchase_orders (
    id SERIAL PRIMARY KEY,
    enquiry_id INTEGER NOT NULL REFERENCES enquiries(id),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    po_number VARCHAR(100),
    po_value NUMERIC(14,2),
    uploaded_by VARCHAR(150),
    uploaded_at TIMESTAMP DEFAULT now()
);

-- ====================================
-- SEED: default Quote Template
-- Transcribed from a real reference proposal document the business
-- already sends (Varaha SCF proposal, Utkal Alumina RFQ) - structure
-- and section order preserved, company-specific one-off details
-- (specific customer names/dates) replaced with real tokens.
-- ====================================

INSERT INTO quote_templates (name, active, body)
SELECT
    'Standard Quote',
    true,
    E'Proposal to\nM/s. {customer}\n{site}\n\nProposal No: {proposal_no}\nEnquiry reference no: {enquiry_ref}\nProposal Submission Date: {proposal_date}\n\nSubmitted to:\n{contact_name}\n{contact_designation}\n{customer}\n{contact_phone}\n{contact_email}\n\nRobot & System Developed and Manufactured by\nJanyu Technologies Pvt Ltd\nUnit 1 & 2, Dhuri Industrial Complex, MadhuVrinda Phase IV, Sativali Road, Vasai East - 401208, Palghar Dist., Maharashtra.\nCIN U31900MH2016PTC283131\nGST Number 27AADCJ7504J1ZG\n\nINTRODUCTION\nJanYu Technologies Pvt Ltd is a company incorporated with the primary objective of providing Portable Mobile Field Robotic & Remotely Operated solutions and services to improve productivity in non-conducive work environments. JanYu Technologies offers cost-effective robotic platforms to enable and ease operations in hazardous, constrained and intensive skill-dependent workspaces.\n\nPROJECT OVERVIEW\nWith an increase in production capacity and a view on safety mandates, the need to streamline the cleaning and maintenance operations of bulk liquid storage tanks is apparent. A robotic system with remote operation is suggested to perform these operations in an online condition in a risk-free manner.\n\nTANK / MACHINE DETAILS\n{tank_machine_table}\n\nDESCRIPTION OF JOB\nThe scope of work shall include complete execution of the cleaning activity on a turnkey basis, comprising manpower, machinery, consumables, safety, supervision, and all incidental activities required for successful completion.\n\nDETAILED SCOPE\nMobilization & Site Readiness: Mobilization of all required sludge-handling equipment, slurry pumps, pipelines, support structures, tools, tackles, and skilled manpower at site. Site visit, study of survey data, geometry, and disposal location. Arrangement of temporary facilities such as access paths, pipe supports, lighting, and safety barricading.\n\nSludge Removal: Removal of accumulated sludge/silt up to the target level as defined by survey or as directed by the Engineer-in-Charge. Contractor shall ensure no damage to tank lining, embankments, or pipelines, controlled excavation without over-dredging, and continuous stable conditions during execution.\n\nCOMMERCIAL PROPOSAL\nPlease find below our rates for your enquiry.\n{commercial_table}\n\nValid till: {valid_till}\n\nPayment terms: Within 7 days from the date of invoice.\n\nTERMS & CONDITIONS\nPrices are exclusive of GST as applicable. JanyuTech is responsible for mobilization of equipment and plant as mutually agreed, site supervisor/machine operators/technicians included in the quote, and installation & commissioning site support. The customer is responsible for hydra/crane required for deployment/removal of the robot, gate pass clearance, confirmation of working hours in advance, and clearance of bills within 7 days from submission.\n\nWe look forward to receiving your valued purchase order.\n\nThanks & regards,\nJanyu Technologies Pvt Ltd'
WHERE NOT EXISTS (SELECT 1 FROM quote_templates);

INSERT INTO quote_template_variables (quote_template_id, key, label, sort_order)
SELECT t.id, v.key, v.label, v.sort_order
FROM quote_templates t
CROSS JOIN (
    VALUES
        ('customer', 'Customer Company Name', 0),
        ('site', 'Site / Plant Location', 1),
        ('proposal_no', 'Proposal Number', 2),
        ('enquiry_ref', 'Enquiry Reference No.', 3),
        ('proposal_date', 'Proposal Submission Date', 4),
        ('contact_name', 'Contact Name', 5),
        ('contact_designation', 'Contact Designation', 6),
        ('contact_phone', 'Contact Phone', 7),
        ('contact_email', 'Contact Email', 8),
        ('valid_till', 'Quote Valid Till', 9)
) AS v(key, label, sort_order)
WHERE t.name = 'Standard Quote'
  AND NOT EXISTS (
      SELECT 1 FROM quote_template_variables existing
      WHERE existing.quote_template_id = t.id AND existing.key = v.key
  );
