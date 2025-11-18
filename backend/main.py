from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
from datetime import datetime
import os

# Initialize FastAPI app
app = FastAPI(title="User Management API")

# CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = "sqlite:///./users.db"

def get_db():
    conn = sqlite3.connect('users.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create user_details table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        full_name TEXT NOT NULL,
        pan_number TEXT,
        gst_number TEXT,
        phone TEXT,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    # Create admin user if not exists
    cursor.execute('''
    INSERT OR IGNORE INTO users (username, email, hashed_password)
    VALUES (?, ?, ?)
    ''', ("admin", "admin@example.com", "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"))  # password: admin123
    
    conn.commit()
    conn.close()

# Initialize the database
init_db()

# Pydantic models
class UserDetailBase(BaseModel):
    full_name: str
    pan_number: str
    gst_number: Optional[str] = None
    phone: str
    address: str

class UserDetailCreate(UserDetailBase):
    pass

class UserDetail(UserDetailBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# API endpoints
@app.get("/")
async def root():
    return {"message": "User Management API is running"}

@app.post("/user-details/", response_model=UserDetail)
async def create_user_detail(detail: UserDetailCreate):
    conn = get_db()
    cursor = conn.cursor()
    
    # In a real app, you would get the user_id from the authenticated user
    # For demo, we'll use user_id=1 (admin)
    user_id = 1
    
    try:
        cursor.execute('''
        INSERT INTO user_details (user_id, full_name, pan_number, gst_number, phone, address)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, detail.full_name, detail.pan_number, detail.gst_number, detail.phone, detail.address))
        
        detail_id = cursor.lastrowid
        conn.commit()
        
        # Return the created detail
        cursor.execute('SELECT * FROM user_details WHERE id = ?', (detail_id,))
        created_detail = dict(cursor.fetchone())
        return created_detail
        
    except sqlite3.IntegrityError as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@app.get("/user-details/", response_model=List[UserDetail])
async def get_user_details():
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        # In a real app, you would filter by the authenticated user
        cursor.execute('SELECT * FROM user_details')
        details = [dict(row) for row in cursor.fetchall()]
        return details
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
