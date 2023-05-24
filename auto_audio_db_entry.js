const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/songs_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Read the folder and create MongoDB entries
    readFolderAndCreateEntries();
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define song schema
const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  imageUrl: String,
  filePath: String,
});

// Create song model
const Song = mongoose.model('songs', songSchema);

// Function to read folder and create MongoDB entries
function readFolderAndCreateEntries() {
  const folderPath = '/path/to/folder'; // Specify the folder path

  fs.readdir(folderPath, async (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return;
    }

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const fileStats = fs.statSync(filePath);

      if (fileStats.isFile()) {
        // Create a new song entry in MongoDB
        const song = new Song({
          title: file,
          artist: 'Unknown',
          imageUrl: 'path/to/default/image', // Set a default image URL
          filePath: filePath,
        });

        try {
          await song.save();
          console.log('Created song entry:', song);
        } catch (error) {
          console.error('Error creating song entry:', error);
        }
      }
    }
  });
}
