# RAAS-DOS User Guide

## The Enquiry Workflow and Its Supportive Modules

This guide explains how a case moves through RAAS-DOS from the moment it is first raised to the moment the job is completed, and how the rest of the application supports that journey. It is written from two angles, matching the in-app guide built into the Enquiry Workspace itself:

- **Component explainer** — what a specific card, table, or button on screen actually does, and what it depends on.
- **Workflow explainer** — the order in which to use those same components to move a real case forward.

Everything below traces back to a real button, a real backend action, or a real gating condition in the running application — nothing here is aspirational or planned-but-not-built.

---

## 1. The Enquiry Workflow at a Glance

Every enquiry moves through a fixed sequence of ten stages. The stage an enquiry is currently at is shown as a badge and a stepper at the top of its workspace, and it only ever advances through an explicit action — nothing moves a case forward silently.

| # | Stage (internal name) | Displayed as | What happens here |
|---|---|---|---|
| 1 | `CUSTOMER_REQUEST` | Enquiry | The case is created, either from a fresh Customer Request or by picking an existing site/asset already on file. |
| 2 | `SALES_SURVEY` | Survey | A site survey is filled in, recording the real, on-the-ground details of the job. |
| 3 | `OPS_REVIEW` | Ops Review | The system recommends a machine and deployment plan; a hub approver reviews and approves it, generating a commercial quote in the process. |
| 4 | `QUOTE_COMMERCIAL_REVIEW` | Quote & Commercial | The generated quote is reviewed commercially and approved by a second hub approver. |
| 5 | `COMMERCIAL_APPROVAL` | Commercial Approval | A final commercial sign-off, which — once accepted — generates the real quote release document sent to the customer. |
| 6 | `QUOTE_RELEASED` | Quote Released | The quote has been released; the case is waiting on the customer's Purchase Order. |
| 7 | `PO_RECEIVED` | PO Received | The customer's PO has been uploaded and is on file. |
| 8 | `JOB_CREATION` | Job Created | A real Fleet Unit (a machine bundled with its crew) has been booked to the job. |
| 9 | `EXECUTION` | Execution | The job is physically underway — mobilisation, on-site work, and demobilisation. |
| 10 | `COMPLETED` | Closed | The job is finished; the machine and crew have been released back to their next job or to Available. |

Three of these transitions are **real approval gates**, each tied to a specific hub and a specific set of approvers assigned in Business Masters → Hubs:

- **Ops Review** — approved by that hub's Ops Review approvers.
- **Quote & Commercial** — approved by that hub's Quote & Commercial approvers.
- **Commercial Approval** — approved by that hub's Commercial Approval approvers.

A user only sees an Approve/Send Back button become clickable once two things are both true: the case genuinely sits at that gate's stage, and the logged-in user personally holds approval standing for that gate at that enquiry's hub. Anyone — standing or not — can send a lightweight **Request Approval** ping to nudge the right approvers, which never itself approves anything.

Sending a case back at any of the three gates always returns it all the way to **Ops Review**, not one step back — a rejected commercial figure or plan needs to be re-worked from the recommendation stage, not patched in place.

---

## 2. Touring the Enquiry Workspace

