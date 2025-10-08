from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    description = Column(String(255), index=True)
    color = Column(String(255), index=True)
    icon = Column(String(255), index=True)

    tasks = relationship("Task", back_populates="category")