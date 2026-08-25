-- Phase 33B: Invoice gets a real PO link. No new independently-entered
-- $ field - invoice_value is resolved from the linked PurchaseOrder's
-- own po_value wherever Invoice is displayed, since PO value is
-- already the one real source of truth for this figure.

ALTER TABLE invoice ADD COLUMN IF NOT EXISTS purchase_order_id INTEGER REFERENCES purchase_orders(id);
