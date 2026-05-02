from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, projects, tasks, dashboard
import app.models

app = FastAPI(
    title="Team Task Manager",
    description="Ethara.AI Assessment — Team Task Manager Project",
    version="1.0.0"
)

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

@app.on_event("startup")
async def startup():
    # Startup pe tables banao — safely
    try:
        Base.metadata.create_all(bind=engine)
        print(" Database tables created!")
    except Exception as e:
        print(f" DB Error: {e}")

@app.get("/")
def root():
    return {"message": "Team Task Manager API is running!"}