from pydantic import BaseModel


class IncidentCreate(BaseModel):
    service: str
    severity: str
    description: str
    status: str


class IncidentResponse(BaseModel):
    id: int

    service: str
    severity: str
    description: str
    status: str

    rca_analysis: str | None = None

    healing_action: str | None = None
    healing_status: str | None = None
    healing_message: str | None = None

    class Config:
        from_attributes = True