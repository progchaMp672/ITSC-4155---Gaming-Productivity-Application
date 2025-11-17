from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from backend.schemas.task import TaskResponse
from backend.schemas.streak import StreakResponse
from backend.schemas.user_reward import UserRewardResponse
from backend.schemas.user_achievement import UserAchievementResponse


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int
    points: int
    level: int
    gold: int
    exp: int
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True
