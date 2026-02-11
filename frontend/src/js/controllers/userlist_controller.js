import { apiList } from "../api/api.js";
import { notyf } from "../ui/notyf.js";
import { checkAuth } from "./auth_guard.js";
import { fetchMovies, fetchTVShows } from "./movie_controller.js";

export const fetchUserlist = async () => {
  const { token } = checkAuth();

  const res = await fetch(`${apiList}/list/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return null;
  }

  const list = Array.isArray(data) ? data : data.results || [];

  const [movies, tvShows] = await Promise.all([fetchMovies(), fetchTVShows()]);

  const movieResults = movies?.results ?? [];
  const tvResults = tvShows?.results ?? [];

  list.forEach((item) => {
    if (item.media_type === "movie") {
      item.media =
        movieResults.find((movie) => movie.id === item.tmdb_id) || null;
    } else if (item.media_type === "tv") {
      item.media =
        tvResults.find((tvShow) => tvShow.id === item.tmdb_id) || null;
    } else {
      item.media = null;
    }
  });

  return list;
};

export const addItemToUserlist = async (data) => {
  const { token } = checkAuth();

  const res = await fetch(`${apiList}/list/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data), // { tmdb_id, media_type }
  });

  const result = await res.json();

  if (!res.ok) {
    notyf.error(result.message || "Something went wrong");
    return null;
  }
  return result;
};

export const updateItemFromUserlist = async (id, updates) => {
  const { token } = checkAuth();

  const res = await fetch(`${apiList}/list/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates), // e.g. { watched: true }
  });

  const result = await res.json();

  if (!res.ok) {
    notyf.error(result.message || "Something went wrong");
    return null;
  }
  return result;
};

export const removeItemFromUserlist = async (id) => {
  const { token } = checkAuth();

  const res = await fetch(`${apiList}/list/remove/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    notyf.error(result.message || "Something went wrong");
    return null;
  }
  return result;
};
