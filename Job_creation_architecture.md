====================================================================================================================
RAAS-DOS INVOICE PIPELINE MASTER IMPLEMENTATION SPECIFICATION
Version 1.0
Status: Master Design Document
Purpose: Permanent implementation reference for future development.
====================================================================================================================

OVERVIEW

The existing Enquiry Pipeline is complete up until Management Approval and Job Creation.

From Job Creation onwards the system transitions into an entirely different workflow called the Invoice Pipeline.

The Invoice Pipeline is responsible for the real execution of work.

Unlike a traditional invoice, the invoice in RAAS-DOS is NOT simply a financial document.

The invoice is the central execution record that continuously stores and distributes real-time execution information throughout the lifecycle of a job.

Every module after Job Creation reads from and writes to the Invoice.

The Invoice therefore becomes the Single Source of Truth for execution.


====================================================================================================================
PIPELINE SEPARATION
====================================================================================================================

ENQUIRY PIPELINE

Customer Request
        ↓
Sales Survey
        ↓
Ops Approval
        ↓
Ops Selection
        ↓
Techno Commercial Quote
        ↓
Customer Review
        ↓
Management Approval
        ↓
Job Creation

The enquiry pipeline officially ends here.


INVOICE PIPELINE

Job Creation
        ↓
Invoice Creation
        ↓
Allocation
        ↓
Execution
        ↓
Completion
        ↓
Financial Invoice

Everything after Job Creation belongs to the Invoice Pipeline.


====================================================================================================================
JOB ID
====================================================================================================================

The Job ID becomes the permanent identifier of the execution workflow.

Unlike Customer Request IDs or Quote IDs, the Job ID never changes.

Example

Customer Request
        ↓

Quote
        ↓

Job ID

↓

Invoice

↓

Execution

Every execution module references the Job ID.

The Invoice is permanently attached to the Job ID.


====================================================================================================================
INVOICE PHILOSOPHY
====================================================================================================================

The Invoice is NOT simply an accounting document.

The Invoice stores every execution detail.

Examples include

• Execution progress
• Machine allocation
• Personnel allocation
• Transportation
• GPS tracking
• Distance
• ETA
• Delays
• Execution logs
• Final billing information

Every execution module updates the Invoice.

Every user reads the Invoice differently depending upon their role.

The Invoice therefore functions as the Execution Database.


====================================================================================================================
MODULE RESPONSIBILITIES
====================================================================================================================

1. JOB CREATION

Creates

• Job ID
• Invoice
• Initial execution record

No execution information exists before Job Creation.


------------------------------------------------------------

2. ALLOCATION

Updates Invoice with

• Assigned Machine
• Assigned Personnel
• Planned Start Date
• Planned Completion Date
• Site Location
• Estimated Travel Time
• Estimated Arrival Time
• Allocation Status


------------------------------------------------------------

3. EXECUTION

Continuously updates

• Current Phase
• Progress %
• Machine Status
• Personnel Status
• GPS Coordinates
• Distance Remaining
• ETA
• Delay Information
• Completion Status


------------------------------------------------------------

4. CUSTOMER PORTAL

Customer never edits Invoice.

Customer only reads

• Job Progress
• ETA
• Machine Location
• Personnel Contact
• Current Execution Phase
• Expected Completion
• Notifications


------------------------------------------------------------

5. SALES DASHBOARD

Sales views Invoice financially.

IMPORTANT

Quote Amount

=

Potential Revenue

Invoice Amount

=

Guaranteed Revenue

Sales Dashboard should display

• Quoted Revenue
• Confirmed Revenue
• Revenue Difference
• Guaranteed Revenue
• Revenue Pending
• Revenue Statistics


------------------------------------------------------------

6. OPERATIONS DASHBOARD

Operations reads

• Machine Status
• Personnel Status
• Allocation
• Execution Progress
• Transportation
• Distance Remaining
• ETA
• Current Delays


------------------------------------------------------------

7. FUTURE PERSONNEL PORTAL

Allocated personnel can login.

They view

• Assigned Job
• Assigned Machine
• Team Members
• Site
• Current Progress
• Remaining Tasks

Personnel only updates execution.

They do not edit invoice financial information.


====================================================================================================================
CAB BOOKING MODEL
====================================================================================================================

Invoice functionality should closely resemble Uber/Ola.

Replace

Vehicle

↓

Machine

Driver

↓

Personnel

Trip

↓

Job

Pickup

↓

Machine Leaving Previous Site

Destination

↓

Customer Site

ETA

↓

Machine Arrival Time

GPS Tracking

↓

Machine GPS Tracking

This becomes the reference behaviour for transportation.


