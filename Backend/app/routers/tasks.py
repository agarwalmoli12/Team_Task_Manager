from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.task import Task
from app.models.project_member import ProjectMember
from app.models.users import User
from app.schemas.task import TaskCreate, TaskUpdate, TaskOut
from app.core.auth import get_current_user
from app.core.RBAC import require_account_admin, require_member_or_admin
from typing import List
from datetime import datetime

router = APIRouter(prefix="/projects/{project_id}/tasks", tags=["Tasks"])

def get_project_assignee_id(db: Session, project_id: int, assignee_email: str | None):
    if not assignee_email:
        return None

    assignee = db.query(User).filter(User.email == assignee_email).first()
    if not assignee:
        raise HTTPException(
            status_code=400,
            detail="Assignee user not found. Add an existing project member or leave assignee blank."
        )

    membership = db.query(ProjectMember).filter(
        ProjectMember.user_id == assignee.id,
        ProjectMember.project_id == project_id
    ).first()
    if not membership:
        raise HTTPException(status_code=400, detail="Assignee must be a project member")

    return assignee.id

@router.post("/", response_model=TaskOut)
def create_task(
    project_id: int,
    data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_member_or_admin(db, current_user.id, project_id)
    require_account_admin(current_user)

    assignee_id = get_project_assignee_id(db, project_id, data.assignee_email)

    task = Task(
        title=data.title,
        description=data.description,
        project_id=project_id,
        assignee_id=assignee_id,
        due_date=data.due_date
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("/", response_model=List[TaskOut])
def get_tasks(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_member_or_admin(db, current_user.id, project_id)
    query = db.query(Task).filter(Task.project_id == project_id)
    if current_user.role == "member":
        query = query.filter(Task.assignee_id == current_user.id)
    return query.all()

@router.patch("/{task_id}", response_model=TaskOut)
def update_task(
    project_id: int,
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_member_or_admin(db, current_user.id, project_id)

    task = db.query(Task).filter(
        Task.id == task_id,
        Task.project_id == project_id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if current_user.role == "member":
        if task.assignee_id != current_user.id:
            raise HTTPException(status_code=403, detail="Members can update only their assigned tasks")
        if data.title or data.description or data.due_date or data.assignee_email is not None:
            raise HTTPException(status_code=403, detail="Members can update only task status")
        if data.status:
            task.status = data.status
    else:
        if data.title: task.title = data.title
        if data.description: task.description = data.description
        if data.status: task.status = data.status
        if data.due_date: task.due_date = data.due_date
        if data.assignee_email is not None:
            task.assignee_id = get_project_assignee_id(db, project_id, data.assignee_email)

    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_task(
    project_id: int,
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_member_or_admin(db, current_user.id, project_id)
    require_account_admin(current_user)
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.project_id == project_id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
