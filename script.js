'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
////////////////////////////////////////////////////////////////
const apiKey = "476f803b63576c60c48c20f0ba1cd92d"
const homeBtn = document.querySelector("#homeBtn")

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  CONTAINER.innerHTML = `` // Cleans page
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// This function is to fetch Actors.
const fetchActors = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
};

// This function is to fetch similar movies.
const fetchSimilar = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/similar`);
  const res = await fetch(url);
  return res.json();
};

// You may need to add to this function, definitely don't delete it.
// Creates Single Movie Page 
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);

  const castRes = await fetchActors(movie.id)
  renderActors(castRes)

  const similarRes = await fetchSimilar(movie.id)
  renderSimilar(similarRes)
}

//Renders 5 Actors
const renderActors = (actors) => {
  const cast = actors.cast
  const actorsUl = document.querySelector("#actors")

  for (let i = 0; i < 5; i++) {
    const actorLi = document.createElement("li");
    actorLi.innerHTML = `
        <img src="${BACKDROP_BASE_URL + cast[i].profile_path}" alt="${cast[i].title
      } poster">
        <h3>${cast[i].name}</h3>`;
    actorsUl.appendChild(actorLi);
  }
};

//Renders 5 similar movies
const renderSimilar = (movies) => {
  const similarMovies = movies.results
  const similarUl = document.querySelector("#similar")

  for (let i = 0; i < 5; i++) {
    const similarLi = document.createElement("li");
    similarLi.innerHTML = `
        <img src="${BACKDROP_BASE_URL + similarMovies[i].poster_path}" alt="${similarMovies[i].original_title
      } poster">
        <h3>${similarMovies[i].original_title
      }</h3>`;
    similarUl.appendChild(similarLi);
  }
};

// You'll need to play with this function in order to add features and enhance the style.
// Renders a single movie
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path}>
        </div>

        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
            <h3>Similar Movies:</h3>
            <ul id="similar" class="list-unstyled"></ul>
            <h3>Production Company:</h3>
            <div>
            <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.production_companies[0].logo_path}>
            <h3>${movie.production_companies[0].name}</h3>
            </div>
    </div>`;
};

////////////////////test fetch////////////////
fetch('https://api.themoviedb.org/3/person/popular?api_key=476f803b63576c60c48c20f0ba1cd92d') //popular people
// fetch("https://api.themoviedb.org/3/movie/550?api_key=476f803b63576c60c48c20f0ba1cd92d")
  .then(res => res.json())
  .then(data => console.log(data))

///////////////////////////////////////////
document.addEventListener("DOMContentLoaded", autorun);
homeBtn.addEventListener("click", autorun)
