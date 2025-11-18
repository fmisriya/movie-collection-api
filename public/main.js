// main.js – Fetch, render data & handle errors beautifully

const btnAll = document.getElementById('btnAll');
const btnClassics = document.getElementById('btnClassics');
const btnGenres = document.getElementById('btnGenres');
const output = document.getElementById('output');

// Button actions
btnAll.addEventListener('click', () => fetchAndRender('/movies', renderMovies));
btnClassics.addEventListener('click', () => fetchAndRender('/movies/classics', renderMovies));
btnGenres.addEventListener('click', () => fetchAndRender('/movies/genres', renderGenres));

/* ------------------------------------------------------
   Generic Fetch Helper + Error Handling
-------------------------------------------------------*/
async function fetchAndRender(url, renderFn) {
  output.innerHTML = `<p class="loading">Loading...</p>`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    renderFn(data);

  } catch (err) {
    output.innerHTML = `<p class="error">❌ Error: ${err.message}</p>`;
    console.error(err);
  }
}

/* ------------------------------------------------------
   Render Movies
-------------------------------------------------------*/
function renderMovies(movies) {
  if (!Array.isArray(movies) || movies.length === 0) {
    output.innerHTML = `<p class="empty">No movies found.</p>`;
    return;
  }

  output.innerHTML = '';

  movies.forEach(movie => {
    const div = document.createElement('div');
    div.className = 'movie-card';

    div.innerHTML = `
      <div class="movie-title">
        ${escapeHtml(movie.title)}
        ${movie.isClassic ? `<span class="badge">Classic</span>` : ''}
      </div>

      <div class="movie-meta">
        <span class="genre-tag">${escapeHtml(movie.genre)}</span>
        • Released: <strong>${movie.releaseYear}</strong>
        • Director: ${escapeHtml(movie.director)}
      </div>
    `;

    output.appendChild(div);
  });
}

/* ------------------------------------------------------
   Render Genres
-------------------------------------------------------*/
function renderGenres(data) {
  const genres = data?.genres || [];

  if (genres.length === 0) {
    output.innerHTML = `<p class="empty">No genres found.</p>`;
    return;
  }

  output.innerHTML = '';

  genres.forEach(g => {
    const div = document.createElement('div');
    div.className = 'genre-card';

    div.innerHTML = `
      <div class="genre-name">${escapeHtml(g.name)}</div>
      <div class="genre-count">${g.movieCount} movie(s)</div>
    `;

    output.appendChild(div);
  });
}

/* ------------------------------------------------------
   Basic HTML Escaper (XSS Protection)
-------------------------------------------------------*/
function escapeHtml(str) {
  if (!str) return '';

  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
