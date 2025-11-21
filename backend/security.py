from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

max_bcrypt_length = 72

def _trim(password: str) -> str:
    if password is None:
        return ""
    return password[:max_bcrypt_length]

def get_password_hash(password: str) -> str:
    return pwd_context.hash(_trim(password))

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(_trim(plain_password), hashed_password)