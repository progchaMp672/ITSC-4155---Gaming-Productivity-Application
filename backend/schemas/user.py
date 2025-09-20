from pydantic import BaseModel
from typing import List
from backend.schemas.task import Task

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    tasks: List[Task] = list
    class Config:
        orm_mode = True