from fastapi import FastAPI, Depends, HTTPException 
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.database import get_db, Base, engine
from backend.routers import user as user_router, task as task_router, achievement as achievement_router, category as category_router, reward as reward_router, streak as streak_router, user_achievement as user_achievement_router
from backend.models import (achievement, category, reward, streak, task as
task_model, user as user_model, user_achievement, user_reward)

from backend.seed import seed_categories

app = FastAPI(title="Accountability Hero API")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

with next(get_db()) as db:
    seed_categories(db)

@app.get("/")
def read_root():
    return {"message": "Welcome to Accountability Hero Backend!"}

#New route: serve user info for frontend
@app.get("/user/{user_id}")
def get_user_data(user_id: int, db: Session = Depends(get_db)):
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "username": user.username,
        "gold": getattr(user, "gold", 0), #user.gold
        "exp": getattr(user, "exp", 0), #user.exp
        "points": getattr(user, "points", 0), #user.points
        "level": getattr(user, "level", 1), #user.level
        "streak": getattr(user, "streak", 0), #user.streak
    }

#routers inclusion
app.include_router(user_router.router)
app.include_router(task_router.router)

app.include_router(achievement_router.router)
app.include_router(category_router.router)
app.include_router(reward_router.router)
app.include_router(streak_router.router)
app.include_router(user_achievement_router.router)

