from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import (
    initialize_database,
    get_student,
    add_study_session,
    get_daily_tasks
)


# =========================================
# FASTAPI APP
# =========================================

app = FastAPI(title="StudentSENSEI API")


# =========================================
# CORS
# Allow Krishna's React frontend
# =========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================
# STUDY SESSION MODEL
# =========================================

class StudySession(BaseModel):
    duration_minutes: int
    session_type: str = "pomodoro"


# =========================================
# XP CALCULATION
# =========================================

def calculate_xp(duration_minutes, session_type):

    if session_type == "pomodoro" and duration_minutes == 25:
        return 5

    return 0


# =========================================
# DATABASE STARTUP
# =========================================

@app.on_event("startup")
def startup():

    initialize_database()


# =========================================
# HOME / HEALTH CHECK
# =========================================

@app.get("/")
def home():

    return {
        "success": True,
        "message": "StudentSENSEI backend is running"
    }


# =========================================
# GET STUDENT PROFILE
# =========================================

@app.get("/api/student")
def student_profile():

    student = get_student()

    return {
        "success": True,
        "student": dict(student)
    }


# =========================================
# COMPLETE STUDY SESSION
# =========================================

@app.post("/api/study-session")
def complete_study_session(session: StudySession):

    if session.duration_minutes <= 0:

        return {
            "success": False,
            "message": "Study duration must be greater than zero"
        }


    xp_earned = calculate_xp(
        session.duration_minutes,
        session.session_type
    )


    result = add_study_session(
        session.duration_minutes,
        session.session_type,
        xp_earned
    )


    if result is None:

        return {
            "success": False,
            "message": "Student not found"
        }


    return {
        "success": True,
        "message": "Study session completed",
        "duration_minutes": session.duration_minutes,
        "xp_earned": xp_earned
    }


# =========================================
# GET DAILY TASKS
# =========================================

@app.get("/api/daily-tasks")
def daily_tasks():

    tasks = get_daily_tasks()


    if tasks is None:

        return {
            "success": False,
            "message": "Student not found"
        }


    return {
        "success": True,
        "tasks": [dict(task) for task in tasks]
    }