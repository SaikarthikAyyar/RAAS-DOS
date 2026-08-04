-- Business Master: Customers module. Introduces a real, persistent
-- customer record (with contacts and a next-follow-up) plus an asset
-- registry, matching bm.customers / customerDetail() / makeAsset() in
-- the wireframe. customer_requests/enquiries are not touched here —
-- linking them to this master is a separate follow-on pass.

CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'Standard Industrial',
    industry VARCHAR(100),
    region VARCHAR(50),
    gst_number VARCHAR(50),
    owner VARCHAR(150),
    next_follow_up_date DATE,
    next_follow_up_owner VARCHAR(150),
    next_follow_up_note VARCHAR(500),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customer_contacts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    name VARCHAR(150),
    designation VARCHAR(150),
    email VARCHAR(150),
    phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT now()
);

-- profile is reserved for the asset's geometry/access/pump fields that
-- get populated once Sales Survey linkage exists (a later pass) - not
-- read or written by anything in this migration's feature set.
CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    division VARCHAR(150),
    plant VARCHAR(150),
    department VARCHAR(150),
    name VARCHAR(150),
    asset_type VARCHAR(100),
    cleaning_frequency VARCHAR(50),
    last_cleaned DATE,
    next_due DATE,
    last_verified DATE,
    verified_by VARCHAR(150),
    profile JSONB,
    created_at TIMESTAMP DEFAULT now()
);
