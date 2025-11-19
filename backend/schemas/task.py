from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from backend.schemas.category import CategoryResponse


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: Optional[bool] = False
   #priority: Optional[str] = "medium"
    due_date: Optional[datetime] = None
    points_reward: Optional[int] = 0
    user_id: int
    category_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    points_reward: Optional[int] = None
    category_id: Optional[int] = None

class TaskResponse(TaskBase):
    id: int
    completed_at: Optional[datetime] = None
    user_id: int
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True
