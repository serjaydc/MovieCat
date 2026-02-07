import "./index.scss";

import { initShowPassword } from "./js/ui/auth";
import { initHeader } from "./js/ui/header";

import {
  initLogin,
  initProfile,
  initRegister,
} from "./js/auth/auth_controllers";

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
    default:
      break;
  }
});
