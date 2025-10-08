from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.database import Base

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    criteria = Column(String)
    points_reward = Column(Integer)
    badge_url = Column(String)

    user_achievements = relationship("UserAchievement", back_populates="achievement")