from fastapi import APIRouter

from app.services.monitoring_service import get_cpu_metric

router = APIRouter()


@router.get("/monitor/cpu")
def monitor_cpu():
    return get_cpu_metric()