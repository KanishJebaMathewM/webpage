# SecureAccess Web Application

A modern web application for managing user details with a clean, professional UI using JavaScript localStorage for data persistence.

## Features

- **Login Page**: Clean and compact login interface with animated background
- **User Details Management**: Enter and save user information including managers
- **View All Entities**: Display all saved user details in an organized card-based layout
- **Editable Data**: Click on any field in the view entities page to edit and save changes
- **Local Storage**: All data is stored locally in the browser using JavaScript localStorage
- **Modern UI**: Professional design with smooth animations, particles.js effects, and responsive layout
- **No Backend Required**: Pure frontend application with client-side data storage

## Screenshots

### Login Page
![Login Page](https://github.com/user-attachments/assets/65caa3a7-d319-44a1-a9e6-5bdd983f7f57)

### User Details Page
![User Details Page](https://github.com/user-attachments/assets/e7ed9638-c17a-43ff-8a30-2e323fdcba11)

### View Entities Page
![View Entities Page](https://github.com/user-attachments/assets/d36e7013-14ac-4571-aafd-778436d61bb8)

## Setup Instructions

### Quick Start

1. **Open the Application**
   
   Simply open `index.html` in your browser. No server or backend setup required!
   
   Alternatively, you can serve it with a local HTTP server:
   ```bash
   python -m http.server 8080
   ```
   Then navigate to `http://localhost:8080/index.html`

2. **Start Using**
   
   - Login with any credentials (demo mode)
   - Add user details and managers
   - View and edit saved entities
   
   All data is stored locally in your browser's localStorage.

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
3. **Save**: Click the "Save" button to save the data to localStorage
4. **View Entities**: Click "View Entities" to see all saved user details
5. **Edit**: Click on any field in an entity card to edit it. Changes are automatically saved when you click outside the field
6. **Delete**: Click the delete button on any entity card to remove it from localStorage

## Technical Stack

### Frontend
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- localStorage API for data persistence
- Particles.js for background effects

## Data Storage

All user data is stored in the browser's localStorage with the following structure:

### Entity Object
```javascript
{
  id: Number (timestamp),
  name: String,
  pan: String,
  gst: String (optional),
  phone: String,
  address: String,
  district: String,
  created_at: String (ISO timestamp),
  managers: [
    {
      name: String,
      phone: String
    }
  ]
}
```

### Legacy Backend (Deprecated)

The `backend` folder contains a legacy Python/FastAPI implementation that is no longer used. The application now uses client-side localStorage instead.

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Development

The application follows a simple architecture:
- **Separation of Concerns**: HTML for structure, CSS for styling, JS for behavior
- **Client-Side Storage**: Uses localStorage for persistent data storage
- **Editable UI**: ContentEditable fields for inline editing
- **Responsive Design**: Works on various screen sizes
- **No Build Tools**: Simple setup without complex build processes
- **No Backend Required**: Pure frontend application

## License

This project is open source and available for educational purposes.
