-- Schema-drift fix, same class of bug as 014_fix_approval_date_type_drift.sql:
-- customer_requests.cleaning_date lives as TIMESTAMP on the live DB while
-- the SQLAlchemy model (backend/models/customer_requests.py) declares
-- Column(Date). Found while diagnosing a real bug: get_sales_prefill()
-- returns this value straight through with no formatting, so a raw
-- datetime.datetime serialized to "2026-09-15T00:00:00" - not
-- "yyyy-MM-dd" - which a native <input type="date"> silently rejects
-- (blanks the field on screen while the underlying value stays non-empty),
-- confusing users into thinking Cleaning Date is unfilled. Every stored
-- value already sits at midnight (confirmed via direct query), so this
-- is a lossless type correction, not a data change.

ALTER TABLE customer_requests
    ALTER COLUMN cleaning_date TYPE DATE
    USING cleaning_date::date;
