from fastapi import APIRouter

from app.services.alert_engine import check_cpu_alert

router = APIRouter()


@router.get("/alerts/check")
def check_alert():
    return check_cpu_alert()