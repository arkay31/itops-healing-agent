def perform_healing(rca_analysis: str):

    analysis = rca_analysis.lower()

    if "cpu" in analysis:
        return {
            "action": "Scale Application",
            "status": "success",
            "message": "Recommended horizontal scaling"
        }

    elif "memory" in analysis:
        return {
            "action": "Restart Service",
            "status": "success",
            "message": "Recommended service restart"
        }

    elif "disk" in analysis:
        return {
            "action": "Clean Disk Space",
            "status": "success",
            "message": "Recommended disk cleanup"
        }

    return {
        "action": "No Action",
        "status": "skipped",
        "message": "No healing action identified"
    }