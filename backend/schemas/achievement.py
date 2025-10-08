from pydantic import BaseModel
from typing import Optional

class AchievementBase(BaseModel):
    name: str
    description: Optional[str] = None
    criteria: Optional[str] = None
    points_reward: Optional[int] = 0
    badge_url: Optional[str] = None

class AchievementCreate(AchievementBase):
    pass

class AchievementResponse(AchievementBase):
    id: int

    class Config:
        from_attributes = True