==========================================================
RAAS-DOS
SYSTEM ARCHITECTURE NOTES
(Living Documentation)
==========================================================

Last Updated:
(Current Development Phase)

==========================================================
1. PROJECT OBJECTIVE
==========================================================

RAAS-DOS is a workflow management system that integrates
multiple departments within an organization.

The objective is to improve communication, task delegation,
tracking and visibility across multiple organizational roles
while maintaining a structured workflow.

The workflow modules remain:

Customer Request
↓

Sales Survey
↓

OPS Approval

↓

OPS Selection

↓

Techno Commercial Quote

↓

Approval

↓

Job Creation

↓

Allocation

↓

Job Execution

The interaction between departments occurs through
ENQUIRIES.

Every workflow begins with a Customer Request.

Departments do not directly continue another department's
work. Instead they receive an enquiry, perform the task
assigned to their role, save the module data, and then send
an enquiry to the next designated department.

==========================================================
ROLE-BASED WORKFLOW PRINCIPLE
==========================================================

RAAS-DOS is a role-based workflow management system.

Every user authenticates through a common login page.
After authentication, the user's assigned role determines:

• Dashboard visibility.

• Accessible modules.

• Allowed actions.

• Enquiries that can be viewed.

• Enquiries that can be created.

Users are NOT permitted to perform tasks belonging to
another department.

Instead, work is transferred between departments through
ENQUIRIES.

Each department completes only the modules assigned to its
role, saves the generated data, and then sends an enquiry
to the next designated department.

The receiving department gains access to the cumulative
workflow data completed up to that stage and continues the
workflow from its assigned module.

This role-based enquiry workflow is the core architectural
principle of RAAS-DOS and governs all future development.

==========================================================
Task Completion Principle
==========================================================

Every enquiry contains a Requested Task.

Examples

• Customer Request

• Sales Survey

• OPS Approval

• OPS Selection

• Quote

• Approval

The requested task remains incomplete until the corresponding
module has been successfully completed and saved.

Only then may the enquiry be marked complete and the next enquiry
generated.

This prevents premature workflow transitions.

==========================================================
2. CORE PRINCIPLE
==========================================================

The Customer Request is ALWAYS the primary business object.

It is NOT replaced by an enquiry.

Every workflow instance begins with a Customer Request.

Every subsequent module references the Customer Request
through the existing PK-FK relationships.

Example

Customer Request

↓

Sales Survey

↓

OPS

↓

Quote

↓

Approval

↓

Job

Customer Request remains the anchor throughout the lifecycle.

==========================================================
3. ENQUIRY CONCEPT
==========================================================

An enquiry is a communication and work assignment between
roles.

It is NOT the primary business object.

The Customer Request remains the primary object throughout
the entire workflow.

An enquiry references the Customer Request and carries all
workflow information completed so far.

Before an enquiry is sent:

• Current module data must be completed.

• Current module data must be saved.

• The saved data becomes part of the cumulative workflow
  stored under the Customer Request.

• The enquiry is then generated for the designated role.

The receiving role immediately gains access to all
information completed up to that stage.

Example

Customer

↓

Customer Request Completed

↓

Save Customer Request

↓

Send Enquiry

↓

Sales

↓

Sales Survey Completed

↓

Save Survey

↓

Send Enquiry

↓

OPS

↓

OPS Approval

↓

OPS Selection

↓

Save OPS Selection

↓

Send Enquiry

↓

Sales

↓

Quote

The Customer Request remains unchanged throughout the
entire lifecycle.

==========================================================
4. LOGIN
==========================================================

There is ONE login page.

Every user logs in through the same page.

After authentication the user's ROLE determines:

• Dashboard
• Accessible Modules
• Allowed Actions

==========================================================
5. USER ROLES
==========================================================

Current Roles

1. Customer

Accessible Modules

• Dashboard

• Customer Request

• Customer Live Status
(Future Module)

Customer cannot perform:

• Sales Survey

• OPS Selection

• Quote

• Approval

• Job Processing

----------------------------------------------------------

2. Sales

Accessible Modules

• Dashboard

• Customer Request (View)

• Sales Survey

• Techno Commercial Quote

Sales cannot perform:

• OPS Planning

