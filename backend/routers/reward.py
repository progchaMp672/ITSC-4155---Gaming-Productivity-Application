from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.reward import Reward
from backend.models.user import User
from backend.models.user_reward import UserReward
from backend.schemas.reward import RewardCreate, RewardResponse
from pydantic import BaseModel

router = APIRouter(prefix="/rewards", tags=["Rewards"])

class RewardRedeemResponse(BaseModel):
    message: str
    user_points: int
    reward_id: int
    reward_name: str

#Creates a reward
@router.post("/", response_model=RewardResponse)
def create_reward(reward: RewardCreate, db: Session = Depends(get_db)):
    new_reward = Reward(**reward.model_dump())
    db.add(new_reward)
    db.commit()
    db.refresh(new_reward)
    return new_reward

#Read one reward
@router.get("/{reward_id}", response_model=RewardResponse)
def get_reward(reward_id: int, db: Session = Depends(get_db)):
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")
    return reward

#Read all rewards
@router.get("/", response_model=list[RewardResponse])
def get_rewards(db: Session = Depends(get_db)):
    return db.query(Reward).all()

#Update reward
@router.put("/{reward_id}", response_model=RewardResponse)
def update_reward(reward_id: int, reward_data: RewardCreate, db: Session = Depends(get_db)):
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")

    for key, value in reward_data.model_dump().items():
        setattr(reward, key, value)

    db.commit()
    db.refresh(reward)
    return reward

#Delete reward
@router.delete("/{reward_id}")
def delete_reward(reward_id: int, db: Session = Depends(get_db)):
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")

    db.delete(reward)
    db.commit()
    return {"detail": "Reward deleted"}

#Redeem reward
@router.post("/{reward_id}/redeem", response_model=RewardRedeemResponse)
def redeem_reward(reward_id: int, user_id: int, db: Session = Depends(get_db)):
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")

    if not reward.is_active:
        raise HTTPException(status_code=400, detail="Reward is not currently active")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if user has enough points
    if user.points < reward.cost_points:
        raise HTTPException(
            status_code=400,
            detail=f"Not enough points. Required: {reward.cost_points}, Available: {user.points}"
        )

    # Deduct points
    user.points -= reward.cost_points

    # Log redemption
    redemption = UserReward(user_id=user_id, reward_id=reward_id)
    db.add(redemption)

    db.commit()
    db.refresh(user)

    return RewardRedeemResponse(
        message="Reward redeemed successfully",
        user_points=user.points,
        reward_id=reward.id,
        reward_name=reward.name
    )
