import {
  fetchRandomMovie,
  fetchTrendingMovies,
} from "../controllers/movie_controller.js";
import { initSwiper } from "../ui/slider.js";

const displayHeroMovie = async () => {
  const movie = await fetchRandomMovie();
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
  <div class="hero__details">
    <h2 class="hero__title">${movie.title}</h2>
    <p class="hero__overview">${movie.overview}</p>
  </div>
  <div class="hero__cta">
    <button class="btn btn-addToList"><i class="fa-solid fa-plus"></i> Add to List</button>
    <button class="btn btn-secondary"><i class="fa-regular fa-circle-question"></i> More Info</button>
  </div>
  <ul class="hero__info">
    <li>${movie.adult === false ? "PG-13" : "PG-18"}</li>
    <li>${movie.runtime ? `${(movie.runtime / 60).toFixed(0)}h ${movie.runtime % 60}m` : ""}</li>
    <li>${movie.release_date ? movie.release_date.slice(0, 4) : ""}</li>
    <li>${movie.genres.map((genre) => genre.name).join(" • ")}</li>
  </ul>
`;
};

const displaySwiperMovies = async () => {
  const data = await fetchTrendingMovies();
  const swiper = document.querySelector(".swiper--movie");
  const swiperWrapper = document.querySelector(".swiper-wrapper");

  data.results.forEach((movie) => {
    swiperWrapper.innerHTML += `
      <div class="swiper-slide">
        <a href="#" class="content-card">
          <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title || movie.name}" />
          <div class="content-card__info">
          <div class="content-card__text">
          <h3 class="content-card__title">${movie.title || movie.name}</h3>
          <div class="content-card__details">
            <p>${movie.vote_average ? movie.vote_average.toFixed(1) : ""}</p>
            <p>${movie.release_date ? movie.release_date.slice(0, 4) : ""}</p>
          </div></div>
            <button class="btn btn-addToList"><i class="fa-solid fa-plus"></i> Add To List</button>
          </div>
        </a>
      </div>
      `;
  });

  initSwiper(swiper);
};

export const initHome = () => {
  displayHeroMovie();
  displaySwiperMovies();
};
