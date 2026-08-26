-- Hub ownership shifts from the Machine Specs catalog (machines.hubs_available,
-- a static per-TYPE list) to Machine Inventory (a real per-UNIT home hub) -
-- physical stock genuinely has one home hub, a spec/type doesn't. Fleet Units'
-- own hub_id stays a real, independently-settable column - this just gives
-- the Fleet Unit modal a real source to prefill it from.
ALTER TABLE machine_inventory ADD COLUMN IF NOT EXISTS hub_id INTEGER REFERENCES hubs(id);
