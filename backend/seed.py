from sqlalchemy.orm import Session
from backend.models.category import Category
from backend.models.achievement import Achievement
from backend.constants import PREDEFINED_CATEGORIES

def seed_categories(db: Session):
    for cat in PREDEFINED_CATEGORIES:
        existing = db.query(Category).filter_by(name=cat["name"]).first()
        if existing:
            existing.color = cat["color"]
        if not existing:
            new_cat = Category(**cat)
            db.add(new_cat)
    db.commit()

def seed_achievements(db: Session) :
    default_achievements = [
        {
            "name": "Task Rookie",
            "description": "Complete 5 tasks",
            "criteria": "5_tasks",
            "points_reward": 0,
            "badge_url": None,
        },
        {
            "name": "Task Pro",
            "description": "Complete 10 tasks",
            "criteria": "10_tasks",
            "points_reward": 0,
            "badge_url": None,
        },
        {
            "name": "Task Master",
            "description": "Complete 20 tasks",
            "criteria": "20_tasks",
            "points_reward": 0,
            "badge_url": None,
        },
    ]

    for n in default_achievements:
        existing = db.query(Achievement).filter_by(name=n["name"]).first()
        if not existing:
            new_ach = Achievement(**n)
            db.add(new_ach)