from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.achievement import Achievement
from backend.schemas.achievement import AchievementCreate, AchievementResponse

router = APIRouter(prefix="/achievements", tags=["Achievements"])

#Creates an achievement
@router.post("/", response_model=AchievementResponse)
def create_achievement(achievement: AchievementCreate, db: Session = Depends(get_db)):
    new_achievement = Achievement(**achievement.model_dump())
    db.add(new_achievement)
    db.commit()
    db.refresh(new_achievement)
    return new_achievement

#Get one achievement
@router.get("/{achievement_id}", response_model=AchievementResponse)
def get_achievement(achievement_id: int, db: Session = Depends(get_db)):
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return achievement

#Get all achievements
@router.get("/", response_model=List[AchievementResponse])
def get_achievements(db: Session = Depends(get_db)):
    return db.query(Achievement).all()

#Update an achievement
@router.put("/{achievement_id}", response_model=AchievementResponse)
def update_achievement(achievement_id: int, achievement_data: AchievementCreate, db: Session = Depends(get_db)):
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    for key, value in achievement_data.model_dump().items():
        setattr(achievement, key, value)
    db.commit()
    db.refresh(achievement)
    return achievement

#Delete an achievement
@router.delete("/{achievement_id}")
def delete_achievement(achievement_id: int, db: Session = Depends(get_db)):
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    db.delete(achievement)
    db.commit()
    return {"detail": "Achievement deleted"}