import {
  fetchNewReleases,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchTrendingMovies,
} from "../controllers/movie_controller";
import { initSwiper } from "../ui/slider";

import { fetchUserlist } from "../controllers/userlist_controller.js";

const displaySwiperShows = async (swiperClass, fetchFunction, mediaType) => {
  const data = await fetchFunction();
  const userlist = await fetchUserlist();

  const swiper = document.querySelector(`.${swiperClass}`);
  const swiperWrapper = swiper.querySelector(".swiper-wrapper");

  if (!data?.results?.length) return;

  swiperWrapper.innerHTML = "";

  data.results.forEach((movie) => {
    const isInList = userlist.find((item) => item.tmdb_id === movie.id);

    swiperWrapper.innerHTML += `
      <div class="swiper-slide">
        <a href="singlemovie.html?id=${movie.id}&type=${mediaType}"
           class="content-card"
           data-tmdb-id="${movie.id}"
           data-media-type="${mediaType}"
           data-title="${movie.title || movie.name}"
           data-poster-path="${movie.poster_path}"
           data-release-date="${movie.release_date || movie.first_air_date || ""}"
           data-vote-average="${movie.vote_average || ""}">

          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
               alt="${movie.title || movie.name}" />

          <div class="content-card__info">
            <div class="content-card__text">
              <h3 class="content-card__title">
                ${movie.title || movie.name}
              </h3>

              <div class="content-card__details">
                <p>${movie.vote_average ? movie.vote_average.toFixed(1) : ""}</p>
                <p>
                  ${
                    movie.release_date
                      ? movie.release_date.slice(0, 4)
                      : movie.first_air_date
                        ? movie.first_air_date.slice(0, 4)
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

  initSwiper(swiper);
};

export const initNewAndPopular = () => {
  displaySwiperShows("swiper--upcoming", fetchUpcomingMovies, "movie");
  displaySwiperShows("swiper--trending", fetchTrendingMovies, "movie");
  displaySwiperShows("swiper--new", fetchNewReleases, "movie");
  displaySwiperShows("swiper--top", fetchTopRatedMovies, "movie");
};
