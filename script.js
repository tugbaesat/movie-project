"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
////////////////////////////////////////////////////////////////
const apiKey = "476f803b63576c60c48c20f0ba1cd92d";
const homeBtn = document.querySelector("#homeBtn");
const searchBar = document.querySelector("#default-search")
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
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title
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
             <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path
    }>
        </div>

        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date
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
            <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.production_companies[0].logo_path
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
        <img src="${BACKDROP_BASE_URL + cast[i].profile_path}" alt="${cast[i].title
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
        <img src="${BACKDROP_BASE_URL + similarMovies[i].poster_path}" alt="${similarMovies[i].original_title
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
              <img src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name
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
  <img src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name
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
        <img src="${BACKDROP_BASE_URL + movies.cast[i].poster_path}" alt="${movies.cast[i].original_title
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

//Searchbar

const fetchSearchMovies = async (keyword) => {
  const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=476f803b63576c60c48c20f0ba1cd92d&query=${keyword}`);
  return res.json();
};

const fetchSearchActors = async (keyword) => {
  const res = await fetch(`https://api.themoviedb.org/3/search/person?api_key=476f803b63576c60c48c20f0ba1cd92d&query=${keyword}`);
  return res.json();
};

const renderSearchResults = (movies, actors) => {
  const searchResultDropdown = document.querySelector("#searchResultDropdown")
  searchResultDropdown.innerHTML = ``
  const moviesList = movies.results
  const actorsList = actors.results

  if (moviesList.length === 0 && actorsList.length === 0) {
    searchResultDropdown.innerHTML = `
    <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">No Matching Results</button>
    `
  } else {

    if (movies.total_results !== 0) {

      for (let i = 0; i < 8; i++) {
        const movieLink = document.createElement("li")
        if (moviesList[i] !== undefined && moviesList[i].overview !== "") {
          movieLink.innerHTML = `
        <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">${moviesList[i].title}</button>
      `
          movieLink.addEventListener("click", () => {
            movieDetails(moviesList[i]);
          });
          searchResultDropdown.appendChild(movieLink)
        }
      }
    }

    if (actors.total_results !== 0) {
      for (let i = 0; i < 8; i++) {
        const actorLink = document.createElement("li")
        if (actorsList[i].known_for_department === "Acting" && actorsList[i] !== undefined && actorsList[i].profile_path !== null) {

          actorLink.innerHTML = `
        <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">${actorsList[i].name}</button>
      `
          actorLink.addEventListener("click", () => {
            actorDetails(actorsList[i].id);
          });
          searchResultDropdown.appendChild(actorLink)
        }
      }
    }
  }


}

const search = async (e) => {
  const movieRes = await fetchSearchMovies(e.target.value)
  const actorRes = await fetchSearchActors(e.target.value)
  renderSearchResults(movieRes, actorRes)

  // renderActorResults(actorRes)
}


////////////////////test fetch////////////////
// fetch("https://api.themoviedb.org/3/movie/502356/videos?api_key=476f803b63576c60c48c20f0ba1cd92d")
// fetch("https://api.themoviedb.org/3/movie/550?api_key=476f803b63576c60c48c20f0ba1cd92d")
// fetch("https://api.themoviedb.org/3/search/movie?api_key=476f803b63576c60c48c20f0ba1cd92d&query=J")
// .then((res) => res.json())
// .then((data) => console.log(data));

///////////////////////////////////////////
document.addEventListener("DOMContentLoaded", autorun);
homeBtn.addEventListener("click", autorun);
actorsBtn.addEventListener("click", actorsPage);
searchBar.addEventListener("keyup", search)

