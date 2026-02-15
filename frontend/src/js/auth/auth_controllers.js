import { notyf } from "../ui/notyf.js";
import { apiAuth } from "../api/api.js";
import { checkAuth } from "./auth_guard.js";
import { isPasswordValid } from "../ui/auth.js";

export function initLogin() {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Get the form data
    const data = {
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
    };
    // Fetch the login route
    try {
      const res = await fetch(`${apiAuth}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      // Parse the response
      const result = await res.json();

      if (!res.ok) {
        notyf.error(result.message || "Something went wrong");
        return;
      }
      // Store the token
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
    // Get the form data
    const data = {
      username: document.getElementById("username").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
    };
    // Validate the password
    if (!isPasswordValid(data.password)) {
      notyf.error("Password does not meet requirements");
      return;
    }
    // Fetch the register route
    try {
      const res = await fetch(`${apiAuth}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      // Parse the response
      const result = await res.json();

      if (!res.ok) {
        notyf.error(result.message || "Something went wrong");
        return;
      }
      // Store the token
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

export async function initProfile() {
  try {
    const { token } = checkAuth();

    // Fetch the profile route
    const res = await fetch(`${apiAuth}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // Parse the response
    const data = await res.json();

    if (!res.ok) {
      notyf.error(data.message || "Something went wrong");
      return;
    }

    return data;
  } catch (error) {
    notyf.error("Server error. Please try again later.");
  }
}

export async function initLogout() {
  // Remove the token
  try {
    localStorage.removeItem("token");

    notyf.success("Goodbye!");

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  } catch (error) {
    notyf.error("Server error. Please try again later.");
  }
}

export async function deleteAccount() {
  try {
    const { token } = checkAuth();
    // Fetch the delete route
    const res = await fetch(`${apiAuth}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // Parse the response
    const data = await res.json();

    if (!res.ok) {
      notyf.error(data.message || "Something went wrong");
      return;
    }
    // Remove the token
    localStorage.removeItem("token");
    notyf.success("Account deleted!");
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  } catch (error) {
    notyf.error("Server error. Please try again later.");
  }
}
