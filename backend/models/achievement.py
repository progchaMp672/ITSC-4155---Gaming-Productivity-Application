from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.database import Base

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(String(255))
    criteria = Column(String(255))
    points_reward = Column(Integer)
    badge_url = Column(String(255))

    user_achievements = relationship("UserAchievement", back_populates="achievement")