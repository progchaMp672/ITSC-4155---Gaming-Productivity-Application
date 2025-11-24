from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.models.task import Task

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
# Dashboard data endpoint, combines user info and tasks
@router.get("/{user_id}")
def get_dashboard_data(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    tasks = db.query(Task).filter(Task.user_id == user_id).all()

    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "level": getattr(user, "level", 1),
            "exp": getattr(user, "exp", 0),
            "gold": getattr(user, "gold", 0),
            "streak": getattr(user, "streak", 0),
        },
        "tasks": [
            {"id": t.id, "title": t.title, "completed": getattr(t, "completed", False)}
            for t in tasks
        ]
    }
