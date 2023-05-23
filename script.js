"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
////////////////////////////////////////////////////////////////
const apiKey = "476f803b63576c60c48c20f0ba1cd92d";
const homeBtn = document.querySelector("#homeBtn");
const genreBtn = document.querySelector(".genreBtn");

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Home Page: Movies List Page

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  CONTAINER.innerHTML = ``; // Cleans page
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>
        `;

    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// Single Movie Page: single movie details are presented.

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
// Renders a single movie
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>

        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
            <h3>Language:</h3>
            <p>${movie.spoken_languages[0].name}</p>
        </div>

        <div id="trailer"></div>
        
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
            <h3>Similar Movies:</h3>
            <ul id="similar" class="list-unstyled"></ul>
            <h3>Production Company:</h3>
            <div>
            <img id="movie-backdrop" src=${
              BACKDROP_BASE_URL + movie.production_companies[0].logo_path
            }>
            <h3>${movie.production_companies[0].name}</h3>
            </div>
    </div>`;
};

// This function is to fetch Actors.
const fetchActors = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
};

//Renders 5 Actors
const renderActors = (actors) => {
  const cast = actors.cast;
  const actorsUl = document.querySelector("#actors");

  for (let i = 0; i < 5; i++) {
    const actorLi = document.createElement("li");
    actorLi.innerHTML = `
        <img src="${BACKDROP_BASE_URL + cast[i].profile_path}" alt="${
      cast[i].title
    } poster">
        <h3>${cast[i].name}</h3>`;
    actorsUl.appendChild(actorLi);
    actorLi.addEventListener("click", () => {
      actorDetails(cast[i].id);
    });
  }
};

// This function is to fetch similar actors.
const fetchSimilar = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/similar`);
  const res = await fetch(url);
  return res.json();
};

//Renders 5 similar movies
const renderSimilar = (movies) => {
  const similarMovies = movies.results;
  const similarUl = document.querySelector("#similar");

  for (let i = 0; i < 5; i++) {
    const similarLi = document.createElement("li");
    similarLi.innerHTML = `
        <img src="${BACKDROP_BASE_URL + similarMovies[i].poster_path}" alt="${
      similarMovies[i].original_title
    } poster">
        <h3>${similarMovies[i].original_title}</h3>`;
    similarLi.addEventListener("click", () => {
      movieDetails(similarMovies[i]);
    });
    similarUl.appendChild(similarLi);
  }
};

const fetchMovieTrailer = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/videos`);
  const res = await fetch(url);
  return res.json();
};

const renderTrailer = (videos) => {
  let trailerKey;
  const trailerDiv = document.querySelector("#trailer");
  const videoList = videos.results;
  for (let i = 0; i < videoList.length; i++) {
    const element = videoList[i].name;

    if (element === "Official Trailer") {
      trailerKey = videoList[i].key;
      const sourceLink = `https://www.youtube.com/embed/${trailerKey}`;
      const iFrame = document.createElement("iframe");
      iFrame.setAttribute("src", sourceLink);
      trailerDiv.appendChild(iFrame);
    }
  }
};

// You may need to add to this function, definitely don't delete it.
// Creates Single Movie Page
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);

  const castRes = await fetchActors(movie.id);
  renderActors(castRes);

  const similarRes = await fetchSimilar(movie.id);
  renderSimilar(similarRes);

  const trailerRes = await fetchMovieTrailer(movie.id);
  renderTrailer(trailerRes);
};

// Actor List Page

const fetchActorList = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  return res.json();
};

const renderActorsList = (actors) => {
  CONTAINER.innerHTML = ``; // Cleans page
  // console.log(actors)
  actors.results.map((actor) => {
    const actorDiv = document.createElement("div");

    if (actor.known_for_department === "Acting") {
      actorDiv.innerHTML = `
              <img src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${
        actor.name
      } poster">
              <h3>${actor.name}</h3>`;
      actorDiv.addEventListener("click", () => {
        actorDetails(actor.id);
      });
    }
    CONTAINER.appendChild(actorDiv);
  });
};

const actorsPage = async () => {
  const actors = await fetchActorList();
  renderActorsList(actors);
};

// Genre List Dropdown

const fetchGenreList = async () => {
  const url = constructUrl(`genre/movie/list`);
  const res = await fetch(url);
  return res.json();
};

