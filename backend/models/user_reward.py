from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class UserReward(Base):
    __tablename__ = "user_rewards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    reward_id = Column(Integer, ForeignKey("rewards.id"))
    obtained_at = Column(DateTime)
    is_equipped = Column(Boolean, default=False)

    user = relationship("User", back_populates="user_rewards")
    reward = relationship("Reward", back_populates="user_rewards")