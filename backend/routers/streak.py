from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta
from backend.database import get_db
from backend.models.streak import Streak
from backend.schemas.streak import StreakCreate, StreakResponse

router = APIRouter(prefix="/streaks", tags=["Streaks"])

#Helper auto streak counter
def update_streak_counts(streak: Streak):
    today = date.today()
    if streak.last_activity:
        if streak.last_activity == today - timedelta(days=1):
            streak.current_streak += 1
        elif streak.last_activity < today - timedelta(days=1):
            streak.current_streak = 1
    else:
        streak.current_streak = 1

    if streak.current_streak > streak.longest_streak:
        streak.longest_streak = streak.current_streak

    streak.last_activity = today

#Creates or updates streak
@router.post("/", response_model=StreakResponse)
def create_or_update_streak(streak_data: StreakCreate, db: Session = Depends(get_db)):
    # Check if user already has a streak of this type
    streak = db.query(Streak).filter(
        Streak.user_id == streak_data.user_id,
        Streak.streak_type == streak_data.streak_type
    ).first()

    if streak:
        update_streak_counts(streak)
        db.commit()
        db.refresh(streak)
    else:
        streak = Streak(**streak_data.model_dump())
        update_streak_counts(streak)
        db.add(streak)
        db.commit()
        db.refresh(streak)

    return streak


#Create a streak
@router.post("/", response_model=StreakResponse)
def create_streak(streak: StreakCreate, db: Session = Depends(get_db)):
    new_streak = Streak(**streak.model_dump())
    db.add(new_streak)
    db.commit()
    db.refresh(new_streak)
    return new_streak

#Read a streak
@router.get("/{streak_id}", response_model=StreakResponse)
def get_streak(streak_id: int, db: Session = Depends(get_db)):
    streak = db.query(Streak).filter(Streak.id == streak_id).first()
    if not streak:
        raise HTTPException(status_code=404, detail="Streak not found")
    return streak

#Read all streaks
@router.get("/", response_model=list[StreakResponse])
def get_all_streaks(db: Session = Depends(get_db)):
    return db.query(Streak).all()

#Update a streak
@router.put("/{streak_id}", response_model=StreakResponse)
def update_streak(streak_id: int, streak_data: StreakCreate, db: Session = Depends(get_db)):
    streak = db.query(Streak).filter(Streak.id == streak_id).first()
    if not streak:
        raise HTTPException(status_code=404, detail="Streak not found")
    for key, value in streak_data.model_dump().items():
        setattr(streak, key, value)
    db.commit()
    db.refresh(streak)
    return streak

#Delete a streak
@router.delete("/{streak_id}")
def delete_streak(streak_id: int, db: Session = Depends(get_db)):
    streak = db.query(Streak).filter(Streak.id == streak_id).first()
    if not streak:
        raise HTTPException(status_code=404, detail="Streak not found")
    db.delete(streak)
    db.commit()
    return {"detail": "Streak deleted"}