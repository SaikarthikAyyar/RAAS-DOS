-- Job Type: "Open Channel / Intake Well" was one single combined
-- option - no machine could express a preference for one without the
-- other, and Ops Selection's score_job_type (a plain exact-match
-- against machine.preferred_job_types) could never score them
-- separately. Split into two real, independent options; the old
-- combined value is soft-deleted (is_active=false), not removed, so
-- any historical Sales Survey row that already recorded it still
-- displays correctly - it just stops being offered on new surveys.

INSERT INTO lookup_list_values (lookup_list_id, value, sort_order, is_active)
SELECT lookup_list_id, 'Open Channel', sort_order, true
FROM lookup_list_values
WHERE id = (
    SELECT llv.id FROM lookup_list_values llv
    JOIN lookup_lists ll ON ll.id = llv.lookup_list_id
    WHERE ll.list_key = 'jobType' AND llv.value = 'Open Channel / Intake Well'
)
AND NOT EXISTS (
    SELECT 1 FROM lookup_list_values llv2
    JOIN lookup_lists ll2 ON ll2.id = llv2.lookup_list_id
    WHERE ll2.list_key = 'jobType' AND llv2.value = 'Open Channel'
);

INSERT INTO lookup_list_values (lookup_list_id, value, sort_order, is_active)
SELECT lookup_list_id, 'Intake Well', sort_order, true
FROM lookup_list_values
WHERE id = (
    SELECT llv.id FROM lookup_list_values llv
    JOIN lookup_lists ll ON ll.id = llv.lookup_list_id
    WHERE ll.list_key = 'jobType' AND llv.value = 'Open Channel / Intake Well'
)
AND NOT EXISTS (
    SELECT 1 FROM lookup_list_values llv2
    JOIN lookup_lists ll2 ON ll2.id = llv2.lookup_list_id
    WHERE ll2.list_key = 'jobType' AND llv2.value = 'Intake Well'
);

UPDATE lookup_list_values llv
SET is_active = false
FROM lookup_lists ll
WHERE ll.id = llv.lookup_list_id
  AND ll.list_key = 'jobType'
  AND llv.value = 'Open Channel / Intake Well';
