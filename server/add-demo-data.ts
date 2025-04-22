import { storage } from './storage';

async function addDemoData() {
  // Add additional movie entries (total 20)
  await Promise.all([
    // Additional movies 
    storage.createMovie({
      title: "Inception",
      director: "Christopher Nolan",
      year: "2010",
      genre: ["Action", "Adventure", "Sci-Fi"],
      rating: 5,
      imageUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
      type: "movie"
    }),
    storage.createMovie({
      title: "The Matrix",
      director: "Lana Wachowski, Lilly Wachowski",
      year: "1999",
      genre: ["Action", "Sci-Fi"],
      rating: 5,
      imageUrl: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
      type: "movie"
    }),
    // Additional 8 songs
    storage.createMusic({
      title: "Billie Jean",
      artist: "Michael Jackson",
      year: "1983",
      genre: "Pop",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
      type: "song"
    }),
    storage.createMusic({
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      year: "1987",
      genre: "Rock",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/13/AppetiteForDestructionCover.jpg",
      type: "song"
    }),
    storage.createMusic({
      title: "November Rain",
      artist: "Guns N' Roses",
      year: "1991",
      genre: "Rock",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/GnR--UseYourIllusion1.jpg",
      type: "song"
    }),
    storage.createMusic({
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      year: "1971",
      genre: "Rock",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg",
      type: "song"
    }),
    storage.createMusic({
      title: "Bohemian Rhapsody",
      artist: "Queen",
      year: "1975",
      genre: "Rock",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png",
      type: "song"
    }),
    storage.createMusic({
      title: "Every Breath You Take",
      artist: "The Police",
      year: "1983",
      genre: "Rock",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1f/The_Police_Synchronicity.jpg",
      type: "song"
    }),
    // Additional 8 albums
    storage.createMusic({
      title: "Thriller",
      artist: "Michael Jackson",
      year: "1982",
      genre: "Pop",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
      type: "album"
    }),
    storage.createMusic({
      title: "Back in Black",
      artist: "AC/DC",
      year: "1980",
      genre: "Rock",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/ACDC_Back_in_Black.png/220px-ACDC_Back_in_Black.png",
      type: "album"
    }),
    storage.createMusic({
      title: "Appetite for Destruction",
      artist: "Guns N' Roses",
      year: "1987",
      genre: "Rock",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/13/AppetiteForDestructionCover.jpg",
      type: "album"
    }),
    storage.createMusic({
      title: "The Dark Side of the Moon",
      artist: "Pink Floyd",
      year: "1973",
      genre: "Rock",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
      type: "album"
    }),
    storage.createMusic({
      title: "Led Zeppelin IV",
      artist: "Led Zeppelin",
      year: "1971",
      genre: "Rock",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg",
      type: "album"
    }),
    storage.createMusic({
      title: "A Night at the Opera",
      artist: "Queen",
      year: "1975",
      genre: "Rock",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png",
      type: "album"
    }),
    storage.createMusic({
      title: "Synchronicity",
      artist: "The Police",
      year: "1983",
      genre: "Rock",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1f/The_Police_Synchronicity.jpg",
      type: "album"
    }),
    storage.createMusic({
      title: "Hotel California",
      artist: "Eagles",
      year: "1976",
      genre: "Rock",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg",
      type: "album"
    })
  ]);
  
  console.log('Demo data successfully added!');
}

// Function call
addDemoData().catch(console.error);
