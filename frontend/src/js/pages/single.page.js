import {
  fetchMovies,
  fetchTVShows,
  fetchSingleMovie,
} from "../controllers/movie_controller.js";
import { fetchUserlist } from "../controllers/userlist_controller.js";
import {
  addItemToUserlist,
  updateItemFromUserlist,
  removeItemFromUserlist,
} from "../controllers/userlist_controller";
import { initSwiper } from "../ui/slider";

const displaySingleMovie = async (id) => {
  const movie = await fetchSingleMovie(id);
  const userlist = await fetchUserlist();

  const show = document.querySelector(".show");
  const showWrapper = document.querySelector(".show__wrapper");

  show.style.backgroundImage = `
  linear-gradient(
    to bottom,
    var(--bg-secondary),
    var(--bg-primary)
  ),
  url(https://image.tmdb.org/t/p/w1280/${movie.backdrop_path})
`;

  showWrapper.innerHTML = `
  <div 
    class="show__content"
    data-tmdb-id="${movie.id}"
    data-media-type="${movie.media_type}"
    data-title="${movie.title}"
    data-poster-path="${movie.poster_path}"
    data-release-date="${movie.release_date || ""}"
    data-vote-average="${movie.vote_average || ""}"
    data-liked="${movie.liked}">

    <h1 class="show__title">${movie.title || movie.name}</h1>
    <ul class="show__details">
        <li><i class="fa-solid fa-star"></i> ${movie.vote_average ? movie.vote_average.toFixed(1) : ""} (${movie.vote_count} votes)</li>
        <li>${movie.release_date.slice(0, 4) || ""}</li>
        <li><i class="fa-regular fa-clock"></i> ${movie.runtime ? `${(movie.runtime / 60).toFixed(0)}h ${movie.runtime % 60}m` : ""}</li>
    </ul>
    <div class="show__genres">
        ${movie.genres.map((genre) => `<p class="show__genre">${genre.name}</p>`).join("")}
    </div>
    <div class="show__cta">
        <button class="btn btn-addToList">${userlist.find((item) => item.tmdb_id === movie.id) ? `<i class="fa-solid fa-check"></i> In The List` : `<i class="fa-solid fa-plus"></i> Add To List`}</button>
        <button class="btn btn-watched">Mark As Watched</button>
        <button class="btn btn-like"><i class="fa-regular fa-thumbs-up"></i></button>
        <button class="btn btn-share"><i class="fa-solid fa-share-nodes"></i></button>
    </div>
    <div class="show__info">
        <h2>Overview</h2>
        <p>${movie.overview}</p>
    </div>
    <ul class="show__stats">
        <li>
            <span>Budget</span>
            <span><i class="fa-solid fa-dollar-sign"></i> ${movie.budget ? movie.budget.toLocaleString() : ""}</span>
        </li>
        <li>
            <span>Revenue</span>
            <span><i class="fa-solid fa-dollar-sign"></i> ${movie.revenue ? movie.revenue.toLocaleString() : ""}</span>
        </li>
        <li>
            <span>Production Companies</span>
            <span>${movie.production_companies
              .slice(0, 3)
              .map((company) => company.name)
              .join(", ")}</span>
        </li>
    </ul>
  </div>
`;
  return movie;
};

const displaySwiperSameGenre = async (item) => {
  const userlist = await fetchUserlist();
  let data;

  const isMovie = !!item.title;

  if (isMovie) {
    data = await fetchMovies();
  } else {
    data = await fetchTVShows();
  }

  if (!data || !data.results) return;

  const swiperWrapper = document.querySelector(".swiper-wrapper");
  swiperWrapper.innerHTML = "";

  const currentGenreIds = item.genres.map((g) => g.id);

  const filtered = data.results.filter(
    (movie) =>
      movie.id !== item.id &&
      movie.genre_ids?.some((id) => currentGenreIds.includes(id)),
  );

  filtered.forEach((movie) => {
    swiperWrapper.innerHTML += `
      <div class="swiper-slide">
        <a href="singlemovie.html?id=${movie.id}" class="content-card" data-tmdb-id="${movie.id}" data-media-type="${movie.media_type}" data-title="${movie.title || movie.name}" data-poster-path="${movie.poster_path}" data-release-date="${movie.release_date || ""}" data-vote-average="${movie.vote_average || ""}">
          <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title || movie.name}" />
          <div class="content-card__info">
          <div class="content-card__text">
          <h3 class="content-card__title">${movie.title || movie.name}</h3>
          <div class="content-card__details">
            <p>${movie.vote_average ? movie.vote_average.toFixed(1) : ""}</p>
            <p>${movie.release_date ? movie.release_date.slice(0, 4) : ""}</p>
          </div>
          </div>
            <button class="btn btn-addToList">${userlist.find((item) => item.tmdb_id === movie.id) ? `<i class="fa-solid fa-check"></i> In The List` : `<i class="fa-solid fa-plus"></i> Add To List`}</button>
          </div>
        </a>
      </div>
    `;
  });
  initSwiper(document.querySelector(".swiper--recommended"));
};

document.addEventListener("click", async (e) => {
  const button = e.target.closest(".btn-addToList, .btn-watched, .btn-like");
  if (!button) return;

  e.preventDefault();
  e.stopPropagation();

  const container =
    button.closest(".content-card") || button.closest(".show__content");

  if (!container) return;

  const tmdbId = parseInt(container.dataset.tmdbId);

  let userlist = await fetchUserlist();
  let existingItem = userlist.find((item) => item.tmdb_id === tmdbId);

  const newItem = {
    tmdb_id: container.dataset.tmdbId,
    media_type: container.dataset.mediaType,
    title: container.dataset.title,
    poster_path: container.dataset.posterPath,
    release_date: container.dataset.releaseDate,
    vote_average: container.dataset.voteAverage,
  };
  if (button.classList.contains("btn-addToList")) {
    if (!existingItem) {
      const created = await addItemToUserlist(newItem);

      if (created) {
        button.innerHTML = `<i class="fa-solid fa-check"></i> In The List`;
        existingItem = created;
      }
    } else {
      const deleted = await removeItemFromUserlist(existingItem.id);

      if (deleted) {
        button.innerHTML = `<i class="fa-solid fa-plus"></i> Add To List`;
      }
    }
  }
});

export const initSingle = async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const item = await displaySingleMovie(id);

  await displaySwiperSameGenre(item);
};

// REWRITE BUTTONS LOGIC !!!!!!
