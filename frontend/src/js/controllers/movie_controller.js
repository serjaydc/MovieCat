import { apiTMDB } from "../api/api.js";
import { notyf } from "../ui/notyf.js";

export const fetchMovies = async () => {
  // Fetch the movies
  const res = await fetch(`${apiTMDB}/movies`);
  // Parse the response
  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  // Return the data
  return data;
};

export const fetchTVShows = async () => {
  // Fetch the tv shows
  const res = await fetch(`${apiTMDB}/tvshows`);
  // Parse the response
  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  // Return the data
  return data;
};

export const fetchSingleMovie = async (id) => {
  // Fetch the movie
  const res = await fetch(`${apiTMDB}/movie/${id}`);
  // Parse the response
  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  // Return the data
  return data;
};

export const fetchSingleTVShow = async (id) => {
  // Fetch the tv show
  const res = await fetch(`${apiTMDB}/tv/${id}`);
  // Parse the response
  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  // Return the data
  return data;
};

export const fetchDiscoverByGenre = async (media_type, id) => {
  // Fetch the show by genre
  const res = await fetch(`${apiTMDB}/genre/${media_type}/${id}`);
  // Parse the response
  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  // Return the data
  return data;
};

export const fetchTrendingMovies = async () => {
  // Fetch the trending movies and tv-shows
  const res = await fetch(`${apiTMDB}/trending`);
  // Parse the response
  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  // Return the data
  return data;
};

export const fetchNewReleases = async () => {
  // Fetch the new releases
  const res = await fetch(`${apiTMDB}/new-releases`);
  // Parse the response
  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  // Return the data
  return data;
};

export const fetchUpcomingMovies = async () => {
  // Fetch the upcoming movies
  const res = await fetch(`${apiTMDB}/coming-soon`);
  // Parse the response
  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  // Return the data
  return data;
};

export const fetchTopRatedMovies = async () => {
  // Fetch the top rated movies
  const res = await fetch(`${apiTMDB}/top-rated`);
  // Parse the response
  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return;
  }
  // Return the data
  return data;
};

export const fetchRandomMovie = async () => {
  // Fetch the random movie
  const data = await fetchMovies();
  const results = data?.results || [];
  // Throw an error if there are no movies
  if (!results.length) throw new Error("No movies returned");
  // Return a random movie
  const randomMovie = results[Math.floor(Math.random() * results.length)];

  return await fetchSingleMovie(randomMovie.id);
};
