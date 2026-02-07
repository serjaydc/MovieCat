import { apiAuth } from "../core/api.js";
import { checkAuth } from "../core/checkAuth.js";
import { notyf } from "../core/notyf.js";

export function initLogin() {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
    };

    try {
      const res = await fetch(`${apiAuth}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        notyf.error(result.message || "Something went wrong");
        return;
      }

      localStorage.setItem("token", result.token);

      notyf.success("Welcome back!");

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      notyf.error("Server error. Please try again later.");
    }
  });
}

export function initRegister() {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      username: document.getElementById("username").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
    };

    try {
      const res = await fetch(`${apiAuth}register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        notyf.error(result.message || "Something went wrong");
        return;
      }

      localStorage.setItem("token", result.token);

      notyf.success("Welcome to the MovieCat!");

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      notyf.error("Server error. Please try again later.");
    }
  });
}

export function initProfile() {}
