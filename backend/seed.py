from sqlalchemy.orm import Session
from backend.models.category import Category
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
