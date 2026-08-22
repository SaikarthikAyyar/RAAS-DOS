-- ====================================
-- FIX DEAD "OTHER" / "OTHERS" LOOKUP OPTIONS
-- Audit of every lookup_list_values row containing "other" found 3
-- where is_other was never set to true, so LookupSelect.jsx never
-- swapped to a free-text input when picked - "Other" was a dead-end
-- select value, not a real "type your own" option. Names are kept
-- exactly as they already were ("Other" vs "Others") - only the
-- is_other flag changes, which is what actually drives the swap-to-
-- free-text behaviour already built into LookupSelect.jsx.
--
-- currentMethod / dischargeMedium are live, in-use dropdowns (Sales
-- Survey Section G / Section E). disposalRoute is currently not
-- rendered by any live dropdown (its one field was removed from
-- Section E in the prior session) but is fixed here too for data
-- consistency, in case it's ever reused.
--
-- jobType's "Other / To Review" is a live, widely-shared list (Customer
-- Request Section 1, Sales Survey Section B, and Machines/Fleet's
-- "Preferred Job Types" multi-select checkbox list). Flipping is_other
-- here only changes behaviour for single-select LookupSelect consumers
-- (the two dropdowns) - the CheckboxList component used by Machines
-- never reads is_other at all, so its checkbox rendering is unaffected.
--
-- customerRegion and leadSource also each have an "Other" row, but
-- both are already is_active=false (soft-deleted, not shown in any
-- live dropdown) - left untouched, out of scope.
-- ====================================

UPDATE lookup_list_values SET is_other = true
WHERE lookup_list_id = (SELECT id FROM lookup_lists WHERE list_key = 'jobType')
  AND value = 'Other / To Review' AND is_active = true;

UPDATE lookup_list_values SET is_other = true
WHERE lookup_list_id = (SELECT id FROM lookup_lists WHERE list_key = 'currentMethod')
  AND value = 'Other' AND is_active = true;

UPDATE lookup_list_values SET is_other = true
WHERE lookup_list_id = (SELECT id FROM lookup_lists WHERE list_key = 'dischargeMedium')
  AND value = 'Others' AND is_active = true;

UPDATE lookup_list_values SET is_other = true
WHERE lookup_list_id = (SELECT id FROM lookup_lists WHERE list_key = 'disposalRoute')
  AND value = 'Others' AND is_active = true;
