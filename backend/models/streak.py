from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class Streak(Base):
    __tablename__ = "streaks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_activity = Column(Date)
    streak_type = Column(String(255))

    user = relationship("User", back_populates="streaks")