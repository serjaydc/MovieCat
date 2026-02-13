import { apiTMDB } from "../api/api.js";
import { notyf } from "../ui/notyf.js";

export const fetchMovies = async () => {
  const res = await fetch(`${apiTMDB}/movies`);

  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  return data;
};

export const fetchTVShows = async () => {
  const res = await fetch(`${apiTMDB}/tvshows`);

  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  return data;
};

export const fetchSingleMovie = async (id) => {
  const res = await fetch(`${apiTMDB}/movie/${id}`);

  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  return data;
};

export const fetchSingleTVShow = async (id) => {
  const res = await fetch(`${apiTMDB}/tv/${id}`);

  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  return data;
};

export const fetchDiscoverByGenre = async (media_type, id) => {
  const res = await fetch(`${apiTMDB}/genre/${media_type}/${id}`);

  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  return data;
};

export const fetchTrendingMovies = async () => {
  const res = await fetch(`${apiTMDB}/trending`);

  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  return data;
};

export const fetchNewReleases = async () => {
  const res = await fetch(`${apiTMDB}/new-releases`);

  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  return data;
};

export const fetchUpcomingMovies = async () => {
  const res = await fetch(`${apiTMDB}/coming-soon`);

  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  return data;
};

export const fetchTopRatedMovies = async () => {
  const res = await fetch(`${apiTMDB}/top-rated`);

  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  return data;
};

export const fetchRandomMovie = async () => {
  const data = await fetchMovies();
  const results = data?.results || [];

  if (!results.length) throw new Error("No movies returned");

  const randomMovie = results[Math.floor(Math.random() * results.length)];

  return await fetchSingleMovie(randomMovie.id);
};
