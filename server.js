const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8300;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/songs_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define song schema
const songSchema = new mongoose.Schema({
    title: String,
    artist: String,
    imageUrl: String,
    filePath: {
      type: mongoose.Schema.Types.String,
      default: function() {
        console.log("title of song: " + this.title)
        return `C:/Users/Dell/Music/Playlists/${this.title}`;
      },
    },
  });

// Create song model
const Song = mongoose.model('songs', songSchema);

// Serve static files
app.use(express.static('public'));

// Define API routes

// Fetch list of songs
app.get('/api/songs', async (req, res) => {
  try {
    // Retrieve the list of songs from the database
    const songs = await Song.find().select('title artist imageUrl');
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'An error occurred while fetching songs' });
  }
});

// Stream audio file
app.get('/api/songs/:id/stream', async (req, res) => {
  const songId = req.params.id;

  try {
    // Find the song in the database by ID
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Retrieve the file path for the song
    const filePath = song.filePath;

    // Create a readable stream from the audio file
    const fileStream = fs.createReadStream(filePath);

    // Set the appropriate headers for streaming the audio file
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline',
    });

    // Pipe the file stream to the response to initiate streaming
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error streaming song:', error);
    res.status(500).json({ error: 'An error occurred while streaming the song' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
