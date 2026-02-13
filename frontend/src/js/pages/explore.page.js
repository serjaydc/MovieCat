import { fetchTrendingMovies } from "../controllers/movie_controller.js";
import { fetchUserlist } from "../controllers/userlist_controller.js";
import {
  addItemToUserlist,
  removeItemFromUserlist,
} from "../controllers/userlist_controller.js";

let userlist = [];

const displayTrendingMovies = async () => {
  const data = await fetchTrendingMovies();
  userlist = await fetchUserlist();

  const results = data?.results || [];
  if (!results.length) throw new Error("No movies returned");

  const moviesCards = document.querySelector(".shows__cards");

  moviesCards.innerHTML = results
    .map((movie) => {
      const item = userlist.find((item) => item.tmdb_id === movie.id);
      console.log(movie);

      return `
        <a href="singlemovie.html?id=${movie.id}&type=${movie.media_type}"
          class="movie-card"
          data-tmdb-id="${movie.id}"
          data-media-type="${movie.media_type}"
          data-title="${movie.title || movie.name}"
          data-poster-path="${movie.poster_path}"
          data-release-date="${movie.release_date || ""}"
          data-vote-average="${movie.vote_average || ""}"
        >
          <img 
            src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" 
            alt="${movie.title || movie.name}" 
            class="movie-card__img"
          />

          <div class="movie-card__info">
            <div class="movie-card__text">
              <h3 class="movie-card__title">
                ${movie.title || movie.name}
              </h3>

              <div class="movie-card__details">
                <p>${movie.vote_average ? movie.vote_average.toFixed(1) : ""}</p>
                <p>${movie.release_date ? movie.release_date.slice(0, 4) : ""}</p>
              </div>
            </div>

            <button class="btn btn-addToList">
              ${
                item
                  ? `Remove From List`
                  : `<i class="fa-solid fa-plus"></i> Add To List`
              }
            </button>
          </div>
        </a>
      `;
    })
    .join("");
};

document.addEventListener("click", async (e) => {
  const button = e.target.closest(".btn-addToList");
  if (!button) return;

  e.preventDefault();
  e.stopPropagation();

  const container = button.closest(".movie-card");

  if (!container) return;

  const tmdbId = parseInt(container.dataset.tmdbId);

  const token = localStorage.getItem("token");

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
    if (!token) {
      notyf.error("You must be logged in to add to your list.");
      return;
    }

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

export const initExplore = async () => {
  await displayTrendingMovies();
};
