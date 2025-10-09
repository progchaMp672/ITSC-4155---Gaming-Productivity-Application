import os
from dotenv import load_dotenv

load_dotenv()

class Conf:
    db_host = os.getenv("DB_HOST", "localhost")
    db_name = os.getenv("DB_NAME", "hero_app")
    db_port = int(os.getenv("DB_PORT", 3306))
    db_user = os.getenv("DB_USER", "root")
    db_password = os.getenv("DB_PASSWORD", "12345")
    app_host = os.getenv("APP_HOST", "localhost")
    app_port = int(os.getenv("APP_PORT", 8055))


conf = Conf()