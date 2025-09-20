from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.task import Task as TaskModel
from backend.schemas.task import Task, TaskCreate

router = APIRouter(prefix="/tasks", tags=["Tasks"])

# Create a task
@router.post("/", response_model=Task)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = TaskModel(**task.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

# Get all the tasks
@router.get("/", response_model=list[Task])
def read_tasks(db: Session = Depends(get_db)):
    return db.query(TaskModel).all()

# Get a singular task
@router.get("/{task_id}", response_model=Task)
def read_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