====================================================================================================================
EXECUTION PHASES
====================================================================================================================

PHASE 1

Mobilization

Invoice tracks

• Machine dispatched
• Personnel dispatched
• Distance
• ETA
• Arrival

Customer sees

Machine is on the way.


------------------------------------------------------------

PHASE 2

Execution

Invoice tracks

• Current activity
• Progress %
• Logs
• Images
• Videos
• Delays

Customer sees live execution progress.


------------------------------------------------------------

PHASE 3

Completion

Invoice tracks

• Testing
• Verification
• Customer Acceptance
• Completion
• Invoice Locked


====================================================================================================================
ALLOCATION MODULE
====================================================================================================================

Allocation contains two separate tabs.

TAB 1

Machine Inventory

TAB 2

Personnel Inventory


====================================================================================================================
MACHINE INVENTORY
====================================================================================================================

Initially static data.

Each machine contains

Machine Type

Machine Code

Current Job

Current Site

Current Start Date

Current Completion Date

Availability

Status


Example

Diesel Aqua Machine

AQ-001

JOB-105

Hyderabad

15 Jul

25 Jul


====================================================================================================================
VERY IMPORTANT MACHINE SCHEDULING RULE
====================================================================================================================

Machine scheduling MUST NEVER overwrite the current allocation immediately.

Instead, every new allocation becomes a Queue Entry.

Example

Current Machine

AQ-001

Current Job

JOB-105

Site

Hyderabad

Start

15 Jul

Completion

25 Jul

------------------------------------------------------------

User now allocates

JOB-106

Site

Chennai

Start

26 Jul

Completion

31 Jul

------------------------------------------------------------

The system MUST NOT replace

Current Job

Current Site

Current Dates

Instead the system creates

Machine Queue

Queue Position 1

Machine

AQ-001

Upcoming Job

JOB-106

Future Start

26 Jul

Future Completion

31 Jul

Future Site

Chennai

Machine continues executing JOB-105.

Current execution information remains untouched.


====================================================================================================================
AUTOMATIC QUEUE PROMOTION
====================================================================================================================

Queue promotion happens ONLY after

Invoice Status

changes to

COMPLETED

When execution completes

the scheduler automatically

1.

Marks previous job completed

↓

2.

Removes first queue entry

↓

3.

Copies queued allocation into Current Allocation

↓

4.

Updates Machine Site

↓

5.

Updates Current Start Date

↓

6.

Updates Current Completion Date

↓

7.

Invoice immediately begins transportation tracking

No manual intervention required.

This prevents live execution information from ever being overwritten.


====================================================================================================================
TRANSPORTATION TRACKING
====================================================================================================================

After queue promotion

Invoice immediately begins tracking

Current Machine Location

↓

Destination Site

↓

Distance Remaining

↓

Estimated Travel Time

↓

Estimated Arrival Time

Customer and Operations both see

Machine Traveling

Distance Remaining

ETA

Live Status


====================================================================================================================
PERSONNEL INVENTORY
====================================================================================================================

Each row contains

Personnel Name

Skillset

Execution Role

Current Job

Availability

Verification Documents

Contact Number


Execution Roles

Operator

Supervisor

Electrician

Mechanic

Safety Officer

Technician

IMPORTANT

Execution Roles are NOT Login Roles.

Login Roles

Sales

Operations

Manager

Customer

Execution Roles exist only during job execution.


====================================================================================================================
PERSONNEL ALLOCATION
====================================================================================================================

Allocation assigns

Personnel

↓

Execution Role

↓

Machine

↓

Job

↓

Dates

Invoice stores

Assigned Personnel

Execution Role

Contact

Arrival Status

Attendance

Current Status

Skills


====================================================================================================================
INVOICE DATA MODEL
====================================================================================================================

IDENTITY

Invoice ID

Job ID

Customer Request ID

Quote ID

Customer

Sales Survey

Ops Selection


------------------------------------------------------------

SCHEDULE

Planned Start

Planned Completion

Actual Start

Actual Completion

Delay

Delay Reason


------------------------------------------------------------

MACHINE

Machine

Machine Code

Current Site

Destination

GPS

Speed

Distance Remaining

ETA


------------------------------------------------------------

PERSONNEL

Personnel

Execution Roles

Skills

Contacts

Attendance

Status


------------------------------------------------------------

EXECUTION

Current Phase

Current Task

Progress %

Execution Logs

Images

Videos

Notifications


------------------------------------------------------------

FINANCE

Quoted Amount

Invoice Amount

Payments

Pending Amount

Guaranteed Revenue


====================================================================================================================
USER SPECIFIC INVOICE VIEW
====================================================================================================================

