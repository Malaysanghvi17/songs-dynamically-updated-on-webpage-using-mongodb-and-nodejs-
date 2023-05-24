window.addEventListener('DOMContentLoaded', () => {
  // Fetch the list of songs from the server and populate the song list
  fetch('/api/songs')
    .then(response => response.json())
    .then(songs => {
      console.log('Songs:', songs); // Log the data received from the server

      // Rest of the code
    })
    .catch(error => {
      console.error('Error fetching songs:', error);
    });

  fetch('/api/songs')
    .then(response => response.json())
    .then(songs => {
      const songList = document.getElementById('songList');

      songs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.classList.add('song');

        const titleElement = document.createElement('div');
        titleElement.classList.add('title');
        titleElement.textContent = song.title;
        songElement.appendChild(titleElement);

        const artistElement = document.createElement('div');
        artistElement.classList.add('artist');
        artistElement.textContent = song.artist;
        songElement.appendChild(artistElement);

        const audioElement = document.createElement('audio');
        audioElement.src = `/api/songs/${song._id}/stream`; // Set the audio source
        audioElement.controls = true; // Show the audio player controls
        songElement.appendChild(audioElement);

        songList.appendChild(songElement);
      });

      console.log('Songs:', songs); // Log the data received from the server
    })
    .catch(error => {
      console.error('Error fetching songs:', error);
    });
});

function playSong(songId) {
  // Implement your logic to play the selected song
  console.log('Playing song with ID:', songId);
}
