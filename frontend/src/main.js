import "./index.scss";

import {
  initLogin,
  initProfile,
  initRegister,
} from "./js/controllers/auth_controllers";

import { initShowPassword } from "./js/ui/auth";
import { initHeader } from "./js/ui/header";

const page = document.body.dataset.page;

document.addEventListener("DOMContentLoaded", () => {
  initHeader();

  switch (page) {
    case "home":
    // initHome();
    // break;
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
    default:
      break;
  }
});
