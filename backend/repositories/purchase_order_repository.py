# ====================================
# IMPORTS
# ====================================

from backend.models.purchase_order import PurchaseOrder


def list_purchase_orders(db, enquiry_id):
    return (
        db.query(PurchaseOrder)
        .filter(PurchaseOrder.enquiry_id == enquiry_id)
        .order_by(PurchaseOrder.uploaded_at.desc())
        .all()
    )


def count_purchase_orders(db, enquiry_id):
    return (
        db.query(PurchaseOrder)
        .filter(PurchaseOrder.enquiry_id == enquiry_id)
        .count()
    )


def create_purchase_order(db, enquiry_id, file_name, file_path, po_number, po_value, uploaded_by):

    row = PurchaseOrder(
        enquiry_id=enquiry_id,
        file_name=file_name,
        file_path=file_path,
        po_number=po_number,
        po_value=po_value,
        uploaded_by=uploaded_by
    )

    db.add(row)
    db.commit()
    db.refresh(row)

    return row


def get_purchase_order(db, po_id):
    return db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()


def delete_purchase_order(db, po):
    db.delete(po)
    db.commit()
