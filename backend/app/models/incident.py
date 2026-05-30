from sqlalchemy import Column, Integer, String

from app.db.database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    service = Column(String)
    severity = Column(String)
    description = Column(String)
    status = Column(String)