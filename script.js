const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const yearInput = document.getElementById('search-year');
const genreInput = document.getElementById('search-genre');
const results = document.getElementById('results');
const trendingContainer = document.getElementById('trending');
const apiKey = '57a16e34';

// Handle search form
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const query = input.value.trim();
  const year = yearInput.value.trim();
  const genre = genreInput.value.trim().toLowerCase();
  if (query) {
    searchMovies(query, year, genre);
  }
});

// Search movies
async function searchMovies(title, year, genre) {
  results.innerHTML = '<p>Loading...</p>';
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${title}${year ? `&y=${year}` : ''}`);
    const data = await response.json();
    results.innerHTML = '';
    if (data.Search) {
      let count = 0;
      for (let movie of data.Search) {
        const detailResponse = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`);
        const detail = await detailResponse.json();
        if (!genre || detail.Genre.toLowerCase().includes(genre)) {
          displayMovie(detail, results);
          count++;
        }
      }
      if (count === 0) {
        results.innerHTML = '<p>No movies matched your filters.</p>';
      }
    } else {
      results.innerHTML = '<p>No movies found. Please try again.</p>';
    }
  } catch (error) {
    results.innerHTML = '<p>Error fetching data. Please try again later.</p>';
    console.error('Fetch error:', error);
  }
}

// Load trending movies
const trendingTitles = [
  "Oppenheimer",
  "Barbie",
  "Dune",
  "The Batman",
  "Top Gun: Maverick",
  "Spider-Man: No Way Home"
];

async function loadTrendingMovies() {
  for (let title of trendingTitles) {
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`);
      const data = await response.json();
      if (data && data.Response !== "False") {
        displayMovie(data, trendingContainer);
      }
    } catch (error) {
      console.error("Error loading trending movie:", error);
    }
  }
}

// Display movie card
function displayMovie(movie, container) {
  const card = document.createElement('div');
  card.classList.add('movie-card');
  card.innerHTML = `
    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/250x350'}" alt="${movie.Title}" />
    <h3>${movie.Title} (${movie.Year})</h3>
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Actors:</strong> ${movie.Actors}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
    <p><strong>Rating:</strong> ${movie.imdbRating}</p>
  `;
  container.appendChild(card);
}
// Load trending on page load
loadTrendingMovies();
document.getElementById('home-button').addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // Optionally, clear previous search results
  results.innerHTML = '';
  input.value = '';
  yearInput.value = '';
  genreInput.value = '';
});