Opening any enquiry lands on its Workspace — a strip of tabs, one per stage of active work. Eight of the nine tabs are fully built (the ninth, the workspace's own **Audit Trail** tab, is a placeholder; use the global Audit Trail module described in Section 3 instead). Every built tab carries a small **Guide me** icon that runs a live, on-screen walkthrough of exactly what follows below — this section is that same content in written form.

### 2.1 Survey

**Purpose:** Establish (or update) what is actually known about the site before anything gets recommended or priced.

**What's on screen:**
- **Asset Profile** — shown only when this enquiry is linked to a previously-known site. Division, plant, department, asset name/type, cleaning frequency, and any material/access notes from Business Masters → Customers. A starting point, not something edited here.
- **Site Profile (Last Survey)** — shown once a survey has actually been submitted for this site before; carries forward automatically the next time the same site is surveyed.
- **Survey Details** — read-only cards (Customer, Job, Sludge, Geometry, Access & Setup, Safety, Pump, Dewatering, Customer Insights) mirroring exactly what was submitted on the actual Sales Survey form, or the prefilled defaults if no survey exists yet.
- **Fill / Edit Survey** — opens the real survey form, prefilled from the Customer Request and any existing survey answers. This is the *only* place any of the above data actually changes.
- **Survey Reminder** — a personal countdown you can set for yourself while the case sits at this stage; fires a notification once it elapses. It is relative to when it was set, not to how long the case has already been idle, and it is automatically cancelled the moment the case leaves this stage.
- **Request Ops Review** — advances the case to Ops Review. Disabled until every compulsory field in Survey Sections A, B and C is filled in. If nobody has opened the Ops Selector for this case yet, clicking this also runs the recommendation algorithm automatically, so that never has to be a separate step.

**Step by step:**
1. Review what's already known (Asset Profile / Survey Details) — this is read-only context.
2. Click **Fill Survey** (or **Edit Survey**) and record the real site details.
3. Optionally, set a **Survey Reminder** if the survey can't be completed right away.
4. Once every compulsory field is filled, click **Request Ops Review**.

### 2.2 Ops Review

**Purpose:** Turn the survey into a real machine recommendation, a deployment plan, and a priced quote — then approve it.

**What's on screen:**
- **Algorithm Recommendation & Machine Scoring** — every active machine from Machines/Fleet is scored against this survey (job type, material, volume, access, environment, debris, hub availability) and the best fit is recommended, alongside a suggested pump/hose package from Pump Master. The full scoring table is shown, not just the winner.
- **Open Ops Selector** — re-runs the algorithm from scratch against the same enquiry, in place (never creates a second Ops Selection). Use this if the underlying survey answers changed since the first run.
- **Machine Override** — picks a different machine than the algorithm's recommendation, with a required reason. Once saved, the override is used everywhere downstream instead of the algorithm's own pick.
- **Deployment Plan** — the day-by-day plan: mobilisation/setup/execution/demobilisation days, crew roles and headcounts (with **+ Add Role** / **×** to adjust them), required accessories, and — where relevant — which dewatering method to price.
- **Save Deployment Plan & Generate Quote** — saves the plan and immediately generates a fresh commercial quote from it. Only enabled once something has genuinely changed (final machine, plan fields, or dewatering selection) versus the currently saved quote.
- **Request Approval** — a "please look at this" ping to this hub's real Ops Review approvers; anyone can send it.
- **Approve & Send / Send Back** — the real decision. Approve requires a quote to already exist and moves the case to Quote & Commercial; Send Back returns it to Survey. Both require the case to genuinely be at this stage and the acting user to hold Ops Review standing for this hub.

**Step by step:**
1. Review the algorithm's recommendation and scoring.
2. If it needs a fresh look, **Open Ops Selector**; if it needs a manual override, use **Machine Override** instead.
3. Fill in or adjust the **Deployment Plan** for whichever machine is actually being used.
4. Click **Save Deployment Plan & Generate Quote**.
5. Optionally, **Request Approval** from the relevant hub approvers.
6. Once a quote exists and you hold standing, **Approve & Send** or **Send Back**.

### 2.3 Techno-Commercial Review

**Purpose:** A pure review screen — nothing to act on here.

**What's on screen:**
- **Full Bifurcation (Min-Max Range)** — a read-only, line-by-line breakdown of the quote (mobilisation, setup/access, execution, pump add-on, documentation and access-support buffers, dewatering add-on, overhead, contingency, margin), shown as the min/max range the quote was generated with. It is a snapshot of whatever Ops Review's Deployment Plan last produced.

**Step by step:** Use this tab to check the numbers before the case reaches the Quote & Commercial gate — the real decision for this quote happens there.

### 2.4 Quote & Commercial

**Purpose:** Turn the generated quote into the exact figures the customer will see, and approve it.

**What's on screen:**
- **Commercial Breakdown & Internal-Only Addition** — the same line items as Techno-Commercial Review, plus an internal-only amount/note that never appears on anything the customer sees.
- **Save Internal Addition** — commits that internal figure; typing alone does nothing until this is clicked.
- **Preview Customer-Facing Quote** — toggles a preview stripped of internal-only figures; changes nothing, just what's shown on screen.
- **Valid Till & Version History** — sets how long the quote stays valid, and shows every earlier version generated for this enquiry.
- **Save (Valid Till)** — commits the valid-till date.
- **Open Quotes Module** — jumps to the standalone Quotes module, already linked to this enquiry, most commonly used to regenerate a quote after a revision is requested.
- **Request Revision** — flags the quote as needing a new version; blocks Approve until Ops Review regenerates it.
- **Request Approval** — a ping to this hub's Quote & Commercial approvers.
- **Approve & Send / Send Back** — Approve moves the case to Commercial Approval; Send Back returns it to Ops Review. Both require the case to be at this stage and the user to hold Quote & Commercial standing for this hub; Approve is additionally blocked while a revision is pending.

**Step by step:**
1. Review the breakdown; add and **Save** an internal-only addition if this quote needs one.
2. Use the customer-facing **Preview** to sanity-check what the customer will actually see.
3. Set and **Save** a **Valid Till** date; check the version history if relevant.
4. If the numbers need rework, **Request Revision** (use **Open Quotes Module** to actually regenerate once Ops Review has updated the plan).
5. Optionally, **Request Approval**.
6. Once you hold standing and no revision is pending, **Approve & Send** or **Send Back**.

### 2.5 Commercial Approval

**Purpose:** The final commercial sign-off before a quote goes out the door.

**What's on screen:**
- **Finalized Quote Lines & Decision History** — the same commercial line items, plus a full history of every decision made at this gate for this enquiry.
- **Request Approval** — a ping to this hub's Commercial Approval approvers.
- **Accept and Generate Quote Release / Reject / Send Back** — Accept requires a note (and, if the final value falls outside the quote's own budgetary range, an explicit confirmation), generates a real quote release document, and moves the case to Quote Released. Reject and Send Back both return the case to Ops Review, each with a required note. All three require Quote & Commercial to have already approved this quote, and require the acting user to hold Commercial Approval standing for this hub.
- **Download Quote Document / Download Quote Release Email** — appear once Accept has generated a real release document. The first gives the actual `.docx`; the second opens a prefilled `.eml` file (using the Quote Release email template, with that same document already attached) to send from your own mail client.

**Step by step:**
1. Review the finalized quote lines and this gate's decision history.
2. Optionally, **Request Approval**.
3. Once you hold standing, **Accept and Generate Quote Release**, or **Reject / Send Back**.
4. After accepting, **Download Quote Document** or the release email and send it to the customer.

### 2.6 PO

**Purpose:** Get the customer's Purchase Order on file.

**What's on screen:**
- **Uploaded Purchase Orders** — shows whichever PO is currently on file. Only one PO can be on file at a time; its Number and Value are always computed by the system from the released quote, never typed by hand.
- **Upload PO** — attaches the customer's PO document. Only available once the quote has actually been released, and only while no PO is currently on file.
- **Remove** — deletes the current PO so a replacement can be uploaded; never moves the case backwards.
- **Proceed to Job Creation** — advances the stage to Job Creation once a real PO is on file. This only moves the stage — it does not itself open Job Creation or assign anything.

**Step by step:**
1. Check what PO, if any, is on file.
2. Once the quote is released and the PO is in hand, **Upload PO**.
3. If the wrong file was uploaded, **Remove** it and re-upload the correct one.
4. With a real PO on file, **Proceed to Job Creation**.

### 2.7 Job Created

**Purpose:** Book a real machine and crew to the job.

**What's on screen:**
- **Job Details** — a read-only summary of what Ops Review recommended (final machine, service configuration, pump/hose package), copied at the moment the job is created.
- **Planned Dates** — the job's estimated start/completion dates, defaulting to today plus Ops Review's own day estimate; adjustable at any time, including after a Fleet Unit is already booked.
- **Book a Fleet Unit** — assigns a real Fleet Unit (a specific machine bundled with its crew) to the job in one action. If the unit already has bookings ahead of it, this job queues behind them; the form states which will happen before booking. The site location entered here also sets the Execution tab's destination coordinates automatically.
- **Fleet Unit Booking** — the currently booked unit, its crew, its site, and its position in that unit's own queue (position 1 = active job; further back = waiting).
- **Confirm Job Creation** — advances the stage to Job Creation. Only available once a real Fleet Unit booking exists.
- **Reschedule / Cancel** — Reschedule adjusts a queued booking's dates without losing its place in the queue; Cancel removes it entirely and closes the gap behind it. Both only apply while the booking is still Queued (not yet the unit's active job).

**Step by step:**
1. Review the recommended job details.
2. Confirm or adjust the **Planned Dates**.
3. Pick a Fleet Unit and site, then **Book** it.
4. Review the resulting **Fleet Unit Booking**.
5. **Confirm Job Creation**.
6. While still queued, **Reschedule** or **Cancel** if needed.

### 2.8 Execution / Job

**Purpose:** Track the job through its three real physical phases.

**What's on screen:**
- **Execution Summary** — a live, read-only overview: current phase, overall progress %, the machine's current activity, transport status, and any delay.
- **Create Execution** — starts the execution record at Phase 1 (Admin only, once the job exists).
- **Phase 1 — Source & Destination** — the two fixed endpoints of the job (source hub, destination site), pre-filled automatically as real coordinates and correctable if the lookup isn't precise. Saving computes the real straight-line distance and draws it on the map; these stay fixed for the whole job, and Phase 3 reuses them for the return leg.
- **Phase 1 — Last Known Position** — where the machine is right now and its speed. Distance Travelled, Distance Remaining, Phase Progress, ETA and Transport Status are all calculated automatically from this — never typed in directly.
- **Phase 2 — Live Execution Reporting** — today's cleaning output. Total Output is the running sum of every "Output Completed Since Last Update" entry, so it can never be accidentally overwritten. Daily Target can only be set once, on the very first save, then stays fixed as a planning figure. The completion target this phase is measured against is the survey's **sludge volume** — the actual amount of material to be removed, not the tank's own total capacity.
- **Phase 3 — Return Route** — a read-only summary reusing Phase 1's exact coordinates, in reverse.
- **Phase 3 — Last Known Position** — the same position-driven mechanism as Phase 1, measured back toward the source.
- **Execution Controls** — **Start Current Phase** begins whichever phase is current (nothing on that phase can be recorded before this). **Complete Current Phase** closes it out, but only once its real target has actually been reached (full distance for Mobilisation/Demobilisation, the target sludge volume for Job Execution) — attempting it early is rejected with a message stating exactly what's still short. Completing the final phase releases the machine and crew to their next queued job, or back to Available, and marks the enquiry Closed. **Update Execution** is a lighter save covering only current activity and remarks. All three are Admin-only for now.

**Step by step:**
1. Once Job Creation is confirmed, **Create Execution** if nothing has started yet.
2. Phase 1: set **Source & Destination** once, then record **Last Known Position** as the machine travels.
3. Phase 2: once mobilisation completes, report cleaning output as it happens.
4. Phase 3: the return route is already fixed; record position the same way until it reads Reached.
5. Use **Start/Complete Current Phase** to move between phases, and **Update Execution** for lighter activity-only saves.

---

## 3. Supportive Modules

These are the modules that don't sit inside a single enquiry's own workspace but are load-bearing for the workflow above — the masters it recommends and prices against, who's allowed to act, and how changes get communicated and audited.

### 3.1 Business Masters

The single source of truth for every recommendation and every price. Editing something here changes what the Enquiry Workflow can do on its very next run — nothing is duplicated or frozen at first use unless explicitly noted.

| Tab | What it governs |
|---|---|
| **Customers** | The 360° record for every customer — contacts, linked enquiries, account ownership, and the assets/sites on file for them. Each asset gets its own detail/edit view and its own sheet in the Excel export; editing an asset's division/plant/department/name here is reflected immediately everywhere else that asset is referenced (Sales Survey's "Existing asset" picker, the Workspace's Asset Profile card). |
| **Machine Specs** | The real machine catalog the Ops Engine scores against — specs, hazard rating, access-opening requirements, output rate, and which pumps it's compatible with. |
| **Machine Inventory** | The physical fleet, grouped by machine type — real, individually tracked units feeding the Fleet Units dropdown. |
| **Pump Master** | The real pump catalog used for automatic pump/hose package selection. |
| **Personnel** | The crew roster, with role, hub, and compliance documents (with expiry highlighting). |
| **Accessories** | Priced, named accessories a job's Deployment Plan can mark as needed — feeds the quote's itemized accessories line. |
| **Human Resources** | Day rates per crew role. |
| **Dewatering Methods** | Per-m³ rates for each dewatering method, used to price the dewatering add-on against the survey's actual sludge volume. |
| **Service Configurations** | Legacy per-service rate groups, superseded by per-machine rates but kept as a fallback. |
| **Commercial Rules** | The flat mobilisation/setup/demobilisation rates, overhead/margin/contingency percentages, and per-customer-category margin overrides every quote is built from. |
| **Hubs** | The four real hubs, each with its own three approver lists (Ops Review, Quote & Commercial, Commercial Approval) — this is what actually grants a specific user approval standing at a specific gate. |
| **Fleet Units** | A machine bundled with its own crew — the real, bookable unit Job Creation assigns to a job, and what Fleet & Availability schedules. |
| **Quote Templates** | The editable document body used to generate a quote release — including the dynamic tank/machine table and commercial table sections. |
| **Email Templates** | Reusable email bodies with named variables, used for the Quote Release email and other system emails. |
| **Lookup Lists** | Every dropdown option in the system — admin-editable, including an "Other" free-text option on select lists. |
| **GST & Tax** | The GST rate and tax treatment applied to quotes. |

### 3.2 Administration

- **Roles & Permissions** — the real, dynamic access-control system. For each role: which nav modules are visible, which Business Masters tabs and Enquiry Workspace tabs are visible, and which individual task buttons within those tabs are allowed. Editing a role here changes what that role can do on its very next login — nothing is hardcoded.
- **Partners** and **Users** — the real user accounts and channel-partner records. New accounts (via Administration or the public Sign Up page) are restricted to `@janyutech.com` addresses and are emailed their credentials automatically.

### 3.3 Notifications & Audit Trail

Every meaningful change in the system creates a notification:

- **Bell icon (topbar)** — shows a badge for unread notifications; clicking one navigates to the Audit Trail, bracketed to that entry's date, and marks that user's unread items read (a per-user state — it never affects anyone else's unread count). Newly-arriving notifications also pop a closable toast, wherever you currently are in the app.
- **Business Masters changes** are always flagged **important**, always carry a required remark explaining why, and are visible to every user *except* the one who made the change.
- **Workflow decisions and saves** (Ops Review through PO) are visible to *every* user, including the actor, so anyone can see their own actions logged too.
- **Approval decisions and Request Approval pings** are targeted only to the specific hub approvers who need to see them, not broadcast.
- **Audit Trail (global module)** — the permanent, filterable log of everything above, plus an Excel export that groups every change into one sheet per enquiry (plus a catch-all sheet for changes with no enquiry, like a Business Masters edit).

### 3.4 Reviews & Approvals

A queue-based view across all three approval gates (Ops Review, Quote & Commercial, Commercial Approval) — every enquiry currently waiting at each gate, with its hub and the real approvers assigned there, each linking straight back into that enquiry's workspace tab.

### 3.5 Fleet & Availability

The scheduling home for every Fleet Unit — a live calendar per unit (colour-coded Queued/Active bookings), click-to-reschedule on the calendar itself, and a real 3-month forecast export matching the business's own planning spreadsheet, including per-unit monthly billed value.

### 3.6 Invoice Dashboard

Two tabs: **Revenue** (per-machine invoice value against Purchase Order value, with a forecast/history chart) and **Deployment** (a real map-based history of where each machine has actually been, segment by segment, alongside its upcoming planned bookings).

### 3.7 Quotes

A flat, cross-enquiry list of every quote generated, with its real stage (not a separate status field) and, once released, a direct link to generate/download its release document — the same generation path Commercial Approval's Accept action uses.

### 3.8 Dashboards

Different by role:
- **Admin** sees a business-wide overview — KPI tiles, pipeline by stage, aging cases, follow-ups due, and a recent-cases table.
- **Sales / Ops / Management / Customer** each get a single-enquiry picker with that enquiry's own summary and workflow tracker — built for working one case at a time rather than a portfolio view.

### 3.9 Customer Portal

A read-only mirror of the Execution tab for customer-facing users — live map, speed/ETA/transport status during Phases 1 and 3, and target/daily-target/today's-output/total-output cards during Phase 2. Nothing on this view is editable; it exists purely so a customer can watch their own job's real progress.

---

## 4. A Note on Roles

Nothing in this guide is guaranteed to be visible to every user. Which nav modules, which Business Masters tabs, and which individual buttons within the Enquiry Workspace a given user sees is entirely controlled by their role's configuration in Administration → Roles & Permissions — the same dynamic system described in Section 3.2. Approval actions have a second, independent layer on top of that: even a role with "Approve" clickable in principle still needs the individual logged-in user to hold real approval standing for that specific hub, assigned in Business Masters → Hubs.
