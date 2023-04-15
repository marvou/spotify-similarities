from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_similar_tracks():
    response = client.post("/api/similar-tracks", json={
        "track_name": "Bohemian Rhapsody",
        "artist_name": "Queen"
    })
    assert response.status_code == 200
    assert len(response.json()) > 0