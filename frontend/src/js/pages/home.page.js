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
import { notyf } from "../ui/notyf.js";

const FAQ = [
  {
    question: "What is MovieCat and who is it for?",
    answer:
      "MovieCat is an online movie management platform designed for users who want to discover, explore and organise movies and TV shows in one place. It is suitable for casual viewers looking for recommendations as well as movie enthusiasts who want to manage personalised watchlists.",
  },
  {
    question: "Do I need to create an account to use MovieCat?",
    answer:
      "Users can browse movies and TV shows without creating an account. However, registration is required to create and manage a personalised list of favourite movies. Authentication ensures that each user's saved content remains secure and private.",
  },
  {
    question: "Where does MovieCat get its movie data from?",
    answer:
      "MovieCat integrates with an external movie database API (TMDB) to retrieve up-to-date information including titles, genres, release dates, ratings and descriptions. This ensures that the content displayed on the platform remains current and accurate.",
  },
  {
    question: "Can I filter and sort movies on the platform?",
    answer:
      "Yes. MovieCat provides filtering and sorting functionality that allows users to organise content by type (movies or TV shows), genre, release year, rating and more. Pagination is also implemented to ensure smooth browsing when viewing large collections of content.",
  },
  {
    question: "Is MovieCat responsive and mobile-friendly?",
    answer:
      "Yes. The platform is fully responsive and designed to work across multiple devices, including desktops, tablets and mobile phones. The user interface adapts to different screen sizes to provide a consistent and user-friendly experience.",
  },
  {
    question: "How is user data protected?",
    answer:
      "MovieCat implements secure authentication and authorisation mechanisms to protect user accounts. Sensitive information such as passwords is securely handled, and only authenticated users can access and modify their personal movie lists.",
  },
];

// Display the hero movie
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

// Display swiper movies
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

// Display faq
const displayFAQ = () => {
  const faqWrapper = document.querySelector(".faq__wrapper");

  faqWrapper.innerHTML = "";

  FAQ.forEach((item) => {
    faqWrapper.innerHTML += `
      <div class="faq__item">
        <div class="faq__question">
          <p class="btn-faq">${item.question}</p>
          <i class="fa-solid fa-chevron-down"></i>
        </div>
        <div class="faq__answer">
          <p>${item.answer}</p>
        </div>
      </div>
    `;
  });
};

// Display and init newsletter
const initNewsletter = () => {
  const newsletterForm = document.querySelector(".newsletter__form");

  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input");
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!input.value) {
      notyf.error("Please enter your email address.");
      return;
    }
    if (!regex.test(input.value)) {
      notyf.error("Please enter a valid email address.");
      return;
    }
    notyf.success("Thanks for subscribing!");
    input.value = "";
  });
};

// Add to list
document.addEventListener("click", async (e) => {
  const button = e.target.closest(".btn-addToList, .btn-watched, .btn-like");
  if (!button) return;

  e.preventDefault();
  e.stopPropagation();

  const container =
    button.closest(".content-card") || button.closest(".hero__content");

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

// FAQ
document.addEventListener("click", (e) => {
  const question = e.target.closest(".faq__question");
  if (!question) return;

  const faqItem = question.closest(".faq__item");
  const answer = faqItem.querySelector(".faq__answer");
  const icon = question.querySelector("i");

  answer.classList.toggle("active");

  if (answer.classList.contains("active")) {
    icon.classList.remove("fa-chevron-down");
    icon.classList.add("fa-x");
  } else {
    icon.classList.remove("fa-x");
    icon.classList.add("fa-chevron-down");
  }
});

export const initHome = () => {
  displayHeroMovie();
  displaySwiperMovies();
  displayFAQ();
  initNewsletter();
};
