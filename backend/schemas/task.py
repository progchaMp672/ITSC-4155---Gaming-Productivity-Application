from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: Optional[bool] = False
    priority: Optional[str] = "medium"
    due_date: Optional[datetime] = None
    points_reward: Optional[int] = 0
    category_id: Optional[int] = None

class TaskCreate(TaskBase):
    user_id: int

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

    class Config:
        from_attributes = True
