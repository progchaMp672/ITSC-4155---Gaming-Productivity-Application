from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional
from backend.schemas.task import TaskResponse
from backend.schemas.streak import StreakResponse
from backend.schemas.user_reward import UserRewardResponse
from backend.schemas.user_achievement import UserAchievementResponse


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=50)

    @field_validator("password")
    @classmethod
    def strong_password(cls, v: str) -> str:
        if (len(v) < 8 or
            not any(c.islower() for c in v) or
            not any(c.isupper() for c in v) or
            not any(c.isdigit() for c in v) or
            not any(c in "!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?`~" for c in v)):
            raise ValueError("Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 digit, and 1 special character.")
        return v

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
