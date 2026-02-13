import {
  fetchRandomMovie,
  fetchTrendingMovies,
} from "../controllers/movie_controller.js";
import {
  fetchUserlist,
  removeItemFromUserlist,
} from "../controllers/userlist_controller.js";
import { initSwiper } from "../ui/slider.js";
import { addItemToUserlist } from "../controllers/userlist_controller.js";

const displayHeroMovie = async () => {
  const movie = await fetchRandomMovie();
  const userlist = await fetchUserlist();
  const hero = document.querySelector(".hero");
  const heroWrapper = document.querySelector(".hero__wrapper");

  hero.style.backgroundImage = `
  linear-gradient(
    to bottom,
    var(--bg-secondary),
    var(--bg-primary)
  ),
  url(https://image.tmdb.org/t/p/w1280/${movie.backdrop_path})
`;

  heroWrapper.innerHTML = `
  <div 
    class="hero__content"
    data-tmdb-id="${movie.id}"
    data-media-type="movie"
    data-title="${movie.title}"
    data-poster-path="${movie.poster_path}"
    data-release-date="${movie.release_date || ""}"
    data-vote-average="${movie.vote_average || ""}"
    data-liked="${movie.liked}"
  >
    <div class="hero__details">
      <h2 class="hero__title">${movie.title}</h2>
      <p class="hero__overview">${movie.overview}</p>
    </div>

    <div class="hero__cta">
      <button class="btn btn-addToList">
        ${userlist.find((item) => item.tmdb_id === movie.id) ? `<i class="fa-solid fa-check"></i> In The List` : `<i class="fa-solid fa-plus"></i> Add To List`}
      </button>

      <a href="singlemovie.html?id=${movie.id}&type=movie" class="btn btn-secondary">
        <i class="fa-regular fa-circle-question"></i>
        More Info
      </a>
    </div>

    <ul class="hero__info">
      <li>${movie.adult === false ? "PG-13" : "PG-18"}</li>
      <li>${movie.runtime ? `${(movie.runtime / 60).toFixed(0)}h ${movie.runtime % 60}m` : ""}</li>
      <li>${movie.release_date ? movie.release_date.slice(0, 4) : ""}</li>
      <li>${movie.genres.map((genre) => genre.name).join(" • ")}</li>
    </ul>
  </div>
`;
};

const displaySwiperMovies = async () => {
  const data = await fetchTrendingMovies();
  const userlist = await fetchUserlist();
  const swiper = document.querySelector(".swiper--movie");
  const swiperWrapper = document.querySelector(".swiper-wrapper");

  data.results.forEach((movie) => {
    swiperWrapper.innerHTML += `
      <div class="swiper-slide">
        <a href="singlemovie.html?id=${movie.id}&type=movie" class="content-card" data-tmdb-id="${movie.id}" data-media-type="movie" data-title="${movie.title || movie.name}" data-poster-path="${movie.poster_path}" data-release-date="${movie.release_date || ""}" data-vote-average="${movie.vote_average || ""}">
          <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title || movie.name}" />
          <div class="content-card__info">
          <div class="content-card__text">
          <h3 class="content-card__title">${movie.title || movie.name}</h3>
          <div class="content-card__details">
            <p>${movie.vote_average ? movie.vote_average.toFixed(1) : ""}</p>
            <p>${movie.release_date ? movie.release_date.slice(0, 4) : ""}</p>
          </div>
          </div>
            <button class="btn btn-addToList">${userlist.find((item) => item.tmdb_id === movie.id) ? ` Remove From List` : `<i class="fa-solid fa-plus"></i> Add To List`}</button>
          </div>
        </a>
      </div>
      `;
  });

  initSwiper(swiper);
};

document.addEventListener("click", async (e) => {
  const button = e.target.closest(".btn-addToList, .btn-watched, .btn-like");
  if (!button) return;

  e.preventDefault();
  e.stopPropagation();

  const container =
    button.closest(".content-card") || button.closest(".hero__content");

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

export const initHome = () => {
  displayHeroMovie();
  displaySwiperMovies();
};
