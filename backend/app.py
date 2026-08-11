from fastapi import FastAPI

app = FastAPI(title="StudentSENSEI API")


@app.get("/")
def home():
    return {
        "success": True,
        "message": "StudentSENSEI backend is running"
    }