from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserRewardBase(BaseModel):
    user_id: int
    reward_id: int
    obtained_at: Optional[datetime] = None
    is_equipped: Optional[bool] = False

class UserRewardCreate(UserRewardBase):
    pass

class UserRewardResponse(UserRewardBase):
    id: int

    class Config:
        from_attributes = True