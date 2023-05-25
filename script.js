"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
////////////////////////////////////////////////////////////////
const apiKey = "476f803b63576c60c48c20f0ba1cd92d";
const homeBtn = document.querySelector("#homeBtn");
const searchBar = document.querySelector("#default-search")
const genreBtn = document.querySelector(".genreBtn");
const aboutBtn = document.querySelector("#aboutBtn");


// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  const genreList = await fetchGenreList();
  renderMovies(movies.results, genreList);
};

// Home Page: Movies List Page

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies, genreList) => {
  CONTAINER.innerHTML = ``; // Cleans page
  const moviesContainer = document.createElement("div")
  const pageHeader = document.createElement("h1")
  pageHeader.textContent = `FEATURED MOVIES`
  pageHeader.setAttribute("class", "text-center text-amber-400 text-3xl text-bold mb-10")
  CONTAINER.appendChild(pageHeader)
  movies.map((movie) => {
    const genreIdbyMovie = movie.genre_ids
    const genreId = genreList.genres
    let genreListByMovie = []

    for (let i = 0; i < genreIdbyMovie.length; i++) {
      for (let j = 0; j < genreId.length; j++) {
        if (genreIdbyMovie[i] == genreId[j].id) {
          genreListByMovie.push(genreId[j].name)
        }
      }
    }
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <div class="h-[200px] sm:h-[350px] md:h-[200px] xl:h-[250px] 2xl:h-[300px]" style="background-image: url(${BACKDROP_BASE_URL + movie.backdrop_path}); background-size: cover; background-position: center; background-repeat: no-repeat; ">
          <div class="card-info">
            <h1 class="lg:text-xl md:text-lg text-2xl font-extrabold mb-4 text-amber-400">${movie.title}</h1>
            <h3 class="lg:text-base md:text-sm">Genres: ${genreListByMovie.join(", ")}</h3>
            <h3 class="lg:text-base md:text-sm">Rating: ${movie.vote_average}</h3>
          </div>
        </div>
        `;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    movieDiv.setAttribute("class", "card")
    moviesContainer.setAttribute("class", "grid md:grid-cols-2 lg:grid-cols-3 gap-4")
    moviesContainer.appendChild(movieDiv);
  });
  CONTAINER.appendChild(moviesContainer);
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
  <h2 id="movie-title" class="text-amber-400 text-center p-6 mb-6 text-4xl">${movie.title}</h2>
<div class="text-white grid justify-center gap-10 mb-10">

  <div class="grid md:grid-cols-2 gap-4">
    <div class="">
    <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path}>
    </div>

    <div class="grid gap-2 lg:gap-0 lg:text-xl lg:py-4 text-slate-400">
   <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
   <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
   <p id="movie-overview"> <b>Overview:</b> ${movie.overview}</p>
   <p><b>Language:</b> ${movie.spoken_languages[0].name}</p>
    </div>

  </div>

  <div id="trailer" class="justify-self-center">
  </div>

</div>

<div class="text-amber-400 text-center mb-10">
  <h3 class="p-2 text-2xl">ACTORS</h3>
  <ul id="actors" class="list-unstyled grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4"></ul>
</div>

<div class="text-amber-400 text-center mb-10">
  <h3 class="pb-6 text-2xl">SIMILAR MOVIES</h3>
  <ul id="similar" class="list-unstyled grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4"></ul>
</div>

<div class="text-amber-400 text-center grid gap-2">
  <h3 class="p-2 text-2xl">PRODUCTION COMPANY</h3>
    <div class="w-1/6 justify-self-center">
      <img  id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.production_companies[0].logo_path}>
      <h3 class="mt-4 text-slate-400">${movie.production_companies[0].name}</h3>
    </div>
</div>

    `;
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
    actorLi.setAttribute("class", "card text-slate-400")
    actorLi.innerHTML = `
        <img src="${BACKDROP_BASE_URL + cast[i].profile_path}" alt="${cast[i].title
      } poster">
        <h3 class="pt-2">${cast[i].name}</h3>`;
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
    similarLi.setAttribute("class", "card text-slate-400")
    similarLi.innerHTML = `
        <img src="${BACKDROP_BASE_URL + similarMovies[i].poster_path}" alt="${similarMovies[i].original_title
      } poster">
        <h3 class="pt-2">${similarMovies[i].original_title}</h3>`;
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
      iFrame.setAttribute("class", "video")
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
  const actorsContainer = document.createElement("div")
  const pageHeader = document.createElement("h1")
  pageHeader.textContent = `POPULAR ACTORS`
  pageHeader.setAttribute("class", "text-center text-amber-400 text-3xl text-bold mb-10")
  CONTAINER.appendChild(pageHeader)
  actors.results.map((actor) => {
    const actorDiv = document.createElement("div");
    if (actor.known_for_department === "Acting") {
      actorDiv.innerHTML = `
              <img src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name
        } poster">
              <h3 class="text-center mt-3 text-amber-400 font-bold">${actor.name}</h3>`;
      actorDiv.addEventListener("click", () => {
        actorDetails(actor.id);
      });
      actorDiv.setAttribute("class", "card pb-3 w-8/12  bg-stone-950")
      actorsContainer.appendChild(actorDiv)
    } else {
      actorDiv.remove()
    }
    actorsContainer.setAttribute("class", "grid md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6")

    CONTAINER.appendChild(actorsContainer);
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

const renderMoviesByGenre = (movies, genreId, genreList) => {
  CONTAINER.innerHTML = ``; // Cleans page
  const moviesContainer = document.createElement("div")
  const pageHeader = document.createElement("h1")
  pageHeader.textContent = `FEATURED MOVIES`
  pageHeader.setAttribute("class", "text-center text-amber-400 text-3xl text-bold mb-10")
  CONTAINER.appendChild(pageHeader)
  movies.map((movie) => {

    const genreIdbyMovie = movie.genre_ids
    const genreId = genreList.genres
    let genreListByMovie = []

    for (let i = 0; i < genreIdbyMovie.length; i++) {
      for (let j = 0; j < genreId.length; j++) {
        if (genreIdbyMovie[i] == genreId[j].id) {
          genreListByMovie.push(genreId[j].name)
          pageHeader.textContent = `${genreId[j].name}`
        }
      }
    }
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <div class="h-[200px] sm:h-[350px] md:h-[200px] xl:h-[250px] 2xl:h-[300px]" style="background-image: url(${BACKDROP_BASE_URL + movie.backdrop_path}); background-size: cover; background-position: center; background-repeat: no-repeat; ">
          <div class="card-info">
            <h1 class="lg:text-xl md:text-lg text-2xl font-extrabold mb-4 text-amber-400">${movie.title}</h1>
            <h3 class="lg:text-base md:text-sm">Genres: ${genreListByMovie.join(", ")}</h3>
            <h3 class="lg:text-base md:text-sm">Rating: ${movie.vote_average}</h3>
          </div>
        </div>
        `;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    movieDiv.setAttribute("class", "card")
    moviesContainer.setAttribute("class", "grid md:grid-cols-2 lg:grid-cols-3 gap-4")
    moviesContainer.appendChild(movieDiv);
  });
  CONTAINER.appendChild(moviesContainer);
  // CONTAINER.innerHTML = ``; // Cleans page
  // const moviesList = movies.results;
  // // console.log(moviesList);
  // for (let i = 0; i < moviesList.length; i++) {
  //   const movie = moviesList[i];
  //   const movieDiv = document.createElement("div");
  //   movieDiv.innerHTML = `
  //     <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title
  //     } poster">
  //     <h3>${movie.title}</h3>
  //     `;

  //   movieDiv.addEventListener("click", () => {
  //     movieDetails(movie);
  //   });
  //   CONTAINER.appendChild(movieDiv);
  // }
};

const genreDropdown = async () => {
  const genres = await fetchGenreList();
  renderGenreList(genres);
};

const moviesByGenreDropdown = async (genreId) => {
  const movies = await fetchMoviesByGenre(genreId);
  const genreList = await fetchGenreList()
  renderMoviesByGenre(movies.results, genreId, genreList);
};

// Single Actor Page

const fetchSingleActor = async (actorId) => {
  const url = constructUrl(`person/${actorId}`);
  const res = await fetch(url);
  return res.json();
};

const renderSingleActor = (actor) => {
  CONTAINER.innerHTML = ``; // Cleans page
  let gender;
  if (actor.gender === 2) {
    gender = "Male";
  } else {
    gender = "Female";
  }

  let birthDeath;
  if (actor.deathday === null) {
    birthDeath = `${actor.birthday} / -`
  } else {
    birthDeath = `${actor.birthday} / ${actor.deathday}`
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

  <h2>Birthday / Deathday:</h2>
  <p>${birthDeath}</p>
  
<ul id="related-movies"></ul>
  `;

  CONTAINER.appendChild(actorDiv);

  // if (actor.deathday !== null) {
  //   CONTAINER.appendChild(birthDeath);
  // }
};

const fetchActorMovies = async (actorId) => {
  const url = constructUrl(`person/${actorId}/combined_credits`);
  const res = await fetch(url);
  return res.json();
};

const renderActorMovies = (movies) => {
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

// Searchbar
const fetchSearchMovies = async (keyword) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=476f803b63576c60c48c20f0ba1cd92d&query=${keyword}`
  );
  return res.json();
};

const fetchSearchActors = async (keyword) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/person?api_key=476f803b63576c60c48c20f0ba1cd92d&query=${keyword}`
  );
  return res.json();
};
const renderSearchResults = (movies, actors) => {
  const searchResultDropdown = document.querySelector("#searchResultDropdown");
  searchResultDropdown.innerHTML = ``;
  const moviesList = movies.results;
  const actorsList = actors.results;

  if (moviesList.length === 0 && actorsList.length === 0) {
    searchResultDropdown.innerHTML = `
    <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">No Matching Results</button>`;
  } else {
    if (movies.total_results !== 0) {
      for (let i = 0; i < 8; i++) {
        const movieLink = document.createElement("li");
        if (moviesList[i] !== undefined && moviesList[i].overview !== "") {
          movieLink.innerHTML = `
        <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">${moviesList[i].title}</button>`;

          movieLink.addEventListener("click", () => {
            movieDetails(moviesList[i]);
          });
          searchResultDropdown.appendChild(movieLink);
        }
      }
    }

    if (actors.total_results !== 0) {
      for (let i = 0; i < 8; i++) {
        const actorLink = document.createElement("li");
        if (
          actorsList[i].known_for_department === "Acting" &&
          actorsList[i] !== undefined &&
          actorsList[i].profile_path !== null
        ) {
          actorLink.innerHTML = `
        <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">${actorsList[i].name}</button>`;
          actorLink.addEventListener("click", () => {
            actorDetails(actorsList[i].id);
          });
          searchResultDropdown.appendChild(actorLink);
        }
      }
    }
  }
};
const search = async (e) => {
  const movieRes = await fetchSearchMovies(e.target.value);
  const actorRes = await fetchSearchActors(e.target.value);
  renderSearchResults(movieRes, actorRes);
  // renderActorResults(actorRes)
};
const aboutPage = () => {

  CONTAINER.innerHTML = ``

}

//Hero Header
const renderHero = (movies) => {
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  const movie = movies.results[getRandomInt(19)]
  const heroSection = document.querySelector("#hero")
  heroSection.setAttribute("style", `background-image: url(${BACKDROP_BASE_URL + movie.backdrop_path}); background-size: cover; background-position: center; background-repeat: no-repeat;`)

  heroSection.innerHTML = `
  
    <div id="hero-info" class="grid md:grid-cols-1 lg:grid-cols-2 gap-12  p-6">
      <div class="grid justify-items-end content-center">
       <img class="w-4/6 " src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="">
      </div>
      <div class="grid gap-4 w-4/6 content-center">
        <h1 class="text-amber-400 text-3xl font-bold">${movie.original_title}</h1>
        <p class="text-slate-300">"${movie.overview
    }"</p>
        <button id="hero-button" class="text-2xl hover:text-amber-400">Go to Movie</button>
      </div>
    </div>
  
  `
  document.querySelector("#hero-button").addEventListener("click", async () => {
    const targetMovie = await fetchMovie(movie.id)
    movieDetails(targetMovie)
  })
}

const heroHeader = async () => {
  const movies = await fetchMovies();
  renderHero(movies)
}
heroHeader()


////////////////////test fetch////////////////

// fetch(
//   "https://api.themoviedb.org/3/movie/now_playing?api_key=476f803b63576c60c48c20f0ba1cd92d"
//   // "https://api.themoviedb.org/3/movie/500?api_key=476f803b63576c60c48c20f0ba1cd92d"
//   // https://api.themoviedb.org/3/genre/movie/list?api_key=[MY_KEY]&language=en-US
// ).then((res) => res.json())
//   .then((data) => console.log(data));

///////////////////////////////////////////
document.addEventListener("DOMContentLoaded", autorun);
homeBtn.addEventListener("click", autorun);
actorsBtn.addEventListener("click", actorsPage);
searchBar.addEventListener("keyup", search)
genreBtn.addEventListener("click", genreDropdown);
searchBar.addEventListener("keyup", search);
aboutBtn.addEventListener("click", aboutPage)
