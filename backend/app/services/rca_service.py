from app.services.healing_service import perform_healing


def analyze_incident(description: str):
    """
    Simple RCA Analysis
    (Temporary version for Render deployment)
    """

    analysis = f"""
Root Cause:
High CPU utilization detected in service.

Recommendation:
Scale application instances, investigate resource bottlenecks,
and monitor CPU usage closely.

Incident:
{description}
"""

    healing_result = perform_healing(
        analysis
    )

    return {
        "analysis": analysis,
        "healing": healing_result
    }