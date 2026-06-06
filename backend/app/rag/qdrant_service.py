from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct
)

from sentence_transformers import SentenceTransformer

# Load embedding model
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# Initialize Qdrant
client = QdrantClient(":memory:")

# Create collection if it doesn't exist
try:
    client.get_collection("incidents")
except Exception:
    client.create_collection(
        collection_name="incidents",
        vectors_config=VectorParams(
            size=384,
            distance=Distance.COSINE
        )
    )


def store_incident(
    incident_id: int,
    description: str
):
    """
    Store incident embedding in Qdrant
    """

    embedding = model.encode(
        description
    ).tolist()

    client.upsert(
        collection_name="incidents",
        points=[
            PointStruct(
                id=incident_id,
                vector=embedding,
                payload={
                    "description": description
                }
            )
        ]
    )

    return True


def search_similar_incidents(
    description: str,
    limit: int = 3
):
    """
    Search semantically similar incidents
    """

    embedding = model.encode(
        description
    ).tolist()

    results = client.query_points(
        collection_name="incidents",
        query=embedding,
        limit=limit
    ).points

    return results