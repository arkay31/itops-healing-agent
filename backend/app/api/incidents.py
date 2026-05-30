from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.incident import Incident
from app.schemas.incident import IncidentCreate

router = APIRouter()


@router.post("/incidents")
def create_incident(data: IncidentCreate):

    db: Session = SessionLocal()

    incident = Incident(
        service=data.service,
        severity=data.severity,
        description=data.description,
        status=data.status
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