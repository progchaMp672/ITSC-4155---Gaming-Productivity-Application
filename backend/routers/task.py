from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
import backend.models, backend.schemas

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/")
def create_task(task: backend.schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = backend.models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task
