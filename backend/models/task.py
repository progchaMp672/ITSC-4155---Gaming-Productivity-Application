from sqlalchemy import Column, Integer, String, Boolean, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base
import enum

class PriorityEnum(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(String(255))
    completed = Column(Boolean, default=False)
    #priority = Column(Enum(PriorityEnum), default=PriorityEnum.medium)
    due_date = Column(DateTime)
    completed_at = Column(DateTime)
    points_reward = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))

    user = relationship("User", back_populates="tasks")
    category = relationship("Category", back_populates="tasks")