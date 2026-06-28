from fastapi import APIRouter

from app.services.rca_service import analyze_incident

router = APIRouter()


@router.post("/rca/analyze")
def analyze(data: dict):

    description = data.get("description")

    return analyze_incident(description)