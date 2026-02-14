import { fetchTrendingMovies } from "../controllers/movie_controller.js";
import { fetchUserlist } from "../controllers/userlist_controller.js";
import {
  addItemToUserlist,
  removeItemFromUserlist,
} from "../controllers/userlist_controller.js";
import { notyf } from "../ui/notyf.js";

let currentPage = 1;
const itemsPerPage = 8;

let allMovies = [];
let filtersState = {
  type: "all",
  year: "all",
  genre: "all",
  sort: "rating",
};

const GENRES = {
  action: 28,
  comedy: 35,
  drama: 18,
  horror: 27,
  mystery: 9648,
  romance: 10749,
  thriller: 53,
};

const initSearch = () => {
  const searchInput = document.querySelector(".shows__search-field input");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      currentPage = 1;
      filterAndSort();
      return;
    }

    const filtered = allMovies.filter((movie) => {
      const title = (movie.title || movie.name || "").toLowerCase();
      return title.includes(query);
    });

    renderSearchResults(filtered);
  });
};

const renderSearchResults = async (movies) => {
  const userlist = await fetchUserlist();

  const totalPages = Math.ceil(movies.length / itemsPerPage);

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const paginated = movies.slice(start, end);

  renderMovies(paginated, userlist);
  renderPagination(totalPages);
};

const filterAndSort = async () => {
  const userlist = await fetchUserlist();
  let filteredMovies = [...allMovies];

  if (filtersState.type !== "all") {
    filteredMovies = filteredMovies.filter(
      (movie) => movie.media_type === filtersState.type,
    );
  }

  if (filtersState.year !== "all") {
    filteredMovies = filteredMovies.filter(
      (movie) => movie.release_date?.slice(0, 4) === filtersState.year,
    );
  }

  if (filtersState.genre !== "all") {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.genre_ids?.includes(GENRES[filtersState.genre]),
    );
  }

  switch (filtersState.sort) {
    case "rating":
      filteredMovies.sort((a, b) => b.vote_average - a.vote_average);
      break;

    case "year":
      filteredMovies.sort((a, b) => {
        const aYear = a.release_date?.slice(0, 4) || 0;
        const bYear = b.release_date?.slice(0, 4) || 0;
        return bYear - aYear;
      });
      break;

    case "title":
      filteredMovies.sort((a, b) => {
        const aTitle = a.title || a.name;
        const bTitle = b.title || b.name;
        return aTitle.localeCompare(bTitle);
      });
      break;

    case "children":
      filteredMovies = filteredMovies.filter((movie) => movie.adult === false);
      break;

    case "adults":
      filteredMovies = filteredMovies.filter((movie) => movie.adult === true);
      break;

    default:
      break;
  }

  // PAGINATION
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

  if (currentPage > totalPages) {
    currentPage = 1;
  }

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const paginatedMovies = filteredMovies.slice(start, end);

  renderMovies(paginatedMovies, userlist);
  renderPagination(totalPages);
};

const filterShows = () => {
  const filter = document.querySelector(".shows__filter");

  filter.addEventListener("click", (e) => {
    const button = e.target.closest(".btn-filter");
    if (!button) return;

    const group = button.closest(".filter-group");
    const groupTitle = group.querySelector("h4").textContent;

    // снимаем active у соседей
    group
      .querySelectorAll(".btn-filter")
      .forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const value = button.textContent.toLowerCase();

    if (groupTitle === "Type") {
      filtersState.type =
        value === "movies" ? "movie" : value === "tv shows" ? "tv" : "all";
    }

    if (groupTitle === "Year") {
      filtersState.year = value === "all" ? "all" : value;
    }

    if (groupTitle === "Sort By") {
      filtersState.sort = value;
    }

    if (groupTitle === "Genre") {
      filtersState.genre = value === "all" ? "all" : value;
    }

    currentPage = 1;
    filterAndSort();
  });
};

const renderPagination = (totalPages) => {
  const paginationContainer = document.querySelector(".pagination");

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let buttons = "";

  for (let i = 1; i <= totalPages; i++) {
    buttons += `
      <button class="btn btn-page ${
        i === currentPage ? "active" : ""
      }" data-page="${i}">
        ${i}
      </button>
    `;
  }

  paginationContainer.innerHTML = buttons;
};

const displayTrendingMovies = async () => {
  const data = await fetchTrendingMovies();
  allMovies = data?.results || [];

  if (!allMovies.length) throw new Error("No movies returned");

  filterAndSort();
};

const renderMovies = (movies, userlist) => {
  const moviesCards = document.querySelector(".shows__cards");

  moviesCards.innerHTML = movies
    .map((movie) => {
      const item = userlist.find((item) => item.tmdb_id === movie.id);

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
                <p>${movie.vote_average?.toFixed(1) || ""}</p>
                <p>${movie.release_date?.slice(0, 4) || ""}</p>
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

const hideShowFilters = () => {
  const filter = document.querySelector(".shows__filter");
  const btn = document.querySelector(".btn-options");

  btn.addEventListener("click", () => {
    filter.classList.toggle("active");
  });
};

document.addEventListener("click", (e) => {
  const pageBtn = e.target.closest(".btn-page");
  if (!pageBtn) return;

  currentPage = Number(pageBtn.dataset.page);
  filterAndSort();

  window.scrollTo({ top: 0, behavior: "smooth" });
});

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

  if (!token) {
    notyf.error("You must be logged in to add to your list.");
    return;
  }

  if (!existingItem) {
    const created = await addItemToUserlist(newItem);

    if (created) {
      button.innerHTML = `<i class="fa-solid fa-check"></i> In The List`;
    }
  } else {
    const deleted = await removeItemFromUserlist(existingItem.id);

    if (deleted) {
      button.innerHTML = `<i class="fa-solid fa-plus"></i> Add To List`;
    }
  }
});

export const initExplore = async () => {
  await displayTrendingMovies();
  filterShows();
  initSearch();
  hideShowFilters();
};
