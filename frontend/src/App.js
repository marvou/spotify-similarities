import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [trackName, setTrackName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [similarTracks, setSimilarTracks] = useState([]);




  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/similar-tracks', {
        track_name: trackName,
        artist_name: artistName,
      });
      setSimilarTracks(response.data);
    } catch (error) {
      console.error('Error fetching similar tracks:', error);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label htmlFor="trackName">Track Name:</label>
        <input
          type="text"
          id="trackName"
          value={trackName}
          onChange={(e) => setTrackName(e.target.value)}
        />
        <label htmlFor="artistName">Artist Name:</label>
        <input
          type="text"
          id="artistName"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
        />
        <button type="submit">Find Similar Tracks</button>
      </form>
      <div className="similar-tracks">
        <h2>Similar Tracks</h2>
        <ul>
          {similarTracks.map((track) => (
            <li key={track.id}>
              {track.name} by {track.artist}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
