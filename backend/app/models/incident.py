from sqlalchemy import Column, Integer, String, Text

from app.db.database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)

    service = Column(String)
    severity = Column(String)
    description = Column(String)
    status = Column(String)

    rca_analysis = Column(Text)

    healing_action = Column(String)
    healing_status = Column(String)
    healing_message = Column(Text)