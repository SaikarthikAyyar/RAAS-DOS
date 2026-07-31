RAAS DOS - Enquiry Workspace Integration Documentation

Project Goal
------------

The objective is NOT to rewrite the existing business modules. The objective is to integrate all existing modules into a single workflow-driven Enquiry Workspace while keeping every module independent.

Every module should continue to own its own business logic, validation, APIs and database tables.

The Enquiry module is only responsible for workflow orchestration.

====================================================================

OVERALL WORKFLOW

Customer Request
        │
        ▼
Customer Request Record Created
        │
        ▼
Initial SALES Enquiry Created
        │
        ▼
Sales Survey
        │
        ▼
OPS Review
        │
        ▼
Techno Commercial Approval
        │
        ▼
Commercial Approval
        │
        ▼
Quote Released
        │
        ▼
PO Received
        │
        ▼
Job Created
        │
        ▼
Execution
        │
        ▼
Closed

Every stage owns its own table.

The Enquiry table simply connects them together.

====================================================================

DESIGN PRINCIPLE

The Enquiry table DOES NOT own business data.

Instead,

Customer Request owns customer information.

Sales Survey owns survey information.

Ops Review owns operations information.

Commercial owns commercial information.

Execution owns execution information.

The Enquiry table stores references to those records.

Example:

customer_request_id

sales_survey_id

ops_review_id

techno_commercial_id

commercial_id

quote_id

po_id

job_id

execution_id

etc.

This makes the Enquiry a workflow controller instead of a business data owner.

====================================================================

ENQUIRY WORKSPACE

When the user clicks Open on the Enquiry Dashboard, a new workspace opens.

Layout:

--------------------------------------------------

Header

Workflow Stepper

Module Tabs

Selected Module Content

--------------------------------------------------

The Header and Workflow Stepper remain fixed.

Only the module content changes.

====================================================================

SURVEY TAB ARCHITECTURE

The Survey tab inside the Enquiry Workspace DOES NOT contain the editable Sales Survey form.

Instead it acts as a read-only dashboard.

Example:

--------------------------------------------------

Customer

Job

Geometry

Safety

Pump

Insights

--------------------------------------------------

Buttons

Fill Survey

Edit Survey

New Survey

--------------------------------------------------

====================================================================

WHERE THE SURVEY DATA COMES FROM

The Survey tab never owns survey data.

Instead it performs the following flow:

Open Enquiry

↓

Read sales_survey_id from the enquiry

↓

Call Sales Survey API

↓

Receive grouped survey response

↓

Populate summary cards

The backend already returns the response grouped as:

customer

job

geometry

safety

pump

dewatering

insights

These groups map directly to the Survey summary cards.

No transformation should be necessary.

====================================================================

THE EXISTING SALES SURVEY MODULE

The existing Sales Survey module already contains:

- Validation
- Metrics
- Volume calculations
- Completion percentage
- Progress tracking
- Media handling
- Existing survey loading
- Customer Request prefill
- Submission logic

This module should NOT be duplicated.

Instead,

Survey Tab

↓

Fill/Edit Survey

↓

Launch Existing Sales Survey Module

↓

Save

↓

Return to Enquiry Workspace

The existing module remains the only place where surveys are edited.

====================================================================

FIRST SURVEY WORKFLOW

Initially,

sales_survey_id = NULL

The Survey tab displays:

"No Survey Available"

and

[Fill Survey]

When the survey is completed,

Create Sales Survey

↓

Receive Sales Survey ID

↓

Update enquiry.sales_survey_id

↓

Refresh Survey Tab

The Survey tab now displays the completed survey.

====================================================================

EDITING AN EXISTING SURVEY

If the enquiry already contains

sales_survey_id = 14

the Survey tab displays the survey summary.

Clicking

Edit Survey

opens the existing Sales Survey module.

The Sales Survey module loads

customer_request_id

and

sales_survey_id

using the existing API.

After saving,

The Sales Survey table is updated.

The Enquiry still points to the same survey.

The Survey tab simply reloads and reflects the updated information.

No new enquiry should be created.

====================================================================

NEW SURVEY WORKFLOW

One Customer Request may eventually contain multiple surveys.

Example:

Customer Request

├── Survey 1

├── Survey 2

├── Survey 3

The current Sales Survey module already supports this using:

customerSurveys

selectedSurvey

The Enquiry references only ONE survey.

====================================================================

NEW SURVEY BUTTON

When the user clicks

New Survey

the workflow becomes:

Current Customer Request

↓

Create Empty Survey

↓

Open Sales Survey Module

↓

Complete Survey

↓

Save

↓

Receive New Survey ID

↓

Create NEW SALES Enquiry

using

customer_request_id = same

sales_survey_id = new

This preserves survey history while creating a completely new workflow instance.

====================================================================

IMPORTANT BACKEND CHANGE

Current Behaviour

Every time a survey is submitted,

the backend

Completes the current SALES enquiry

AND

Creates another enquiry.

This behaviour is only correct for the very first survey.

For the Enquiry Workspace architecture this needs to change.

Correct Behaviour

Editing an existing survey should perform:

Update Existing Survey

↓

Update Existing Enquiry

↓

Complete Existing SALES Enquiry

↓

Create OPS Enquiry

No duplicate SALES enquiry should be created.

Only clicking

New Survey

should create a brand new SALES enquiry.

====================================================================

SURVEY TAB RESPONSIBILITY

The Survey tab is ONLY responsible for displaying information.

It is NOT responsible for:

Validation

Calculations

Saving

Business logic

API construction

Those responsibilities remain inside the existing Sales Survey module.

====================================================================

DATA OWNERSHIP

Customer Request owns:

- Company
- Contact
- Plant
- Asset
- Cleaning details
- Customer entered information

Sales Survey owns:

- Survey observations
- Job information
- Geometry
- Tank measurements
- Safety
- Pump inputs
- Customer insights

Enquiry owns:

- Workflow state
- Module references
- Current stage
- Assignment information

====================================================================

IMPLEMENTATION PLAN

Phase 1

Create the Enquiry Workspace shell.

Phase 2

Wire the Open button to navigate into the workspace.

Phase 3

Implement the Survey tab as a read-only summary using the existing Sales Survey API.

Phase 4

Connect Fill/Edit Survey to the existing Sales Survey module.

Phase 5

Update enquiry.sales_survey_id after the survey is saved.

Phase 6

Implement New Survey which creates a new Sales Survey instance and a new SALES enquiry.

Phase 7

Repeat the same architecture for:

Ops Review

Techno Commercial

Commercial Approval

Quote

PO

Job

Execution

Audit Trail

====================================================================

ARCHITECTURAL RULE

Do NOT duplicate business logic.

The Enquiry Workspace is responsible for:

- Viewing
- Navigation
- Workflow
- Progress
- Module orchestration

Each business module remains responsible for:

- Validation
- Editing
- Saving
- Calculations
- Business rules
- API interaction

This separation should be maintained throughout the project.

====================================================================

PENDING TASK (REMINDER)

The Customer Request module still requires proper success and error handling.

Current implementation:

Create Customer Request

↓

Upload Media

↓

alert()

↓

Navigate()

This should later be replaced with:

- Proper success notifications.
- Proper validation error messages.
- Proper media upload failure handling.
- Prevent navigation when creation fails.
- Consistent loading state during submission.

This task has intentionally been deferred until after the Enquiry Workspace integration is stable.