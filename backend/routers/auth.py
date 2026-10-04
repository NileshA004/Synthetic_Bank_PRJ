from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from datetime import datetime
from database import get_auth_connection
from auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class UserRegister(BaseModel):
    username: str
    email: str
    password: str
    full_name: str = ""

class UserLogin(BaseModel):
    username: str
    password: str

@router.post("/register")
def register(user_data: UserRegister):
    conn = get_auth_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE username = ? OR email = ?", (user_data.username, user_data.email))
    existing = cur.fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="Username or email already registered")
        
    hashed_pwd = get_password_hash(user_data.password)
    now = datetime.utcnow().isoformat()
    
    cur.execute(
        "INSERT INTO users (username, email, hashed_password, full_name, role, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (user_data.username, user_data.email, hashed_pwd, user_data.full_name, "Quant Analyst", now)
    )
    conn.commit()
    user_id = cur.lastrowid
    conn.close()
    
    token = create_access_token({"sub": user_data.username, "user_id": user_id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "username": user_data.username,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "role": "Quant Analyst"
        }
    }

@router.post("/login")
def login(creds: UserLogin):
    conn = get_auth_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, username, email, hashed_password, full_name, role FROM users WHERE username = ?", (creds.username,))
    user = cur.fetchone()
    conn.close()
    
    if not user or not verify_password(creds.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
        
    token = create_access_token({"sub": user["username"], "user_id": user["id"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"]
        }
    }

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