• Quote Approval

• Job Processing

----------------------------------------------------------

3. OPS

Accessible Modules

• Dashboard

• OPS Approval

• OPS Selection

• Allocation

• Job Creation

OPS cannot perform:

• Customer Request

• Sales Survey editing

• Quote generation

• Management Approval

----------------------------------------------------------

4. Management

Accessible Modules

• Dashboard

• Approval

Management receives quotation enquiries,
reviews all completed workflow information
up to the Quote module and performs only
the Approval task.

Management cannot modify previous modules.

----------------------------------------------------------

5. Admin

Accessible Modules

ALL

Admin has unrestricted visibility across
all enquiries, modules and users.

Admin is responsible for system oversight
and administration rather than participating
in the business workflow.

==========================================================
6. DASHBOARD PRINCIPLE
==========================================================

Every role has its own dashboard.

Dashboard content depends on the authenticated user's role.

Each dashboard contains two independent sections.

----------------------------------------------------------

Received Enquiries

These are enquiries assigned TO the current user.

Behaviour

• Notification generated.

• User can open enquiry.

• User is directed to the module belonging to
  their role.

• User performs only the task assigned to
  their department.

• Selecting a received enquiry displays all
  cumulative workflow information completed
  up to that stage directly within the dashboard.

• The dashboard serves as the primary review
  interface for all enquiry information.

• Users review the enquiry information from
  the dashboard before navigating to their
  assigned module.

• Only the module owned by the current role
  can be modified.

Opening an enquiry does not immediately open a workflow module.

The dashboard first presents a consolidated view of all workflow
information available up to the current stage.

The user reviews this information before explicitly navigating
to the module associated with the assigned task.


----------------------------------------------------------
Implementation Principle

The enquiry SHALL NOT duplicate business data from workflow modules.

Instead, it maintains references (PK-FK relationships) to all
workflow modules completed up to the current stage.

Whenever an enquiry is opened, the backend dynamically assembles
the latest workflow information from the referenced modules.

Therefore:

• The enquiry remains lightweight.

• Business data has a single source of truth.

• Any modification to an existing module is immediately reflected
  in every dashboard displaying that enquiry.

The enquiry payload is therefore generated dynamically rather than
persisted as a duplicated snapshot.

----------------------------------------------------------

Sent Enquiries

These are enquiries previously sent BY the
current user.

Behaviour

• User can monitor enquiry progress.

• User can view all information associated
  with that enquiry.

• User cannot perform another department's
  task.

• Current enquiry status remains visible.

• Workflow status should clearly indicate
  when the enquiry has progressed to the
  next department.

Example

Sales → OPS

↓

OPS Completed

↓

Quote Required

This allows the sender to immediately
understand why the enquiry has returned
to their department.

----------------------------------------------------------

Enquiry Identification

Every enquiry belongs to a Customer Request.

As workflow progresses the enquiry references
all module IDs generated under that Customer
Request up to the latest completed module.

Example

Customer Request ID

↓

Sales Survey ID

↓

OPS Approval ID

↓

OPS Selection ID

↓

Quote ID

↓

Approval ID

↓

Job ID

----------------------------------------------------------

Enquiry Structure

Each enquiry represents one workflow task.

The enquiry stores:

• Enquiry ID

• Customer Request ID

• References to every completed workflow module

• Sender Role

• Receiver Role

• Requested Task

• Workflow Status

• Task Completion Flag

• Created Timestamp

• Updated Timestamp

Workflow module data is never duplicated inside the enquiry.

Instead, the enquiry dynamically assembles the required
information whenever it is viewed.

Workflow Status

Pending

↓

In Progress

↓

Completed

↓

Forwarded

↓

Closed

==========================================================
7. STEP 1
==========================================================

Customer Login

↓

Dashboard

↓

Customer Request

↓

Complete Customer Request

↓

Customer Request Saved

↓

Send Enquiry to Sales

Business Rule

Customer CANNOT send an enquiry until the Customer Request
module has been completed.

==========================================================
8. STEP 2
==========================================================

Sales Login

↓

Dashboard

↓

Received Customer Enquiry

↓

Open Enquiry

↓

Navigate to Sales Survey

↓

Complete Sales Survey

↓

Create / Save Survey

↓

Save Survey Data

↓

Send Enquiry to OPS

Business Rules

• Sales cannot send an enquiry until the
  Sales Survey has been completed.

• The enquiry contains all workflow
  information completed up to the Sales
  Survey.

• The enquiry is assigned to the OPS role.


==========================================================
9. STEP 3
==========================================================

OPS Login

↓

Dashboard

↓

Received Sales Enquiry

↓

Notification

↓

Open Enquiry

↓

Navigate to OPS Approval

↓

Review Sales Survey

↓

Approve Doability

↓

If Approved

↓

Navigate to OPS Selection

↓

Review AI Recommendations

↓

Override Recommendations if Required

↓

Configure

• Service Configuration

• Equipment

• Manpower

↓

Save OPS Selection

↓

Send Enquiry to Sales

Business Rules

• OPS Approval must be completed before
  OPS Selection.

• OPS Selection cannot begin until the
  job has been approved.

• AI recommendations generated by
  ops_engine.py are recommendations only.

• OPS users may override any AI generated
  recommendation.

• OPS Selection data must be saved before
  an enquiry can be sent.

----------------------------------------------------------

If Job is NOT Doable

OPS

↓

Send Enquiry to Sales

↓

Sales Reviews Situation

↓

If changes are possible

↓

Modify workflow and resend to OPS

↓

Else

↓

Sales sends enquiry to Customer

↓

Customer informed that the job is currently
not feasible.

(Current workflow. Subject to future revision.)


==========================================================
10. STEP 4
==========================================================

Sales Login

↓

Dashboard

↓

Received OPS Enquiry

↓

Received Enquiry Notification

↓

Open Enquiry

↓

Navigate to Techno Commercial Quote

↓

Review Customer Request

↓

Review Sales Survey

↓

Review OPS Approval

↓

Review OPS Selection

↓

Generate Quote Recommendations

↓

Review AI Recommendations

↓

Override Recommendations if Required

↓

Generate Quote

↓

Save Quote

↓

Send Enquiry to Customer

Business Rules

• Quote generation can begin only after
  OPS Selection has been completed.

• The Sales user receives all workflow
  information completed up to OPS Selection.

• Quote recommendations generated by
  quote_engine.py are recommendations only.

• Sales users may override any AI generated
  recommendation.

• Quote data must be saved before an
  enquiry can be sent.

• Quote data must be saved before an
  enquiry can be sent.

• The enquiry generated for the Customer
  contains all workflow information
  completed up to the Quote module.

• The Customer receives read-only access to

    Customer Request

    Sales Survey

    OPS Approval

    OPS Selection

    Techno Commercial Quote

• The Customer reviews the quotation but
  cannot modify previous modules.

• The Customer either

    Accepts the quotation

        OR

    Requests a quotation revision.


==========================================================
11. STEP 5
==========================================================

Management Login

↓

Dashboard

↓

Received Customer Approved Quote Enquiry

↓

Received Enquiry Notification

↓

Review Enquiry Information

↓

Navigate to Approval Board

↓

Approve Quote

↓

Save Approval

↓

Send Enquiry to OPS

Business Rules

• Management receives all workflow
  information completed up to the
  Quote module within the enquiry.

• Management reviews the enquiry
  information from the dashboard.

• Management performs only the
  Approval Board module.

• Previous modules are not modified.

• Approval data must be saved before
  the enquiry is forwarded.

• Once approved, an enquiry is sent
  to OPS for resource allocation.

==========================================================
12. STEP 6
==========================================================

OPS Login

↓

Dashboard

↓

Received Management Approval Enquiry

↓

Received Enquiry Notification

↓

Review Enquiry Information

↓

Navigate to Job Creation

↓

Create Job

↓

Save Job

↓

Generate Job ID

↓

Send Job Information

↓

Proceed to Allocation

Business Rules

• Job Creation begins only after
  Management approval.

• Job Creation generates a unique
  Job ID.

• The Job ID becomes the primary
  execution identifier for the
  remainder of the workflow.

• Once generated, the Job ID is
  appended to the enquiry.

• Every subsequent execution module
  references the Job ID.