CUSTOMER

Reads

• Progress
• ETA
• Machine Location
• Personnel Contact
• Notifications
• Expected Completion


------------------------------------------------------------

SALES

Reads

• Invoice Value
• Confirmed Revenue
• Difference from Quote
• Sales Statistics


------------------------------------------------------------

OPERATIONS

Reads

• Machine Tracking
• Personnel Tracking
• Allocation
• Progress
• Transportation
• Delays


------------------------------------------------------------

MANAGER

Reads

• Overall Execution
• Financial Summary
• Completion Status


------------------------------------------------------------

PERSONNEL

Reads

• Assigned Job
• Assigned Machine
• Site
• Current Stage
• Remaining Work


====================================================================================================================
STATIC DATASET REQUIREMENT
====================================================================================================================

Initial implementation will use static datasets.

Examples

Static Machine Inventory

Static Personnel Inventory

Static GPS Coordinates

Static Travel Time

Static Site Locations

Static Inventory

Static Status Updates


====================================================================================================================
DYNAMIC DATA REQUIREMENT
====================================================================================================================

The architecture MUST be designed from the beginning to support real-time data.

Static datasets are only placeholders.

Every module must be written so static data can later be replaced without redesign.

Future dynamic sources include

• Database Machine Inventory
• Database Personnel Inventory
• GPS Devices
• Google Maps / Distance APIs
• Personnel Mobile Updates
• Execution Logs
• Accounting Integration
• Payment Status
• Customer Notifications


====================================================================================================================
IMPLEMENTATION RULES
====================================================================================================================

1. Never modify or break the existing Enquiry Pipeline.

2. Invoice Pipeline begins ONLY after Job Creation.

3. Job ID is the permanent execution identifier.

4. Invoice is the Single Source of Truth after Job Creation.

5. Every execution module must read/write Invoice instead of maintaining duplicate execution state.

6. Machine scheduling must ALWAYS be queue-based.

7. Machine allocations MUST NEVER overwrite active jobs.

8. Queue promotion happens automatically ONLY after execution status becomes COMPLETED.

9. Transportation tracking begins automatically after queue promotion.

10. Customer and Operations always receive live information directly from Invoice.

11. Sales Dashboard always differentiates Quote Revenue (Potential) from Invoice Revenue (Guaranteed).

12. Static datasets are temporary. All architecture must support future real-time dynamic data without redesign.


====================================================================================================================
RAAS-DOS DASHBOARD EVOLUTION SPECIFICATION
Version 1.0
Status: Future Implementation
Purpose: Dashboard redesign after completion of the Invoice Pipeline.
====================================================================================================================

OVERVIEW

The current dashboards are designed around the Enquiry Pipeline.

Once the Invoice Pipeline is completed, the dashboard becomes the primary workspace
for every role.

Instead of continuously creating new standalone pages, execution information should
be exposed through Dashboard Tabs.

The dashboard becomes a role-specific control center while dedicated modules
(Job Creation, Allocation, Execution, etc.) remain detailed workspaces.

The dashboard therefore becomes the primary navigation interface for all users.


====================================================================================================================
DESIGN PHILOSOPHY
====================================================================================================================

Dedicated Modules

Customer Request
Sales Survey
Ops Approval
Ops Selection
Quote
Approval
Job Creation
Allocation
Execution

↓

perform work

↓

Dashboard

↓

summarizes work

↓

reads Invoice

↓

provides navigation


The dashboard should never duplicate module functionality.

Instead it displays summarized information and allows navigation into the detailed
module when required.


====================================================================================================================
COMMON DASHBOARD STRUCTURE
====================================================================================================================

Every dashboard should use tabs.

Example

-------------------------------------------------------

Overview

Enquiries

Invoice

Analytics

-------------------------------------------------------

Each role then receives additional tabs depending upon their responsibilities.


====================================================================================================================
CUSTOMER DASHBOARD
====================================================================================================================

Tabs

1.

Overview

Displays

• Customer Request Summary
• Active Jobs
• Notifications

-------------------------------------------------------

2.

Requests

Displays

• Previous Requests
• Current Request Status
• Request History

-------------------------------------------------------

3.

Live Job

Displays

• Current Active Job
• Progress
• Phase
• ETA
• Machine Status

-------------------------------------------------------

4.

Invoice

Read-only Invoice

Displays

• Job ID
• Execution Progress
• Planned Completion
• Delay Information
• Machine Location
• Personnel Contact
• Notifications

-------------------------------------------------------

5.

Analytics

Displays

• Completed Jobs
• Response Time
• Project History


====================================================================================================================
SALES DASHBOARD
====================================================================================================================

