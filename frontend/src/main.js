import "./index.scss";

import { initHeader } from "./js/ui/header.js";

import { initLogin, initRegister } from "./js/auth/auth_controllers.js";

import { initHome } from "./js/pages/home.page.js";
import { initMyList } from "./js/pages/mylist.page.js";
import { initSingle } from "./js/pages/single.page.js";
import { initMovieShows } from "./js/pages/movies.page.js";
import { initTvShows } from "./js/pages/tv.page.js";
import { initNewAndPopular } from "./js/pages/newandpopular.page.js";
import { displayProfile } from "./js/pages/profile.page.js";
import { initExplore } from "./js/pages/explore.page.js";
import { initPasswordStrength, initShowPassword } from "./js/ui/auth.js";

const page = document.body.dataset.page;

document.addEventListener("DOMContentLoaded", () => {
  initHeader();

  switch (page) {
    case "login":
      initLogin();
      initShowPassword();
      break;
    case "register":
      initRegister();
      initShowPassword();
      initPasswordStrength();
      break;
    case "profile":
      displayProfile();
      break;
    case "home":
      initHome();
      break;
    case "mylist":
      initMyList();
      break;
    case "singlemovie":
      initSingle();
      break;
    case "movies":
      initMovieShows();
      break;
    case "tvshows":
      initTvShows();
      break;
    case "newandpopular":
      initNewAndPopular();
      break;
    case "explore":
      initExplore();
      break;
    default:
      break;
  }
});