• The Job ID becomes visible to all
  authorised users.

• The Customer Live Status module
  will utilise the Job ID to display
  execution progress.

==========================================================
COMMERCIAL TRACKING
==========================================================

The Sales Dashboard provides commercial
visibility for every enquiry.

PO Value

Represents quotations that have been
approved but have not yet completed
Allocation.

Invoice Value

Once Allocation has been completed,

the enquiry transitions from

PO Value

↓

Invoice Value

This indicates that the job has entered
the execution stage.

Sales can therefore monitor

• Quote Value

• PO Value

• Invoice Value

for every Customer Request throughout
its lifecycle.

After execution has been completed,

Sales receives completion confirmation
and provides the Customer with the
final invoice containing

• Job Completion Summary

• Final Invoice Amount

• Expected Payment


==========================================================
13. STEP 7
==========================================================

OPS Login

↓

Dashboard

↓

Open Job

↓

Navigate to Allocation

↓

Allocate Machines

↓

Allocate Human Resources

↓

Verify Personnel Documents

↓

Save Allocation

↓

Update Enquiry

Business Rules

• Allocation is performed with
  respect to the generated Job ID.

• Machine allocation schedules
  equipment against the Job.

• Human allocation assigns the
  required workforce to the Job.

• Personnel documents such as

    Aadhaar

    Qualifications

    Certifications

    Other required documents

  can be verified before allocation.

• Once Allocation has been completed,
  the enquiry is updated with

    Machine Assignment

    Assigned Personnel

    Resource Allocation Status

• Allocation completion marks the
  beginning of execution preparation.


==========================================================
14. LIVE INVOICE PRINCIPLE
==========================================================

The Invoice is a business object that is
independent of an Enquiry.

Unlike an Enquiry, the Invoice does not
store a static snapshot of information.

Instead, it reflects information directly
from the source modules in real time.

Whenever execution-related information
changes, the Invoice immediately reflects
those updates.

Examples include

• Machine Location

• Machine Status

• Estimated Time of Arrival

• Assigned Personnel

• Execution Progress

The Invoice therefore acts as the live
execution tracking interface for the job.

Every Invoice references the generated
Job ID.


==========================================================
15. EXECUTION TRACKING
==========================================================

Execution is divided into three phases.

Phase 1

↓

Phase 2

↓

Phase 3

The Invoice tracks completion of every
phase in real time.

Whenever execution progresses,

• Phase Status

• Percentage Completion

• Current Machine Status

• Current Machine Location

• ETA

are updated immediately.

Execution progress is therefore visible
continuously throughout the lifecycle
of the Job.



==========================================================
19. IDENTIFICATION OF AN ENQUIRY
==========================================================

Customer Request ID remains the primary identifier.

As workflow progresses, every generated module ID belonging
to that Customer Request participates in identifying the
workflow instance.

Example

Customer Request ID

↓

Sales Survey ID

↓

OPS Selection ID

↓

Quote ID

↓

Approval ID

↓

Job ID

The enquiry should always know the current workflow state.

==========================================================
LIVE WORKFLOW PRINCIPLE
==========================================================

Every enquiry represents the current state
of an active workflow.

Whenever a module is completed,

• The module data is saved.

• The workflow status is updated.

• The enquiry is updated.

• Dashboard information is refreshed.

• Every authorised user viewing that
  enquiry immediately gains visibility
  of the latest available information.

This principle applies from the initial
Customer Request through final Job
Completion.

The dashboard is therefore the primary
workflow monitoring interface of
RAAS-DOS.

It should provide complete, organised,
informative and visually appealing
representation of every enquiry,
allowing users to understand the current
state of a workflow without opening
previous modules.

----------------------------------------------------------

Dashboard Evolution

As a workflow progresses, the Dashboard
contains more than enquiries.

Depending upon the user's role and the
current workflow stage, the Dashboard
may display

• Received Enquiries

• Sent Enquiries

• Live Jobs

• Live Invoices

• Commercial Tracking

• Execution Progress

• Notifications

The Dashboard therefore becomes the
primary operational interface of
RAAS-DOS.

Its purpose is to provide every user,
irrespective of role, with complete,
well-organised, informative and visually
appealing visibility of every workflow
they are authorised to access.

