
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


client_id = 'f4b5bb8afc3f4acf8785d62d1eda35fe'
client_secret = 'd0b7bb71b43e4760a7e16c4b313ac2db'


client_credentials_manager = SpotifyClientCredentials(client_id, client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

class TrackInput(BaseModel):
    track_name: str
    artist_name: str

def get_track_id(track_name, artist_name):
    query = f"{track_name} artist:{artist_name}"
    result = sp.search(query, type="track", limit=1)
    if result["tracks"]["items"]:
        return result["tracks"]["items"][0]["id"]
    else:
        return None

def get_track_features(track_id):
    track_features = sp.audio_features([track_id])[0]
    return track_features

def get_similar_tracks(track_id, limit=10):
    # Get the artist ID from the track
    track = sp.track(track_id)
    artist_id = track['artists'][0]['id']

    # Get the genres associated with the artist
    artist = sp.artist(artist_id)
    seed_genres = artist['genres']

    # Pick up to 5 genres as seeds (Spotify API has a maximum of 5 seed_genres)
    seed_genres = seed_genres[:5]

    recommendations = sp.recommendations(seed_tracks=[track_id], limit=limit, seed_genres=seed_genres)
    similar_tracks = []
    for track in recommendations['tracks']:
        similar_tracks.append({
            'id': track['id'],
            'name': track['name'],
            'artist': track['artists'][0]['name'],
            'uri': track['uri']
        })

    return similar_tracks



@app.post("/api/similar-tracks")
async def similar_tracks(track: TrackInput):
    track_id = get_track_id(track.track_name, track.artist_name)
    if track_id:
        similar_tracks = get_similar_tracks(track_id)
        return similar_tracks
    else:
        raise HTTPException(status_code=404, detail="Track not found")
