import {
  fetchMovies,
  fetchTVShows,
  fetchSingleMovie,
  fetchSingleTVShow,
} from "../controllers/movie_controller.js";

import {
  fetchUserlist,
  addItemToUserlist,
  updateItemFromUserlist,
  removeItemFromUserlist,
} from "../controllers/userlist_controller.js";
import { notyf } from "../ui/notyf.js";

import { initSwiper } from "../ui/slider.js";

let userlistState = [];

const syncButtons = (tmdbId) => {
  const container =
    document.querySelector(".show__content") ||
    document.querySelector(".content-card");
  if (!container) return;

  const item = userlistState.find((i) => i.tmdb_id === tmdbId);

  const watchedBtn = document.querySelector(".btn-watched");
  const likeBtn = document.querySelector(".btn-like");
  const listBtn = document.querySelector(".btn-addToList");

  if (!item) {
    watchedBtn?.classList.remove("btn-watched--active");
    likeBtn?.classList.remove("btn-like--active");
    listBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add To List`;
    return;
  }

  watchedBtn?.classList.toggle("btn-watched--active", item.watched);
  likeBtn?.classList.toggle("btn-like--active", item.liked);

  listBtn.innerHTML = `
    ${
      item.in_list !== false
        ? `<i class="fa-solid fa-check"></i> In The List`
        : `<i class="fa-solid fa-plus"></i> Add To List`
    }
  `;
};

/* =========================
   SINGLE MOVIE PAGE
========================= */

const displaySingleMovie = async (id, type) => {
  let media;

  if (type === "movie") {
    media = await fetchSingleMovie(id);
  } else if (type === "tv") {
    media = await fetchSingleTVShow(id);
  } else {
    return;
  }

  const show = document.querySelector(".show");
  const showWrapper = document.querySelector(".show__wrapper");

  show.style.backgroundImage = `
    linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary)),
    url(https://image.tmdb.org/t/p/w1280/${media.backdrop_path})
  `;

  showWrapper.innerHTML = `
    <div 
      class="show__content"
      data-tmdb-id="${media.id}"
      data-media-type="${type === "movie" ? "movie" : "tv"}"
      data-title="${media.title || media.name}"
      data-poster-path="${media.poster_path}"
      data-release-date="${media.release_date || media.first_air_date || ""}"
      data-vote-average="${media.vote_average || ""}">

      <h1 class="show__title">${media.title || media.name}</h1>

      <ul class="show__details">
          <li><i class="fa-solid fa-star"></i> ${
            media.vote_average ? media.vote_average.toFixed(1) : ""
          }</li>
          <li>${
            media.release_date
              ? media.release_date.slice(0, 4)
              : media.first_air_date
                ? media.first_air_date.slice(0, 4)
                : ""
          }</li>
          <li><i class="fa-regular fa-clock"></i> ${
            media.runtime
              ? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}m`
              : media.number_of_seasons
                ? `${media.number_of_seasons} seasons`
                : ""
          }</li>
      </ul>

      <div class="show__genres">
        ${
          media.genres
            ? media.genres
                .map((g) => `<p class="show__genre">${g.name}</p>`)
                .join("")
            : ""
        }
      </div>

      <div class="show__cta">
        <button class="btn btn-addToList">
          <i class="fa-solid fa-plus"></i> Add To List
        </button>

        <button class="btn btn-watched">
          Mark As Watched
        </button>

        <button class="btn btn-like">
          <i class="fa-regular fa-thumbs-up"></i>
        </button>

        <button class="btn btn-share">
          <i class="fa-solid fa-share-nodes"></i>
        </button>
      </div>

      <div class="show__info">
        <h2>Overview</h2>
        <p>${media.overview}</p>
      </div>
    </div>

    ${
      type === "movie"
        ? `    
      <ul class="show__stats">
        <li>
          <span>Budget</span>
          <span><i class="fa-solid fa-sterling-sign"></i> ${media.budget ? media.budget : "N/A"}</span>
        </li>
        <li>
          <span>Revenue</span>
          <span><i class="fa-solid fa-sterling-sign"></i> ${media.revenue.toLocaleString()}</span>
        </li>
        <li>
          <span>Production Companies</span>
          ${media.production_companies.map((c) => `<span>${c.name}</span>`).join("")}
        </li>
      </ul>`
        : ""
    }
  `;

  return media;
};

