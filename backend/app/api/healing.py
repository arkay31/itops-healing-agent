from fastapi import APIRouter
from app.services.healing_service import perform_healing

router = APIRouter(
    prefix="/healing",
    tags=["Healing"]
)

@router.post("/heal")
def heal(payload: dict):

    analysis = payload.get("analysis", "")

    result = perform_healing(analysis)

    return result