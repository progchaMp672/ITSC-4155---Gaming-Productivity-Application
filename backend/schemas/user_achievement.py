from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserAchievementBase(BaseModel):
    user_id: int
    achievement_id: int
    earned_at: Optional[datetime] = None

class UserAchievementCreate(UserAchievementBase):
    pass

class UserAchievementResponse(UserAchievementBase):
    id: int

    class Config:
        from_attributes = True