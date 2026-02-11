import "./index.scss";

import { initShowPassword } from "./js/ui/auth.js";
import { initHeader } from "./js/ui/header.js";

import {
  initLogin,
  initProfile,
  initRegister,
} from "./js/auth/auth_controllers.js";

import { initHome } from "./js/pages/home.page.js";

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
      break;
    case "profile":
      initProfile();
      break;
    case "home":
      initHome();
    default:
      break;
  }
});