Tabs

1.

Overview

Displays

• Pending Quotes
• Active Customers
• Revenue Summary

-------------------------------------------------------

2.

Quotes

Displays

• Generated Quotes
• Customer Reviews
• Pending Approvals

-------------------------------------------------------

3.

Sales Statistics

Invoice Data

Displays

Quoted Revenue

Potential Revenue

Invoice Revenue

Guaranteed Revenue

Difference

Revenue Pending

Revenue Confirmed

Revenue Trend

-------------------------------------------------------

4.

Invoices

Displays

Job ID

Invoice Value

Customer

Execution Status

Completion

-------------------------------------------------------

5.

Analytics

Displays

Sales KPIs

Conversion

Revenue Growth

Forecast


====================================================================================================================
OPERATIONS DASHBOARD
====================================================================================================================

Tabs

1.

Overview

Displays

• Pending Enquiries
• Active Jobs
• Delays

-------------------------------------------------------

2.

Machine Inventory

Displays

Machine Type

Machine Code

Current Job

Current Site

Availability

Queue Position

Current Status

-------------------------------------------------------

3.

Personnel Inventory

Displays

Personnel

Execution Role

Availability

Verification

Current Job

-------------------------------------------------------

4.

Invoices

Displays

Live Invoice Information

Machine

Personnel

Transportation

Distance

ETA

Current Activity

-------------------------------------------------------

5.

Execution

Summary Only

Displays

Current Phase

Progress

Active Tasks

Alerts

Button

Open Execution Module

-------------------------------------------------------

6.

Analytics

Displays

Machine Utilization

Personnel Utilization

Execution Performance

Delay Statistics


====================================================================================================================
MANAGEMENT DASHBOARD
====================================================================================================================

Tabs

1.

Overview

Displays

Overall Business Summary

-------------------------------------------------------

2.

Approvals

Displays

Pending Management Approvals

-------------------------------------------------------

3.

Invoices

Displays

Execution Summary

Job Status

Completion

Delays

-------------------------------------------------------

4.

Financial Summary

Displays

Quoted Revenue

Guaranteed Revenue

Completed Revenue

Pending Revenue

-------------------------------------------------------

5.

Execution Summary

Displays

Execution KPIs

Active Jobs

Delayed Jobs

Completed Jobs

-------------------------------------------------------

6.

Analytics

Displays

Overall Business Analytics


====================================================================================================================
ADMIN DASHBOARD
====================================================================================================================

Tabs

Overview

Users

Invoices

Execution

Inventory

Analytics

System Health


====================================================================================================================
INVOICE TAB
====================================================================================================================

The Invoice should not remain a standalone module after the Invoice Pipeline is complete.

Instead, every dashboard should expose an Invoice tab.

The Invoice tab becomes a role-specific read-only view of the central Invoice.

Customer

↓

Progress
ETA
Machine
Notifications

-------------------------------------------------------

Sales

↓

Invoice Value
Guaranteed Revenue
Revenue Difference

-------------------------------------------------------

Operations

↓

Machine
Personnel
Transportation
GPS
ETA
Execution Progress

-------------------------------------------------------

Management

↓

Overall Execution
Financial Summary
Completion

-------------------------------------------------------

Admin

↓

Complete Invoice


====================================================================================================================
EXECUTION MODULE
====================================================================================================================

Execution should remain a dedicated page.

It is NOT replaced by dashboard tabs.

Dashboard

↓

summary

↓

Execution Module

↓

detailed operational workspace

Execution contains

• Phase Control
• Progress Updates
• GPS Tracking
• Images
• Videos
• Logs
• Delay Management
• Personnel Attendance
• Customer Notifications

Dashboard only summarizes these values.


====================================================================================================================
DESIGN RULES
====================================================================================================================

1.

Dashboards summarize information.

They do not replace modules.

-------------------------------------------------------

2.

Dedicated modules perform editing.

Dashboards are primarily read-only.

-------------------------------------------------------

3.

Every Invoice view must read directly from the Invoice.

No duplicate execution state should exist elsewhere.

-------------------------------------------------------

4.

Each dashboard displays Invoice information according to the user's role.

-------------------------------------------------------

5.

Execution remains the operational control center.

Dashboard remains the operational overview.

-------------------------------------------------------

6.

Future functionality should be added as Dashboard Tabs whenever possible
instead of creating unnecessary standalone pages.

This keeps the system centralized, scalable, and easier to navigate.

====================================================================================================================
END OF DASHBOARD EVOLUTION SPECIFICATION
====================================================================================================================




====================================================================================================================
END OF MASTER SPECIFICATION
====================================================================================================================