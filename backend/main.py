from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
from datetime import datetime
import os

# Initialize FastAPI app
app = FastAPI(title="User Management API", version="1.0.0")

# CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database path
DB_PATH = os.path.join(os.path.dirname(__file__), 'users.db')

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database tables"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Create user_details table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_details (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            pan TEXT NOT NULL,
            gst TEXT,
            phone TEXT NOT NULL,
            address TEXT NOT NULL,
            district TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create managers table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS managers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_detail_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_detail_id) REFERENCES user_details (id) ON DELETE CASCADE
        )
    ''')
    
    conn.commit()
    conn.close()
    print("Database initialized successfully")

# Initialize database on startup
init_db()

# Pydantic models
class Manager(BaseModel):
    name: str
    phone: str

class UserDetailCreate(BaseModel):
    name: str
    pan: str
    gst: Optional[str] = None
    phone: str
    address: str
    district: str
    managers: List[Manager] = []

# API endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "User Management API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.post("/user-details/")
async def create_user_detail(detail: UserDetailCreate):
    """Create new user detail with managers"""
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        # Insert user details
        cursor.execute('''
            INSERT INTO user_details (name, pan, gst, phone, address, district)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (detail.name, detail.pan, detail.gst, detail.phone, detail.address, detail.district))
        
        detail_id = cursor.lastrowid
        
        # Insert managers
        for manager in detail.managers:
            cursor.execute('''
                INSERT INTO managers (user_detail_id, name, phone)
                VALUES (?, ?, ?)
            ''', (detail_id, manager.name, manager.phone))
        
        conn.commit()
        
        # Return created detail
        cursor.execute('SELECT * FROM user_details WHERE id = ?', (detail_id,))
        user_detail = dict(cursor.fetchone())
        
        cursor.execute('SELECT name, phone FROM managers WHERE user_detail_id = ?', (detail_id,))
        managers = [{"name": row["name"], "phone": row["phone"]} for row in cursor.fetchall()]
        
        return {
            **user_detail,
            "managers": managers
        }
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/user-details/")
async def get_user_details():
    """Get all user details with managers"""
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        cursor.execute('SELECT * FROM user_details ORDER BY created_at DESC')
        details = []
        
        for row in cursor.fetchall():
            user_detail = dict(row)
            
            # Get managers for this user detail
            cursor.execute('SELECT name, phone FROM managers WHERE user_detail_id = ?', (user_detail['id'],))
            managers = [{"name": m["name"], "phone": m["phone"]} for m in cursor.fetchall()]
            
            details.append({
                **user_detail,
                "managers": managers
            })
        
        return details
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.delete("/user-details/{detail_id}")
async def delete_user_detail(detail_id: int):
    """Delete user detail and associated managers"""
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        # Delete managers first
        cursor.execute('DELETE FROM managers WHERE user_detail_id = ?', (detail_id,))
        
        # Delete user detail
        cursor.execute('DELETE FROM user_details WHERE id = ?', (detail_id,))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="User detail not found")
        
        conn.commit()
        return {"message": "User detail deleted successfully", "id": detail_id}
        
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    print("Starting User Management API...")
    print("API will be available at: http://localhost:8000")
    print("API documentation at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
