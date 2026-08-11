from fastapi import FastAPI
from database import initialize_database, get_student

app = FastAPI(title="StudentSENSEI API")


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