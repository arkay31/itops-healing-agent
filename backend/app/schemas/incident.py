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

    class Config:
        from_attributes = True