Selecting either a Sent Enquiry or a
Received Enquiry should immediately
display every piece of information
currently available for that workflow
instance.

==========================================================
20. DEVELOPMENT RULES
==========================================================

Before every implementation:

1. Knowledge Test

2. Progress Tracker

3. Required files identified

4. No assumptions

5. Verify imports

6. Verify function usage

7. Preserve architecture layers

Repository

↓

Service

↓

API

↓

Frontend

8. Verify backend

9. Verify frontend

10. Continue only after successful verification.

11. Verify workflow transition

Every implementation must verify:

Module

↓

Enquiry Creation

↓

Dashboard Reception

↓

Module Navigation

↓

Next Enquiry Creation


==========================================================
21. IMPLEMENTATION BASELINE
==========================================================

Purpose

This section maps the current implementation of RAAS-DOS
against the target architecture.

It serves as the engineering baseline for future
development.

Whenever a feature is completed, refactored or redesigned,
this table must be updated.

No implementation should begin without first comparing
the current implementation against this baseline.


CURRENT DEVELOPMENT PRIORITY

The immediate objective is to complete a
fully functional role-based workflow from

Customer Request

↓

Sales Survey

↓

OPS Approval

↓

OPS Selection

↓

Quote

All refactoring efforts should prioritise
this workflow before implementing later
execution-stage modules.

----------------------------------------------------------

| Module / Component | Current Implementation | Target Architecture | Status |
|--------------------|------------------------|---------------------|--------|
| Authentication | Not Implemented | Role Based Login | Pending |      (15/07/26 - )
| Dashboard | Single Dashboard | Role Based Dashboard | Redesign Required |
| Customer Request | Implemented | Starts Enquiry Workflow | Partial |
| Sales Survey | CRUD Module | Sales Workflow Module | Refactoring |
| OPS Approval | Basic | OPS Approval Workflow | Partial |
| OPS Selection | Implemented | OPS Decision Workflow | Partial |
| Quote | Implemented | Sales Quote Workflow | Partial |
| Approval Board | Implemented | Management Workflow | Partial |
| Job Creation | Implemented | Generates Job ID | Partial |
| Allocation | Implemented | Uses Job ID | Pending Refactor |
| Execution Tracking | Not Implemented | Live Job Tracking | Pending |
| Invoice | Not Implemented | Live Execution Object | Pending |
| Enquiry System | Not Implemented | Workflow Communication Layer | Pending |

----------------------------------------------------------

Development Rule

Every implementation phase must update this table.

The table should always represent the actual state of the
project.


==========================================================
ACTIVE IMPLEMENTATION PHASE
==========================================================

Current Objective

Role Based Workflow Refactor

Current Phase

Architecture Planning

Current Module

None

Completed

✓ Architecture

✓ Workflow Design



Pending

□ Dashboard Behaviour

Dashboard Enhancement (Frontend v1)

Every dashboard shall display:

1. Statistics
   • Pending Received Enquiries
   • Completed Received Enquiries
   • Pending Sent Enquiries
   • Completed Sent Enquiries
   • Active Workflows
   • Live Jobs (future)

2. Received Enquiries
   • Display as dropdown list.
   • Count displayed in statistics.
   • Selecting an enquiry expands complete workflow summary.

3. Sent Enquiries
   • Display as dropdown list.
   • Count displayed in statistics.
   • Selecting an enquiry displays latest progress.

4. Common Enquiry Summary

Every enquiry regardless of role shall display:

Customer Request

Current Stage

Requested Task

Sender Role

Receiver Role

Current Workflow Status

Revision Number

Created Date

Last Updated

Completion Status

Next Department

Module References

Customer Request ID

Sales Survey ID

OPS Approval ID

OPS Selection ID

Quote ID

Approval ID

Job ID

Navigation

Open Assigned Module

View Workflow Timeline

View Related Modules (Read Only)

The dashboard becomes the single workflow monitoring interface.

□ Authentication

□ Enquiry System

□ Dashboard Refactor

□ Sales Survey Refactor

□ Role Permissions

□ Invoice System

□ Execution Tracking
==========================================================
21. CURRENT IMPLEMENTATION STATUS
==========================================================

