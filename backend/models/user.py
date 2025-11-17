from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    points = Column(Integer, default=0)
    level = Column(Integer, default=1)
    gold = Column(Integer, default=0)
    exp = Column(Integer, default=0)

    #Auto set timestamps
    created_at = Column(DateTime, server_default=func.now())
    last_login = Column(DateTime, onupdate=func.now(), nullable=True)

    tasks = relationship("Task", back_populates="user")
    streaks = relationship("Streak", back_populates="user")
    user_rewards = relationship("UserReward", back_populates="user")
    user_achievements = relationship("UserAchievement", back_populates="user")