from fastapi import FastAPI, Depends, HTTPException 
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.database import get_db, Base, engine
from backend.routers import user as user_router, task as task_router
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

# ✅ --- New route: serve user info for frontend ---
@app.get("/user/{user_id}")
def get_user_data(user_id: int, db: Session = Depends(get_db)):
    """
    Returns user info (username, gold, exp, streak) for display in index.html
    """
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # You can adjust field names here based on your actual columns
    return {
        "username": user.display_name,
        "gold": user.gold,
        "exp": user.exp,
        "streak": user.streak
    }

# --- routers ---
app.include_router(user_router.router)
app.include_router(task_router.router)