const fetchMoviesByGenre = async (genreId) => {
  const url = `${TMDB_BASE_URL}/discover/movie?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}&with_genres=${genreId}`;
  const res = await fetch(url);
  return res.json();
};

const renderGenreList = (genresObj) => {
  const genreUl = document.querySelector("#genre-list");
  let genreLi;
  const genresList = genresObj.genres;
  genreUl.innerHTML = ``;
  for (let i = 0; i < genresList.length; i++) {
    genreLi = document.createElement("li");
    const genre = genresList[i];
    genreLi.innerHTML = `
    <a
  href="#"
  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">${genre.name}</a>
   `;
    genreLi.addEventListener("click", () => {
      moviesByGenreDropdown(genre.id);
    });
    genreUl.appendChild(genreLi);
  }
};

const renderMoviesByGenre = (movies) => {
  CONTAINER.innerHTML = ``; // Cleans page
  const moviesList = movies.results;
  console.log(moviesList);
  for (let i = 0; i < moviesList.length; i++) {
    const movie = moviesList[i];
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
      <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
      <h3>${movie.title}</h3>
      `;

    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  }
};

const genreDropdown = async () => {
  const genres = await fetchGenreList();
  renderGenreList(genres);
};

const moviesByGenreDropdown = async (genreId) => {
  const movies = await fetchMoviesByGenre(genreId);
  renderMoviesByGenre(movies);
};



// Single Actor Page

const fetchSingleActor = async (actorId) => {
  const url = constructUrl(`person/${actorId}`);
  const res = await fetch(url);
  return res.json();
};

const renderSingleActor = (actor) => {
  CONTAINER.innerHTML = ``; // Cleans page
  const birthDeath = document.createElement("div");

  birthDeath.innerHTML = `
  <h2>Death:</h2>
  <p>${actor.deathday}</p>
  `;

  let gender;
  if (actor.gender === 2) {
    gender = "Male";
  } else {
    gender = "Female";
  }

  const actorDiv = document.createElement("div");
  actorDiv.innerHTML = `
  <img src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${
    actor.name
  } poster">
  <h1>${actor.name}</h1>
  <h2>Gender:</h2>
  <p>${gender}</p>
  
  <h2>Popularity:</h2>
  <p>${actor.popularity}</p>
  
  <h2>Biography:</h2>
  <p>${actor.biography}</p>

  <h2>Birthday:</h2>
  <p>${actor.birthday}</p>
  
<ul id="related-movies"></ul>
  `;

  CONTAINER.appendChild(actorDiv);

  if (actor.deathday !== null) {
    CONTAINER.appendChild(birthDeath);
  }
};

const fetchActorMovies = async (actorId) => {
  const url = constructUrl(`person/${actorId}/combined_credits`);
  const res = await fetch(url);
  return res.json();
};

const renderActorMovies = (movies) => {
  console.log(movies.cast);
  const relatedMovies = document.querySelector("#related-movies");
  // console.log(relatedMovies);
  for (let i = 0; i < 5; i++) {
    const actorLi = document.createElement("li");
    actorLi.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movies.cast[i].poster_path}" alt="${
      movies.cast[i].original_title
    } poster">
        <h3>${movies.cast[i].original_title}</h3>`;

    actorLi.addEventListener("click", () => {
      // console.log(movies);
      movieDetails(movies.cast[i]);
    });
    relatedMovies.appendChild(actorLi);
  }
};

const actorDetails = async (actorId) => {
  const movieRes = await fetchSingleActor(actorId);
  renderSingleActor(movieRes);
  const relatedMovies = await fetchActorMovies(actorId);
  renderActorMovies(relatedMovies);
};

////////////////////test fetch////////////////
// fetch(
//   "https://api.themoviedb.org/3/genre/movie/list?api_key=476f803b63576c60c48c20f0ba1cd92d"
// )
//   // fetch("https://api.themoviedb.org/3/movie/550?api_key=476f803b63576c60c48c20f0ba1cd92d")
//   .then((res) => res.json())
// .then((data) => console.log(data));

fetch(
  "https://api.themoviedb.org/3/discover/movie?api_key=476f803b63576c60c48c20f0ba1cd92d&with_genres=28`"
).then((res) => res.json());
// .then((data) => console.log(data));

///////////////////////////////////////////
document.addEventListener("DOMContentLoaded", autorun);
homeBtn.addEventListener("click", autorun);
actorsBtn.addEventListener("click", actorsPage);
genreBtn.addEventListener("click", genreDropdown);

