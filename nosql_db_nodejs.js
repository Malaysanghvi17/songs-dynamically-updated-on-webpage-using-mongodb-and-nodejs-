const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const Speaker = require('speaker');

// MongoDB connection URL
const url = 'mongodb://localhost:27017';
// Database name
const dbName = 'clone_db';
// Collection name
const collectionName = 'content';

// Connect to MongoDB
MongoClient.connect(url, (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }

  console.log('Connected to MongoDB');

  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Retrieve the document with the given ID
  const documentId = '64687767647ac404d0c28a48';
  collection.findOne({ _id: documentId }, (err, document) => {
    if (err) {
      console.error('Error retrieving document:', err);
      return;
    }

    if (!document) {
      console.error('Document not found');
      return;
    }

    const { filename, title } = document;

    // Read the audio file from the file system
    fs.readFile(filename, (err, audioData) => {
      if (err) {
        console.error('Error reading audio file:', err);
        return;
      }

      // Create a new Speaker instance to play the audio
      const speaker = new Speaker();

      // Play the audio data
      speaker.write(audioData);

      console.log(`Now playing: ${title}`);

      // Close the MongoDB connection when finished
      client.close();
    });
  });
});
