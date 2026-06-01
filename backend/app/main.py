from fastapi import FastAPI

from app.db.database import Base
from app.db.database import engine

import app.models

from app.api.incidents import router as incident_router
from app.api.monitoring import router as monitoring_router
from app.api.alerts import router as alert_router
from app.api.rca import router as rca_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="IT Ops Healing Agent",
    description="AI Powered Autonomous IT Operations Platform",
    version="1.0.0"
)

app.include_router(incident_router)
app.include_router(monitoring_router)
app.include_router(alert_router)
app.include_router(rca_router)

@app.get("/")
def root():
    return {
        "project": "IT Ops Healing Agent",
        "status": "running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }