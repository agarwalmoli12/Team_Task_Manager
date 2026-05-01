from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional
from datetime import datetime

class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = Field(default=None, max_length=500)

class ProjectOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    owner_id: int
    created_at: datetime
    my_role: Optional[Literal["admin", "member"]] = None

    class Config:
        from_attributes = True

class MemberAdd(BaseModel):
    email: EmailStr
    role: Literal["admin", "member"]

class MemberOut(BaseModel):
    user_id: int
    name: str
    email: str
    role: Literal["admin", "member"]

    class Config:
        from_attributes = True
