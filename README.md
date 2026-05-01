# TASKIFY - Team Task Manager

TASKIFY is a full-stack team task management application for creating projects, managing team members, assigning tasks, tracking task status, and monitoring overdue work from a clean dashboard.

The project is built with a React/Vite frontend and a FastAPI backend. It supports role-based access for admins and members, JWT authentication, project-level teams, task assignment, and dashboard analytics.

## Key Features

- Authentication with signup and login
- Admin and member roles
- Project creation and project selection
- Project team management
- Add members to projects by email
- Task creation with title, description, assignee, and due date
- Task assignment to project members
- Task status tracking: `todo`, `in_progress`, `done`
- Member-friendly task status updates
- Dashboard summary for projects, tasks, completed tasks, and overdue tasks
- Search across projects and tasks
- Overdue task notification panel
- Light and dark theme UI
- Modern responsive UI using Tailwind CSS

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- Lucide React icons
- Browser `localStorage` for session and theme persistence

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL driver via `psycopg2-binary`
- Pydantic schemas
- JWT authentication with `python-jose`
- Password hashing with `passlib[bcrypt]`
- Role-based access control

## Project Structure

```text
Team_Task_Manager/
  Backend/
    app/
      core/          # Auth helpers and RBAC logic
      models/        # SQLAlchemy database models
      routers/       # API routes for auth, projects, tasks, dashboard
      schemas/       # Pydantic request/response schemas
      database.py    # Database setup
      main.py        # FastAPI app entry point
    requirements.txt

  Frontend/
    src/
      components/    # Reusable UI components
      pages/         # Auth and dashboard pages
      api.js         # API helper
      App.jsx        # App-level session/theme state
      styles.css     # Tailwind and shared component styles
    package.json
```

## User Roles

### Admin

Admins can:

- Create projects
- Add members to projects
- View project members
- Create tasks
- Assign tasks to project members
- Update task details/status
- Delete tasks
- View dashboard totals

### Member

Members can:

- View projects where they are a member
- View their assigned tasks
- Update status for their assigned tasks
- View dashboard totals relevant to them

## Backend Setup

Go to the backend folder:

```bash
cd Backend
```

Create and activate a virtual environment:

```bash
python -m venv .venv
```

On Windows PowerShell:

```bash
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in `Backend/`. Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/team_task_manager
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Run the backend:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend URL:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

## Frontend Setup

Go to the frontend folder:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

Build for production:

```bash
npm run build
```

## Important Usage Flow

1. Sign up as an admin.
2. Create a project.
3. Ask teammates to sign up as admin/member.
4. Add those teammates to the project by email.
5. Create tasks and optionally assign them to project members.
6. Track task status from the dashboard.
7. Use overdue notifications to monitor pending work.

Note: A task can only be assigned to a user who already exists and is a member of the selected project.

## Main API Routes

### Authentication

```text
POST /auth/signup
POST /auth/login
```

### Projects

```text
GET    /projects/
POST   /projects/
DELETE /projects/{project_id}
```

### Project Members

```text
GET  /projects/{project_id}/members
POST /projects/{project_id}/members
```

### Tasks

```text
GET    /projects/{project_id}/tasks/
POST   /projects/{project_id}/tasks/
PATCH  /projects/{project_id}/tasks/{task_id}
DELETE /projects/{project_id}/tasks/{task_id}
```

### Dashboard

```text
GET /dashboard/
```

## Frontend Highlights

- TASKIFY branded signup/login page
- Olive green and white UI theme
- Light/dark mode support
- Sidebar navigation
- Project list and selected project details
- Team management panel
- Task board grouped by status
- Dashboard statistic cards
- Search and notification interactions

## Security Notes

- `.env` files are ignored by Git.
- Do not commit real database credentials or secret keys.
- JWT tokens are stored in browser `localStorage` for this project.
- Passwords are hashed on the backend before storage.

## GitHub Notes

This repository includes `.gitignore` files for:

- Frontend dependencies and build output
- Backend virtual environments
- Python cache files
- Local `.env` files
- Logs and local database files

Before pushing, run:

```bash
git status
git add .
git commit -m "Initial TASKIFY project"
git push
```

## Future Improvements

- Add project editing
- Add task editing modal
- Add member removal
- Add drag-and-drop task status updates
- Add backend tests
- Add frontend tests
- Add deployment configuration

