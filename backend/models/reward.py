from sqlalchemy import Column, Integer, String, Boolean, Enum
from sqlalchemy.orm import relationship
from backend.database import Base
import enum

class RewardType(str, enum.Enum):
    cosmetic = "cosmetic"
    boost = "boost"

class Rarity(str, enum.Enum):
    common = "common"
    rare = "rare"
    epic = "epic"

class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(String(255))
    type = Column(Enum(RewardType))
    rarity = Column(Enum(Rarity))
    cost_points = Column(Integer)
    image_url = Column(String(255))
    is_active = Column(Boolean, default=True)

    user_rewards = relationship("UserReward", back_populates="reward")