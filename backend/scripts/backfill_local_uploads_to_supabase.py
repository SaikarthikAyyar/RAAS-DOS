# ====================================
# ONE-TIME BACKFILL: local-disk uploads -> Supabase Storage
# Phase 41 moved every upload path onto Supabase Storage going
# forward, but rows created before that switch still have file_path
# values in the old "backend/uploads/..." shape, pointing at files
# that (on this local machine only) still genuinely exist on disk.
# This script pushes each of those still-real local files up to
# Supabase Storage under the new clean key and rewrites the DB row to
# match - so local dev/test data isn't silently orphaned by the
# storage cutover. Safe to run more than once (skips rows already in
# the new key shape). Only ever run against local Postgres + this
# machine's own local disk - there is nothing to backfill against
# Supabase's own DB, since Render's disk (what its file_path rows
# would have to be read from) is already gone.
# ====================================

import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import psycopg2

from backend.services.storage_client import upload_object

DATABASE_URL = "postgresql://postgres:acbdfe132@localhost:5433/raas_dos"

TABLES = [
    ("execution_media", "id", "file_path"),
    ("customer_media", "id", "file_path"),
    ("personnel_documents", "id", "file_path"),
    ("purchase_orders", "id", "file_path"),
    ("quote_release_documents", "id", "file_path"),
]


def main():

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    migrated = 0
    skipped_already_clean = 0
    missing_on_disk = []

    for table, id_col, path_col in TABLES:

        cur.execute(f"SELECT {id_col}, {path_col} FROM {table}")
        rows = cur.fetchall()

        for row_id, file_path in rows:

            if not file_path or not file_path.startswith("backend/uploads/"):
                skipped_already_clean += 1
                continue

            local_path = file_path

            if not os.path.exists(local_path):
                missing_on_disk.append((table, row_id, file_path))
                continue

            key = file_path[len("backend/uploads/"):]

            with open(local_path, "rb") as f:
                content = f.read()

            upload_object(key, content)

            cur.execute(f"UPDATE {table} SET {path_col} = %s WHERE {id_col} = %s", (key, row_id))
            conn.commit()

            migrated += 1
            print(f"migrated {table}#{row_id}: {file_path} -> {key}")

    print()
    print(f"Migrated: {migrated}")
    print(f"Already clean (skipped): {skipped_already_clean}")
    print(f"Missing on disk (could not backfill, already lost): {len(missing_on_disk)}")

    for table, row_id, file_path in missing_on_disk:
        print(f"  - {table}#{row_id}: {file_path}")

    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
