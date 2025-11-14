from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from backend.database import get_db
from backend.models.user_achievement import UserAchievement
from backend.models.user import User
from backend.models.achievement import Achievement
from backend.schemas.user_achievement import UserAchievementCreate, UserAchievementResponse


router = APIRouter(prefix="/user-achievements", tags=["UserAchievements"])

#Assign achievement to a user
@router.post("/", response_model=UserAchievementResponse)
def assign_achievement(user_achievement: UserAchievementCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_achievement.user_id).first()
    achievement = db.query(Achievement).filter(Achievement.id == user_achievement.achievement_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")

    ua = UserAchievement(
        user_id=user_achievement.user_id,
        achievement_id=user_achievement.achievement_id,
        earned_at=user_achievement.earned_at or datetime.utcnow()
    )
    db.add(ua)
    db.commit()
    db.refresh(ua)
    return ua

#Get one achievement
@router.get("/user/{user_id}", response_model=List[UserAchievementResponse])
def get_achievements_by_user(user_id: int, db: Session = Depends(get_db)):
    achievements = db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()
    if not achievements:
        raise HTTPException(status_code=404, detail="No achievements found for this user")
    return achievements

#Get all achievements
@router.get("/", response_model=List[UserAchievementResponse])
def get_user_achievements(db: Session = Depends(get_db)):
    return db.query(UserAchievement).all()

#Remove user achievement
def delete_user_achievement(user_achievement_id: int, db: Session = Depends(get_db)):
    ua = db.query(UserAchievement).filter(UserAchievement.id == user_achievement_id).first()
    if not ua:
        raise HTTPException(status_code=404, detail="UserAchievement not found")
    db.delete(ua)
    db.commit()
    return {"detail": "User achievement removed"}