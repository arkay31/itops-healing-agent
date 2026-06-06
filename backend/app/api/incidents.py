from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.incident import Incident
from app.schemas.incident import IncidentCreate

from app.services.rca_service import analyze_incident

router = APIRouter()


@router.post("/incidents")
def create_incident(data: IncidentCreate):

    db: Session = SessionLocal()

    # Generate RCA + Healing
    result = analyze_incident(data.description)

    incident = Incident(
        service=data.service,
        severity=data.severity,
        description=data.description,
        status=data.status,

        rca_analysis=result["analysis"],

        healing_action=result["healing"]["action"],
        healing_status=result["healing"]["status"],
        healing_message=result["healing"]["message"]
    )

    db.add(incident)
    db.commit()
    db.refresh(incident)

    return incident


@router.get("/incidents")
def get_incidents():

    db: Session = SessionLocal()

    incidents = db.query(Incident).all()

    return incidents