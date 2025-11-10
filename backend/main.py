from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
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

# --- routers ---
app.include_router(user_router.router)
app.include_router(task_router.router)
