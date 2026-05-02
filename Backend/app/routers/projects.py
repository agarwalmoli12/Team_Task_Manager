from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.project import Project
from app.models.project_member import ProjectMember
from app.models.task import Task
from app.models.users import User
from app.schemas.project import ProjectCreate, ProjectOut, MemberAdd, MemberOut
from app.core.auth import get_current_user
from app.core.RBAC import require_member_or_admin, require_project_admin, require_account_admin
from typing import List

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", response_model=ProjectOut)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_account_admin(current_user)

    project = Project(
        name=data.name,
        description=data.description,
        owner_id=current_user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # Creator automatically Admin banta hai
    membership = ProjectMember(
        user_id=current_user.id,
        project_id=project.id,
        role="admin"
    )
    db.add(membership)
    db.commit()
    project.my_role = "admin"
    return project

@router.get("/", response_model=List[ProjectOut])
def get_my_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    memberships = db.query(ProjectMember).filter(
        ProjectMember.user_id == current_user.id
    ).all()
    roles_by_project_id = {m.project_id: m.role for m in memberships}
    project_ids = list(roles_by_project_id.keys())
    if not project_ids:
        return []

    projects = db.query(Project).filter(Project.id.in_(project_ids)).all()
    for project in projects:
        project.my_role = roles_by_project_id.get(project.id)
    return projects

@router.get("/{project_id}/members", response_model=List[MemberOut])
def get_members(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_project_admin(db, current_user, project_id)
    rows = (
        db.query(ProjectMember, User)
        .join(User, ProjectMember.user_id == User.id)
        .filter(ProjectMember.project_id == project_id)
        .all()
    )
    return [
        {
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "role": member.role,
        }
        for member, user in rows
    ]

@router.post("/{project_id}/members")
def add_member(
    project_id: int,
    data: MemberAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_project_admin(db, current_user, project_id)

    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=400,
            detail="User not found. The teammate must sign up before you can add them."
        )
    
    if user.role != data.role:
        raise HTTPException(
        detail=f"Selected role must match the user's account role: {user.role}"
    )

    existing = db.query(ProjectMember).filter(
        ProjectMember.user_id == user.id,
        ProjectMember.project_id == project_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already a member")

    member = ProjectMember(
        user_id=user.id,
        project_id=project_id,
        role=data.role
    )
    db.add(member)
    db.commit()
    return {"message": f"{user.name} added as {data.role}"}

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_project_admin(db, current_user, project_id)
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.query(Task).filter(Task.project_id == project_id).delete()
    db.query(ProjectMember).filter(ProjectMember.project_id == project_id).delete()
    db.delete(project)
    db.commit()
    return {"message": "Project deleted"}
