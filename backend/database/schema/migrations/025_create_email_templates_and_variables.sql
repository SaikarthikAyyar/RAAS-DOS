-- Email Templates: real, admin-editable email content + per-template
-- variable lists, replacing the wireframe's flat bm.emailTemplates
-- mock (Name/Use Case/Subject/Status/Edit/Remove, body hidden, no
-- real send wiring) with a working system. See Phase 12 in the
-- cumulative plan file for full context.

CREATE TABLE IF NOT EXISTS email_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    use_case VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- key: the literal token name used as {key} in subject/body
-- substitution. is_recipient_field: marks which one variable supplies
-- the "to" address for the Send form - enforced as at-most-one-per-
-- template at the app layer, not a DB constraint.
CREATE TABLE IF NOT EXISTS email_template_variables (
    id SERIAL PRIMARY KEY,
    email_template_id INTEGER NOT NULL REFERENCES email_templates(id) ON DELETE CASCADE,
    key VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    is_recipient_field BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_template_variable_key UNIQUE (email_template_id, key)
);

CREATE INDEX IF NOT EXISTS idx_email_template_variables_template_id ON email_template_variables(email_template_id);


-- ====================================
-- SEED DATA (idempotent)
-- ====================================

INSERT INTO email_templates (name, use_case, subject, body, is_active) VALUES
(
    'Quote Release',
    'Release quote to client',
    'Your RAAS quote — {enquiry_id}',
    $$Dear {contact_name},

Please find our quotation for {customer}, {site}. Total quoted value: {value}.

Regards,
Janyu Technologies$$,
    true
)
ON CONFLICT (name) DO NOTHING;

INSERT INTO email_template_variables (email_template_id, key, label, is_recipient_field, sort_order)
SELECT id, v.key, v.label, v.is_recipient, v.ord FROM email_templates,
    (VALUES
        ('receiver_email','Recipient Email',true,0),
        ('contact_name','Contact Name',false,1),
        ('customer','Customer',false,2),
        ('site','Site',false,3),
        ('value','Quoted Value',false,4),
        ('enquiry_id','Enquiry ID',false,5)
    ) AS v(key, label, is_recipient, ord)
WHERE name = 'Quote Release'
ON CONFLICT (email_template_id, key) DO NOTHING;


INSERT INTO email_templates (name, use_case, subject, body, is_active) VALUES
(
    'Daily Progress Update',
    'Execution daily update',
    'Daily progress update — {enquiry_id}',
    $$Job {enquiry_id} update: {pct_complete}% complete as of today.

Regards,
Janyu Ops$$,
    true
)
ON CONFLICT (name) DO NOTHING;

INSERT INTO email_template_variables (email_template_id, key, label, is_recipient_field, sort_order)
SELECT id, v.key, v.label, v.is_recipient, v.ord FROM email_templates,
    (VALUES
        ('receiver_email','Recipient Email',true,0),
        ('enquiry_id','Enquiry ID',false,1),
        ('pct_complete','Percent Complete',false,2)
    ) AS v(key, label, is_recipient, ord)
WHERE name = 'Daily Progress Update'
ON CONFLICT (email_template_id, key) DO NOTHING;


INSERT INTO email_templates (name, use_case, subject, body, is_active) VALUES
(
    'Follow-up Reminder',
    'Customer follow-up reminder',
    'Checking in — {customer}',
    $$Hi, checking in on {customer} — {note}. Let us know a good time to reconnect.$$,
    true
)
ON CONFLICT (name) DO NOTHING;

INSERT INTO email_template_variables (email_template_id, key, label, is_recipient_field, sort_order)
SELECT id, v.key, v.label, v.is_recipient, v.ord FROM email_templates,
    (VALUES
        ('receiver_email','Recipient Email',true,0),
        ('customer','Customer',false,1),
        ('note','Note',false,2)
    ) AS v(key, label, is_recipient, ord)
WHERE name = 'Follow-up Reminder'
ON CONFLICT (email_template_id, key) DO NOTHING;


-- Stable lookup key for the automatic welcome-email send path
-- (backend/services/email_template_service.py::send_user_account_email
-- queries WHERE name = 'User Account Created') - a soft contract
-- between this row and the code, not FK-enforced.
INSERT INTO email_templates (name, use_case, subject, body, is_active) VALUES
(
    'User Account Created',
    'New user account notification',
    'RAAS-DOS Account Notification',
    $$Dear {user_name},

This is an auto-generated notification. Please do not reply to this email.

An account has been created for you on RAAS-DOS, the role-based workflow management system used to manage enquiries, surveys, and job execution.

Account details:

  Email:    {receiver_email}
  Password: {user_password}
  Role:     {user_role}

RAAS-DOS manages an enquiry through its full lifecycle - Customer Request, Sales Survey, Ops Review, Techno-Commercial Approval, Commercial Approval, PO, Job Creation, Execution, and Completion - with each stage handled by the personnel whose role covers it. As a {user_role}, you will have access to the modules relevant to your role.

Please log in using the email and password provided above. You are advised to change your password after your first login.

If you believe you have received this email in error, or if your access appears incorrect, please contact your system administrator.

This is a system-generated email. Please do not reply.

Regards,
RAAS-DOS$$,
    true
)
ON CONFLICT (name) DO NOTHING;

INSERT INTO email_template_variables (email_template_id, key, label, is_recipient_field, sort_order)
SELECT id, v.key, v.label, v.is_recipient, v.ord FROM email_templates,
    (VALUES
        ('receiver_email','Receiver Email',true,0),
        ('user_name','User Name',false,1),
        ('user_role','User Role',false,2),
        ('user_password','Temporary Password',false,3)
    ) AS v(key, label, is_recipient, ord)
WHERE name = 'User Account Created'
ON CONFLICT (email_template_id, key) DO NOTHING;
