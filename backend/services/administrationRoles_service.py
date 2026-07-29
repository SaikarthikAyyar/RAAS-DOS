from sqlalchemy.orm import Session

from backend.models.roles import Role

from backend.schemas.administrationRoles_schema import (
    AdministrationRoleCreate,
    AdministrationRoleUpdate,
)


# ==========================================================
# GET ALL ROLES
# ==========================================================

def get_all_roles(db: Session):

    print("[Administration Roles Service] -> Fetching all roles...")

    roles = db.query(Role).order_by(Role.id).all()

    print(f"[Administration Roles Service] -> {len(roles)} roles fetched.")

    return roles


# ==========================================================
# GET ROLE BY ID
# ==========================================================

def get_role_by_id(
    role_id: int,
    db: Session,
):

    print(f"[Administration Roles Service] -> Fetching role ID {role_id}")

    role = db.query(Role).filter(Role.id == role_id).first()

    if role:

        print(
            f"[Administration Roles Service] -> Role found : {role.name}"
        )

    else:

        print(
            "[Administration Roles Service] -> Role not found."
        )

    return role


# ==========================================================
# CREATE ROLE
# ==========================================================

def create_role(
    payload: AdministrationRoleCreate,
    db: Session,
):

    print("[Administration Roles Service] -> Creating new role...")

    existing_role = db.query(Role).filter(

        Role.name == payload.name

    ).first()

    if existing_role:

        print(

            "[Administration Roles Service] -> Role already exists."

        )

        return None

    new_role = Role(

        name=payload.name,

        role_type=payload.role_type,

        description=payload.description,

        is_active=payload.is_active,

    )

    db.add(new_role)

    db.commit()

    db.refresh(new_role)

    # ======================================================
    # FUTURE:
    # Initialize permissions for every module here.
    # ======================================================

    print(

        f"[Administration Roles Service] -> Role created successfully. ID = {new_role.id}"

    )

    return new_role


# ==========================================================
# UPDATE ROLE
# ==========================================================

def update_role(
    role_id: int,
    payload: AdministrationRoleUpdate,
    db: Session,
):

    print(f"[Administration Roles Service] -> Updating role {role_id}")

    role = db.query(Role).filter(

        Role.id == role_id

    ).first()

    if not role:

        print(

            "[Administration Roles Service] -> Role not found."

        )

        return None

    update_data = payload.model_dump(

        exclude_unset=True

    )

    for field, value in update_data.items():

        setattr(role, field, value)

        print(f"Updated {field} -> {value}")

    db.commit()

    db.refresh(role)

    print(

        "[Administration Roles Service] -> Update completed."

    )

    return role


# ==========================================================
# TOGGLE ROLE STATUS
# ==========================================================

def toggle_role_status(
    role_id: int,
    db: Session,
):

    print(

        f"[Administration Roles Service] -> Toggling status for {role_id}"

    )

    role = db.query(Role).filter(

        Role.id == role_id

    ).first()

    if not role:

        print(

            "[Administration Roles Service] -> Role not found."

        )

        return None

    role.is_active = not role.is_active

    db.commit()

    db.refresh(role)

    print(

        f"[Administration Roles Service] -> Role Active = {role.is_active}"

    )

    return role


# ==========================================================
# DELETE ROLE
# ==========================================================

def delete_role(
    role_id: int,
    db: Session,
):

    print(

        f"[Administration Roles Service] -> Deleting role {role_id}"

    )

    role = db.query(Role).filter(

        Role.id == role_id

    ).first()

    if not role:

        print(

            "[Administration Roles Service] -> Role not found."

        )

        return False

    db.delete(role)

    db.commit()

    print(

        "[Administration Roles Service] -> Role deleted."

    )

    return True