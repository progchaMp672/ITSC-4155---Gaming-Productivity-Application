from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.models.task import Task
from backend.models.category import Category
from backend.schemas.task import TaskCreate, TaskResponse, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["Tasks"])

# Creates a task
@router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):

    category = db.query(Category).filter(Category.id == task.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Invalid category selected")

    new_task = Task(**task.model_dump())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

# Reads all tasks
@router.get("/", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

# Reads one task
@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

# Updates a task
@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    was_completed = task.completed
    for key, value in task_data.model_dump(exclude_unset=True).items():
        setattr(task, key, value)

    if not was_completed and task.completed:
        user = db.query(User).filter(User.id == task.user_id).first()
        if user:
            base_xp = 5
            xp_gain = int(base_xp * 1.5)
            gold_gain = 5

            user.exp = (user.exp or 0) + xp_gain
            user.gold = (user.gold or 0) + gold_gain
    db.commit()
    db.refresh(task)
    return task

# Deletes a task
@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"detail": "Task deleted"}

