from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional
from datetime import datetime

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=160)
    description: Optional[str] = Field(default=None, max_length=1000)
    assignee_email: Optional[EmailStr] = None
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=160)
    description: Optional[str] = Field(default=None, max_length=1000)
    status: Optional[Literal["todo", "in_progress", "done"]] = None
    assignee_email: Optional[EmailStr] = None
    due_date: Optional[datetime] = None

class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    project_id: int
    assignee_id: Optional[int]
    due_date: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
