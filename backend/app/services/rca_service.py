from ollama import chat


def analyze_incident(description: str):

    prompt = f"""
You are a Senior Site Reliability Engineer.

Analyze this incident:

{description}

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

    return {
        "analysis": response["message"]["content"]
    }