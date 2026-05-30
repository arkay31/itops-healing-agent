import requests


PROMETHEUS_URL = "http://localhost:9090"


def get_cpu_metric():

    query = "100 - (avg by(instance)(rate(node_cpu_seconds_total{mode='idle'}[1m])) * 100)"

    response = requests.get(
        f"{PROMETHEUS_URL}/api/v1/query",
        params={"query": query}
    )

    return response.json()