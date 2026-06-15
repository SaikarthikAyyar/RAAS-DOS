# 20_System_Execution_Flow

# Overview

This document explains how React, Python (FastAPI) and PostgreSQL communicate from start to finish.

---

# Master Architecture

USER

↓

REACT (Collect Input)

↓

FASTAPI Router

↓

Python Validation

↓

Python Business Logic

↓

PostgreSQL Storage

↓

Python Aggregation

↓

JSON Response

↓

REACT Dashboard

↓

USER

---

# Step 1: User Authentication

React Components

App.jsx

Login.jsx

Dashboard.jsx

Flow

User → React → POST /login → FastAPI → PostgreSQL → React Dashboard

---

# Step 2: Customer Request

React

Collect:

Company

Site

Requirement

Volume

Photos

Send:

POST /request

Python:

Validate

Store

Generate request_id

SQL:

INSERT INTO customer_requests

---

# Step 3: Sales Survey

React:

Collect survey information

Python:

Normalize data

Store survey

SQL:

INSERT INTO site_surveys

---

# Step 4: Operations Selector

Python Rules

Volume → Machine

Height → Pump

Material → Accessories

SQL:

INSERT INTO ops_selection

---

# Step 5: Dewatering Engine

Python Rules

Free Water

Settling Ability

Density

Polymer

Decision

Commit

Conditional

Do Not Commit

SQL:

INSERT INTO dewatering_gate

---

# Step 6: Quote Engine

Python

Calculate:

Machine Cost

Pump Cost

Labor Cost

GST

Total

SQL:

INSERT INTO quotes

---

# Step 7: Approval Engine

Approve

Reject

Request Changes

SQL:

INSERT INTO approvals

---

# Step 8: Job Creation

SQL:

INSERT INTO jobs

Generate job_id

---

# Step 9: Resource Allocation

Assign:

Machine

Supervisor

Operators

Safety Officer

SQL:

INSERT INTO allocations

---

# Step 10: Execution Monitoring

Daily Output

Issues

Downtime

Media

Tomorrow Plan

SQL:

INSERT INTO daily_logs

---

# Step 11: Customer Portal

Python aggregates

Jobs

Allocations

Logs

Reports

Return Completion % and ETA

---

# Step 12: Analytics Dashboard

Python executes aggregate SQL queries

Revenue

Open Jobs

Completion

Performance

Return JSON to React

---

# Recommended GitHub Location

docs/

20_System_Execution_Flow.md
