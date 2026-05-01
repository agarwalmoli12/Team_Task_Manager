from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.project_member import ProjectMember
from app.models.users import User

def require_account_admin(user: User):
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin accounts can perform this action"
        )

def get_member_role(db: Session, user_id: int, project_id: int) -> str:
    """User ka role fetch karo is project mein"""
    member = db.query(ProjectMember).filter(
        ProjectMember.user_id == user_id,
        ProjectMember.project_id == project_id
    ).first()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Aap is project ke member nahi hain"
        )
    return member.role

def require_admin(db: Session, user_id: int, project_id: int):
    """Sirf Admin allow — warna 403"""
    role = get_member_role(db, user_id, project_id)
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Yeh action sirf Admin kar sakta hai"
        )

def require_project_admin(db: Session, user: User, project_id: int):
    require_account_admin(user)
    require_admin(db, user.id, project_id)

def require_member_or_admin(db: Session, user_id: int, project_id: int):
    """Admin aur Member dono allow"""
    get_member_role(db, user_id, project_id)  # sirf membership check kaafi hai
