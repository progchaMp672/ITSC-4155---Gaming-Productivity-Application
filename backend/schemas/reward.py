from pydantic import BaseModel
from typing import Optional

class RewardBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: Optional[str] = None
    rarity: Optional[str] = None
    cost_points: Optional[int] = 0
    image_url: Optional[str] = None
    is_active: Optional[bool] = True

class RewardCreate(RewardBase):
    pass

class RewardResponse(RewardBase):
    id: int

    class Config:
        from_attributes = True