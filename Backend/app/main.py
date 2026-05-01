from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.database import engine, Base
from app.routers import auth, projects, tasks, dashboard
import app.models  # sab models load hon

# Tables create karo
Base.metadata.create_all(bind=engine)
with engine.begin() as connection:
    connection.execute(
        text("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR NOT NULL DEFAULT 'member'")
    )
    connection.execute(text("UPDATE users SET role = 'member' WHERE role = 'viewer'"))
    connection.execute(text("UPDATE project_members SET role = 'member' WHERE role = 'viewer'"))

app = FastAPI(
    title="Team Task Manager",
    description="Ethara.AI Assessment — Team Task Manager Project",
    version="1.0.0"
)

# CORS — React frontend allow karo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "Team Task Manager API is running!"}
