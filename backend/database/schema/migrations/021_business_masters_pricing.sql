-- Business Masters: Service Configurations, Dewatering Methods,
-- Accessories, Commercial Rules, Customer Categories.
-- Promotes the hardcoded constants in backend/data/commercial_assumptions.py
-- (the sole consumer was backend/services/quote_engine.py) into real,
-- admin-editable tables. See Phase 10 in the cumulative plan file for
-- full context.

CREATE TABLE IF NOT EXISTS service_configurations (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    rate_per_day NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dewatering_methods (
    id SERIAL PRIMARY KEY,
    method_key VARCHAR(30) UNIQUE NOT NULL,
    method_name VARCHAR(150) NOT NULL,
    rate_per_m3 NUMERIC(12,2) NOT NULL,
    best_for VARCHAR(255),
    review_trigger VARCHAR(255),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accessories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    unit VARCHAR(50) DEFAULT 'per job',
    rate NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Single-row config table, matches the wireframe's flat "Commercial rules" form.
CREATE TABLE IF NOT EXISTS commercial_rules (
    id SERIAL PRIMARY KEY,
    mobilisation_rate NUMERIC(12,2) NOT NULL,
    setup_rate NUMERIC(12,2) NOT NULL,
    demob_rate NUMERIC(12,2) NOT NULL,
    overhead_pct NUMERIC(5,4) NOT NULL,
    margin_pct NUMERIC(5,4) NOT NULL,
    contingency_pct NUMERIC(5,4) NOT NULL,
    documentation_buffer NUMERIC(12,2) NOT NULL,
    access_support_buffer NUMERIC(12,2) NOT NULL,
    updated_at TIMESTAMP DEFAULT now()
);

-- The nested sub-table inside the wireframe's Commercial Rules tab.
CREATE TABLE IF NOT EXISTS customer_categories (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) UNIQUE NOT NULL,
    margin_pct NUMERIC(5,4) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
