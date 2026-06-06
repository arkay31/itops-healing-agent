
from ollama import chat

from app.services.healing_service import perform_healing
from app.rag.qdrant_service import (
    search_similar_incidents
)


def analyze_incident(description: str):

    # Retrieve similar incidents from Qdrant

    similar_incidents = search_similar_incidents(
        description
    )

    historical_context = ""

    for incident in similar_incidents:
        historical_context += (
            f"- {incident.payload.get('description')}\n"
        )

    prompt = f"""
You are a Senior Site Reliability Engineer.

Current Incident:
{description}

Similar Historical Incidents:
{historical_context}

Analyze the current incident using the
historical incidents as context.

Return:

Root Cause:
Recommendation:

Keep the answer concise and professional.
"""

    response = chat(
        model="llama3",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    analysis = response["message"]["content"]

    healing_result = perform_healing(
        analysis
    )

    return {
        "analysis": analysis,
        "healing": healing_result
    }