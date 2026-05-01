# Team Task Manager Frontend

React + Tailwind frontend for the existing FastAPI backend.

## Run locally

```bash
npm install
npm run dev
```

The app expects the backend at `http://localhost:8000`.

To use another backend URL, create `.env`:

```bash
VITE_API_URL=http://localhost:8000
```

## Screens

- Signup and login
- Dashboard summary
- Project creation and switching
- Member invite with admin/member role
- Task creation, assignment email, due date, and status updates
