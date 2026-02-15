import { fetchDiscoverByGenre } from "../controllers/movie_controller.js";
import { initSwiper } from "../ui/slider.js";
import { fetchUserlist } from "../controllers/userlist_controller.js";

// Display tv shows
const displaySwiperTV = async (media_type, genreId, swiperClass) => {
  const data = await fetchDiscoverByGenre(media_type, genreId);
  const userlist = await fetchUserlist();
  // find swiper container
  const swiper = document.querySelector(`.${swiperClass}`);
  const swiperWrapper = swiper.querySelector(".swiper-wrapper");
  // check if data is empty
  if (!data?.results?.length) return;
  // clear swiper container
  swiperWrapper.innerHTML = "";
  // loop through movies
  data.results.forEach((movie) => {
    const isInList = userlist.find((item) => item.tmdb_id === movie.id);
    // add movie to swiper
    swiperWrapper.innerHTML += `
      <div class="swiper-slide">
        <a href="singlemovie.html?id=${movie.id}&type=tv"
           class="content-card"
           data-tmdb-id="${movie.id}"
           data-media-type="${media_type ? media_type : "tv"}"
           data-title="${movie.title || movie.name}"
           data-poster-path="${movie.poster_path}"
           data-release-date="${movie.release_date || ""}"
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
                <p>${movie.first_air_date ? movie.first_air_date.slice(0, 4) : ""}</p>
              </div>
            </div>

            <button class="btn btn-addToList">
              ${
                isInList
                  ? "Remove From List"
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

export const initTvShows = () => {
  displaySwiperTV("tv", 10759, "swiper--action");
  displaySwiperTV("tv", 10765, "swiper--science-fiction");
  displaySwiperTV("tv", 35, "swiper--comedy");
  displaySwiperTV("tv", 80, "swiper--crime");
  displaySwiperTV("tv", 9648, "swiper--fantasy");
  displaySwiperTV("tv", 10749, "swiper--romance");
  displaySwiperTV("tv", 37, "swiper--thriller");
};