const displaySwiperSameGenre = async (item) => {
  if (!item) return;

  const type = item.title ? "movie" : "tv";

  let media;

  if (type === "movie") {
    media = await fetchMovies();
  } else {
    media = await fetchTVShows();
  }

  if (!media?.results) return;

  const swiperWrapper = document.querySelector(".swiper-wrapper");
  swiperWrapper.innerHTML = "";

  const currentGenreIds = item.genres.map((g) => g.id);

  const filtered = media.results.filter(
    (m) =>
      m.id !== item.id &&
      m.genre_ids?.some((id) => currentGenreIds.includes(id)),
  );

  filtered.forEach((m) => {
    const isInList = userlistState.find((i) => i.tmdb_id === m.id);

    swiperWrapper.innerHTML += `
      <div class="swiper-slide">
        <a href="singlemovie.html?id=${m.id}&type=${type}"
           class="content-card"
           data-tmdb-id="${m.id}"
           data-media-type="${type}"
           data-title="${m.title || m.name}"
           data-poster-path="${m.poster_path}"
           data-release-date="${m.release_date || m.first_air_date || ""}"
           data-vote-average="${m.vote_average || ""}">
           
          <img src="https://image.tmdb.org/t/p/w500/${m.poster_path}" 
               alt="${m.title || m.name}" />
               
          <div class="content-card__info">
            <div class="content-card__text">
              <h3 class="content-card__title">
                ${m.title || m.name}
              </h3>
              
              <div class="content-card__details">
                <p>${m.vote_average ? m.vote_average.toFixed(1) : ""}</p>
                <p>
                  ${
                    m.release_date
                      ? m.release_date.slice(0, 4)
                      : m.first_air_date
                        ? m.first_air_date.slice(0, 4)
                        : ""
                  }
                </p>
              </div>
            </div>

            <button class="btn btn-addToList">
              ${
                isInList
                  ? `<i class="fa-solid fa-check"></i> In The List`
                  : `<i class="fa-solid fa-plus"></i> Add To List`
              }
            </button>
          </div>
        </a>
      </div>
    `;
  });

  initSwiper(document.querySelector(".swiper--recommended"));
};

document.addEventListener("click", async (e) => {
  const button = e.target.closest(
    ".btn-addToList, .btn-watched, .btn-like, .btn-share",
  );
  if (!button) return;

  const container = button.closest(".show__content" || ".content-card");
  if (!container) return;

  const tmdbId = parseInt(container.dataset.tmdbId);
  let existingItem = userlistState.find((i) => i.tmdb_id === tmdbId);

  const newItem = {
    tmdb_id: tmdbId,
    media_type: container.dataset.mediaType,
    title: container.dataset.title,
    poster_path: container.dataset.posterPath,
    release_date: container.dataset.releaseDate,
    vote_average: container.dataset.voteAverage,
  };

  if (button.classList.contains("btn-share")) {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notyf.success("Link copied to clipboard");
    } catch (error) {
      notyf.error("Failed to copy link");
    }
    return;
  }

  if (button.classList.contains("btn-addToList")) {
    if (!existingItem) {
      const created = await addItemToUserlist(newItem);
      if (!created) return;

      userlistState.push(created);
    } else {
      const deleted = await removeItemFromUserlist(existingItem.id);
      if (!deleted) return;

      userlistState = userlistState.filter((i) => i.id !== existingItem.id);
    }
  }

  if (button.classList.contains("btn-watched")) {
    if (!existingItem) {
      notyf.error("Add item to list first");
      return;
    }
    if (!existingItem) {
      const created = await addItemToUserlist(newItem);
      if (!created) return;
      userlistState.push(created);
    } else {
      const updated = await updateItemFromUserlist(existingItem.id, {
        watched: !existingItem.watched,
      });
      if (!updated) return;
      existingItem.watched = !existingItem.watched;
    }
  }

  if (button.classList.contains("btn-like")) {
    if (!existingItem) {
      notyf.error("Add item to list first");
      return;
    }
    if (!existingItem) {
      const created = await addItemToUserlist(newItem);
      if (!created) return;

      userlistState.push(created);
    } else {
      const updated = await updateItemFromUserlist(existingItem.id, {
        liked: !existingItem.liked,
      });
      if (!updated) return;

      existingItem.liked = !existingItem.liked;
    }
  }

  syncButtons(tmdbId);
});

/* =========================
   INIT PAGE
========================= */

export const initSingle = async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const type = params.get("type");

  if (!id || !type) return;

  userlistState = await fetchUserlist();

  const item = await displaySingleMovie(id, type);

  syncButtons(parseInt(id));

  await displaySwiperSameGenre(item);
};
