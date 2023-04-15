import { useState } from 'react';
import axios from 'axios';
import { Container, Form, FormGroup, Label, Input, Button, Card, CardTitle, CardText } from 'reactstrap';
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
      <Container>
        <h1 className="my-5 text-center">Find Similar Tracks</h1>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="trackName">Track Name:</Label>
            <Input
              type="text"
              id="trackName"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="artistName">Artist Name:</Label>
            <Input
              type="text"
              id="artistName"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
            />
          </FormGroup>
          <Button color="primary" type="submit">Find Similar Tracks</Button>
        </Form>
        <div className="similar-tracks mt-5">
          {similarTracks.map((track) => (
            <Card key={track.id} className="my-3">
              <CardTitle tag="h3" className="mt-3">{track.name} by {track.artist}</CardTitle>
              <CardText>
                <a href={track.youtube_search_url} target="_blank" rel="noopener noreferrer">
                  YouTube Search: {track.name} by {track.artist}
                </a>
                <br />
                <a href={track.spotify_song_url} target="_blank" rel="noopener noreferrer">
                  Spotify Song: {track.name} by {track.artist}
                </a>
              </CardText>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default App;
