from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.task import Task
from app.models.project_member import ProjectMember
from app.models.project import Project
from app.core.auth import get_current_user
from app.models.users import User
from datetime import datetime

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # User ke saare projects
    memberships = db.query(ProjectMember).filter(
        ProjectMember.user_id == current_user.id
    ).all()
    project_ids = [m.project_id for m in memberships]

    task_query = db.query(Task).filter(Task.project_id.in_(project_ids))
    if current_user.role == "member":
        task_query = task_query.filter(Task.assignee_id == current_user.id)
    all_tasks = task_query.all()

    now = datetime.utcnow()

    return {
        "total_projects": len(project_ids),
        "total_tasks": len(all_tasks),
        "todo": len([t for t in all_tasks if t.status == "todo"]),
        "in_progress": len([t for t in all_tasks if t.status == "in_progress"]),
        "done": len([t for t in all_tasks if t.status == "done"]),
        "overdue": len([
            t for t in all_tasks
            if t.due_date and t.due_date < now and t.status != "done"
        ]),
        "my_tasks": len([t for t in all_tasks if t.assignee_id == current_user.id])
    }
