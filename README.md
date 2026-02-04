# College Management System - Run Instructions

## Prerequisites
- **Node.js**: Required to run the React frontend.
- **PHP**: Required to run the backend server.
- **SQLite**: (Usually pre-installed) for the database.

## Quick Start
1.  **Open Terminal** in the project folder (`/Users/apple/Desktop/CMS`).
2.  **Run the Project Script**:
    ```bash
    ./run_project.sh
    ```
    This script will:
    - Initialize the database.
    - Start the PHP backend at `http://localhost:8000`.
    - Start the React frontend at `http://localhost:5173`.

## Manual Start
If you prefer to run manually:

1.  **Backend**:
    ```bash
    php backend/setup_db.php   # One time setup
    php -S localhost:8000 -t backend
    ```

2.  **Frontend** (New Terminal):
    ```bash
    cd frontend
    npm run dev
    ```

## Credentials
- **Admin**: `admin@cms.com` / `admin123`
- **Student/Teacher**: You can create these via the Admin Panel.
