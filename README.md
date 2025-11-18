# SecureAccess Web Application

A modern web application for managing user details with a clean, professional UI and Python backend.

## ⚠️ IMPORTANT: Starting the Backend

**Before using the application, you MUST start the backend server:**

### Option 1: Windows
1. Navigate to the `backend` folder
2. Double-click `start.bat`

### Option 2: Linux/Mac
1. Open terminal in the `backend` folder
2. Run: `./start.sh`

### Option 3: Manual Start
1. Navigate to the `backend` folder
2. Run: `python main.py`

The backend will be available at `http://localhost:8000`

## Features

- **Login Page**: Clean and compact login interface with animated background
- **User Details Management**: Enter and save user information including managers
- **View All Entities**: Display all saved user details in an organized card-based layout
- **Python Backend**: FastAPI-based REST API with SQLite database
- **Modern UI**: Professional design with smooth animations, particles.js effects, and responsive layout
- **Backend Status Indicator**: Visual notification when backend is connected/disconnected

## Screenshots

### Login Page
![Login Page](https://github.com/user-attachments/assets/65caa3a7-d319-44a1-a9e6-5bdd983f7f57)

### User Details Page
![User Details Page](https://github.com/user-attachments/assets/e7ed9638-c17a-43ff-8a30-2e323fdcba11)

### View Entities Page
![View Entities Page](https://github.com/user-attachments/assets/d36e7013-14ac-4571-aafd-778436d61bb8)

## Setup Instructions

### Quick Start

1. **Start the Backend Server (REQUIRED)**
   
   Choose one method:
   - **Windows**: Double-click `backend/start.bat`
   - **Linux/Mac**: Run `cd backend && ./start.sh`
   - **Manual**: Run `cd backend && python main.py`

2. **Open the Frontend**
   
   Open `index.html` in your browser, or serve it with:
   ```bash
   python -m http.server 8080
   ```
   Then navigate to `http://localhost:8080/index.html`

3. **Check Backend Connection**
   
   The login page will show a green "Backend connected" indicator in the top-right corner when the backend is running properly.

### Detailed Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```bash
   python main.py
   ```

   The backend will be running at `http://localhost:8000`

### Frontend Setup

1. From the root directory, start a simple HTTP server:
   ```bash
   python -m http.server 8080
   ```

   Or use any other HTTP server of your choice.

2. Open your browser and navigate to:
   ```
   http://localhost:8080/index.html
   ```

## Usage

1. **Login**: Enter any email and password on the login page and click Login
2. **Enter Details**: Fill in the user details form including:
   - Name
   - PAN Number
   - GST Number (optional)
   - Phone Number
   - Address
   - District
   - Managers (click "Add Manager" to add manager details)
3. **Save**: Click the "Save" button to save the data to the backend
4. **View Entities**: Click "View Entities" to see all saved user details
5. **Manage**: From the View Entities page, you can delete entities or go back to add more

## Technical Stack

### Frontend
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- Fetch API for backend communication

### Backend
- Python 3.12+
- FastAPI - Modern web framework
- SQLite - Lightweight database
- Pydantic - Data validation
- Uvicorn - ASGI server

## API Endpoints

- `GET /` - Health check
- `POST /user-details/` - Create new user detail entry
- `GET /user-details/` - Get all user details
- `DELETE /user-details/{id}` - Delete a user detail entry

## Database Schema

### user_details
- id (INTEGER, PRIMARY KEY)
- name (TEXT, NOT NULL)
- pan (TEXT, NOT NULL)
- gst (TEXT, OPTIONAL)
- phone (TEXT, NOT NULL)
- address (TEXT, NOT NULL)
- district (TEXT, NOT NULL)
- created_at (TIMESTAMP)

### managers
- id (INTEGER, PRIMARY KEY)
- user_detail_id (INTEGER, FOREIGN KEY)
- name (TEXT, NOT NULL)
- phone (TEXT, NOT NULL)
- created_at (TIMESTAMP)

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Development

The application follows a simple architecture:
- **Separation of Concerns**: HTML for structure, CSS for styling, JS for behavior
- **RESTful API**: Clean API design with proper HTTP methods
- **Responsive Design**: Works on various screen sizes
- **No Build Tools**: Simple setup without complex build processes

## License

This project is open source and available for educational purposes.
