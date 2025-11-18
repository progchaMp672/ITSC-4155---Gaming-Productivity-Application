from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from backend.database import get_db
from backend.models.user import User
from backend.models.task import Task
from backend.models.streak import Streak
from backend.models.category import Category
from backend.models.achievement import Achievement
from backend.models.user_achievement import UserAchievement
from backend.schemas.task import TaskCreate, TaskResponse, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["Tasks"])

def apply_level_up(user: User):
    exp_needed = 10 * user.level

    if user.exp is None:
        user.exp = 0

    if user.level is None:
        user.level = 1

    # Check if the user has enough experience to level up
    if user.exp >= exp_needed:
        user.level += 1
        user.exp = 0

def update_user_streak(db: Session, user_id: int, streak_type: str = "daily_tasks"):
    # Get the user's streak
    streak = (
        db.query(Streak)
        .filter(Streak.user_id == user_id, Streak.streak_type == streak_type)
        .first()
    )

    today = date.today()

    if not streak:
        # Create a new streak if none exists
        streak = Streak(
            user_id=user_id,
            streak_type=streak_type,
            current_streak=1,
            longest_streak=1,
            last_activity=today,
        )
        db.add(streak)
        return streak
    
    if streak.last_activity == today - timedelta(days=1):
        streak.current_streak += 1
    elif streak.last_activity < today - timedelta(days=1):
        streak.current_streak = 1

    if streak.current_streak > streak.longest_streak:
        streak.longest_streak = streak.current_streak

    streak.last_activity = today
    return streak

def check_task_achievements(db: Session, user_id: int):
    # Example achievement: Complete 5 tasks
    completed_count = (
        db.query(Task)
        .filter(Task.user_id == user_id, Task.completed == True)
        .count()
    )

    achievements_to_check = []
    if completed_count >= 5:
        achievements_to_check.append("Task Rookie")
    if completed_count >= 10:
        achievements_to_check.append("Task Pro")
    if completed_count >= 20:
        achievements_to_check.append("Task Master")

    for name in achievements_to_check:
        achievement = (
            db.query(Achievement)
            .filter(Achievement.name == name)
            .first()
        )
        if not achievement:
            continue

        already_earned = (
            db.query(UserAchievement)
            .filter(
                UserAchievement.user_id == user_id,
                UserAchievement.achievement_id == achievement.id,
            )
            .first()
        )
        if not already_earned:
            user_achievement = UserAchievement(
                user_id=user_id,
                achievement_id=achievement.id,
                earned_at=datetime.utcnow(),
            )
            db.add(user_achievement)

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
        task.completed_at = datetime.utcnow()
        user = db.query(User).filter(User.id == task.user_id).first()
        if user:
            base_xp = 5
            xp_gain = int(base_xp * 1.5)
            gold_gain = 5

            user.exp = (user.exp or 0) + xp_gain
            user.gold = (user.gold or 0) + gold_gain
            apply_level_up(user)
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

