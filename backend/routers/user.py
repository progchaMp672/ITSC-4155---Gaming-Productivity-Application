from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime, date
from backend.database import get_db
from backend.models.user import User
from backend.schemas.user import UserCreate, UserResponse
from typing import Optional

router = APIRouter(prefix="/users", tags=["Users"])

def apply_level_up(user: User):

    if user.exp is None:
        user.exp = 0

    if user.level is None:
        user.level = 1
    
    exp_needed = 10 * user.level
    # Check if the user has enough experience to level up
    while user.exp >= user.level * 10:
        user.exp -= user.level * 10
        user.level += 1

@router.post("/{user_id}/daily-bonus")
def claim_daily_bonus(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    today = date.today()

    #If the user has already claimed the bonus today, throw error
    if user.last_daily_bonus == today:
        raise HTTPException(status_code=400, detail="Daily bonus already claimed")

    bonus_exp = 20

    user.exp = (user.exp or 0) + bonus_exp
    apply_level_up(user)
    user.last_daily_bonus = today

    db.commit()
    db.refresh(user)

    return {
        "detail": "Daily bonus claimed",
        "exp_gained": bonus_exp,
        "level": user.level,
        "exp": user.exp,
    }

#Creates a user
@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


#Reads all users
@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


#Reads one user
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


#Updates a user
@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in user_data.model_dump().items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user


#Deletes a user
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"detail": "User deleted"}


# ---  Login user (UPDATED) ---
@router.post("/login")
async def login_user(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    identifier = data.get("email")  # frontend sends "email" even if it’s username
    password = data.get("password")

    # Try to find user by email first, then by username
    user = (
        db.query(User)
        .filter((User.email == identifier) | (User.username == identifier))
        .first()
    )

    if not user or user.password != password:  #  plain-text check
        raise HTTPException(status_code=401, detail="Invalid username/email or password")

    return {"message": "Login successful", "user_id": user.id}


# ---  Get logged-in user info ---
@router.get("/me/{user_id}")
def get_user_info(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "username": user.username,
        "gold": getattr(user, "gold", 0),
        "exp": getattr(user, "exp", 0),
        "points": getattr(user, "points", 0),
    }

# ---  Update user stats (gold, exp, etc.) ---
@router.put("/stats/{user_id}")
def update_user_stats(user_id: int, stats: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # update only certain fields
    gold = stats.get("gold")
    exp = stats.get("exp")
    points = stats.get("points")

    if gold is not None:
        user.gold = gold
    if exp is not None:
        user.exp = exp
    if points is not None:
        user.points = points

    db.commit()
    db.refresh(user)
    return {"message": "User stats updated", "user": {
        "id": user.id,
        "gold": user.gold,
        "exp": user.exp,
        "points": user.points
    }}

