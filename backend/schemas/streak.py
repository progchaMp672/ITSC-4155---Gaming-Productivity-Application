from pydantic import BaseModel
from datetime import date
from typing import Optional

class StreakBase(BaseModel):
    current_streak: int
    longest_streak: int
    last_activity: Optional[date] = None
    streak_type: Optional[str] = None

class StreakCreate(StreakBase):
    user_id: int

class StreakResponse(StreakBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True