Sales Survey Refactor

Status

Paused

Reason

Overall system architecture redesign.

Future implementation must align with the role-based enquiry
workflow described in this document.

==========================================================
22. FRONTEND INTEGRATION PLAN
==========================================================

Purpose

This section records the order in which frontend modules are
connected to backend APIs.

The objective is to complete one continuous workflow before
building supporting interfaces such as Dashboard, Analytics,
Customer Portal and Invoice.

----------------------------------------------------------

Current Frontend Goal

Complete the entire React workflow up to Job Creation.

Modules outside this workflow shall remain frozen until the
pipeline has been verified.

Current integration order

✓ Authentication

↓

✓ Customer Request

↓

✓ Sales Survey

↓

✓ OPS Approval

↓

✓ OPS Selection

↓

✓ Techno Commercial Quote

↓

✓ Customer Quote Review

↓

✓ Management Approval

↓

✓ Job Creation


Job Creation frontend responsibilities

1. Load approved quotations.

2. Display generated job preview.

3. Allow quote selection.

4. Create Job.

5. Backend automatically

   • completes Job Creation enquiry

   • updates customer status

   • creates Allocation enquiry

Frontend does NOT manually create enquiries.

Frontend only triggers backend APIs.

Backend owns workflow generation.

----------------------------------------------------------

Deferred Modules

The following modules will NOT be redesigned until the above
pipeline is completely operational.

□ Allocation

□ Execution

□ Invoice

□ Customer Portal

□ Analytics

□ Dashboard

----------------------------------------------------------

Frontend Integration Rules

Every module must satisfy ALL of the following before moving
to the next module.

1.

React page loads backend data.

2.

User edits data.

3.

Save API succeeds.

4.

Workflow status updated.

5.

Customer Request status updated.

6.

Current enquiry marked completed.

7.

Next enquiry generated.

8.

Receiving role can immediately access the enquiry.

9.

Console logs verify the complete request lifecycle.

10.

No mock data remains.

----------------------------------------------------------

Debug Rule

Every frontend module must contain temporary debugging logs.

console.log()

Backend services must contain

print()

statements for

• API received

• Service entered

• Repository updated

• Status changed

• Enquiry created

These logs remain until the complete workflow has been verified.

----------------------------------------------------------

Current Development Focus

The project priority is NOT UI redesign.

The priority is establishing a verified end-to-end workflow
between React and FastAPI.

Only after Job Creation has been fully integrated shall work
begin on

• Allocation

• Execution

• Dashboard

• Customer Portal

• Analytics

• Invoice

----------------------------------------------------------

Completion Criteria

Frontend integration up to Job Creation is considered complete
only when every module satisfies:

✓ API Connected

✓ Save Working

✓ Status Updated

✓ Enquiry Updated

✓ Next Module Receives Enquiry

✓ Backend Verification Complete

✓ React Verification Complete

Only then will development proceed to Allocation.


==========================================================
23. DEVELOPMENT LOG
==========================================================

Purpose

This section records every completed implementation phase.

Each entry must contain:

• Date
• Time Taken
• Objective
• Files Modified
• Verification Completed
• Result
• Notes

This section acts as the engineering history of the project and
allows future developers to understand exactly what changed,
when it changed, and why it changed.

----------------------------------------------------------
PHASE 001
----------------------------------------------------------

Date
15-07-2026

Duration
5 hrs 40 mins

Objective
Implement role-based authentication and redesign shared UI.

Files Modified

Backend
✓ authService.py
✓ auth.py
✓ user_repository.py
✓ user_service.py

Frontend
✓ AuthContext.jsx
✓ Login.jsx
✓ Sidebar.jsx
✓ Topbar.jsx
✓ navigation.js
✓ MainLayout.jsx
✓ layout.css

Verification

✓ Customer Login
✓ Sales Login
✓ OPS Login
✓ Management Login
✓ Admin Login
✓ Invalid Credentials
✓ Logout
✓ Protected Routes
✓ Sidebar Permissions

Result

COMPLETE

Remarks

Unified layout established.
Common CSS introduced.
Role-based navigation operational.
Authentication integrated with backend.




==========================================================
END OF DOCUMENT
==========================================================