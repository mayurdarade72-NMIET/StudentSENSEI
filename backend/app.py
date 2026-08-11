from fastapi import FastAPI
from pydantic import BaseModel

from database import (
    initialize_database,
    get_student,
    add_study_session,
    get_daily_tasks
)


app = FastAPI(title="StudentSENSEI API")


class StudySession(BaseModel):
    duration_minutes: int
    session_type: str = "pomodoro"


def calculate_xp(duration_minutes, session_type):
    if session_type == "pomodoro" and duration_minutes == 25:
        return 5

    return 0


@app.on_event("startup")
def startup():
    initialize_database()


@app.get("/")
def home():
    return {
        "success": True,
        "message": "StudentSENSEI backend is running"
    }


@app.get("/api/student")
def student_profile():
    student = get_student()

    return {
        "success": True,
        "student": dict(student)
    }


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