from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.incident import Incident
from app.services.monitoring_service import get_cpu_metric


# Threshold in percentage
CPU_THRESHOLD = 0.2


def check_cpu_alert():
    """
    Check CPU usage from Prometheus.
    Create an incident if threshold is exceeded.
    Prevent duplicate open incidents.
    """

    data = get_cpu_metric()

    result = data.get("data", {}).get("result", [])

    if not result:
        return {
            "alert": False,
            "message": "No metrics found"
        }

    cpu = float(result[0]["value"][1])

    if cpu <= CPU_THRESHOLD:
        return {
            "alert": False,
            "cpu": cpu,
            "message": "CPU usage normal"
        }

    db: Session = SessionLocal()

    try:

        # Check for existing open incident
        existing_incident = (
            db.query(Incident)
            .filter(
                Incident.service == "system",
                Incident.status == "open"
            )
            .first()
        )

        if existing_incident:
            return {
                "alert": True,
                "cpu": cpu,
                "message": "Open incident already exists",
                "incident_id": existing_incident.id
            }

        # Create new incident
        incident = Incident(
            service="system",
            severity="critical",
            description=f"CPU usage reached {cpu:.2f}%",
            status="open"
        )

        db.add(incident)
        db.commit()
        db.refresh(incident)

        return {
            "alert": True,
            "cpu": cpu,
            "message": "New incident created",
            "incident_id": incident.id
        }

    finally:
        db.close()