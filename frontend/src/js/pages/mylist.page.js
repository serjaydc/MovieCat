import {
  fetchUserlist,
  removeItemFromUserlist,
} from "../controllers/userlist_controller.js";

// Display userlist
const displayUserlist = async () => {
  const data = await fetchUserlist();
  // Check if the user is authenticated
  const token = localStorage.getItem("token");

  if (!data) return;

  const listCards = document.querySelector(".list__cards");
  const listItems = document.querySelector(".list-items");

  listCards.innerHTML = "";
  // Loop through the data and add each item to the list
  data.forEach((item) => {
    listCards.innerHTML += `<a href="singlemovie.html?id=${item.tmdb_id}&type=${item.media_type}" class="content-card" data-id="${item.id}">
          <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" alt="${item.title}" />
          <div class="content-card__info">
          <div class="content-card__text">
          <h3 class="content-card__title">${item.title}</h3>
          <div class="content-card__details">
            <p>${item.vote_average ? item.vote_average.toFixed(1) : ""}</p>
            <p>${item.release_date ? item.release_date.slice(0, 4) : ""}</p>
          </div></div>
            <button class="btn btn-secondary btn-remove">Remove From List</button>
          </div>
        </a>`;
  });
  // Check if the user is authenticated
  if (!token) {
    listItems.textContent = "Please Login To View Your Saved Items";
    return;
  }
  // Check if the data is empty
  listItems.textContent = data.length
    ? `${data.length} Items Saved`
    : "No items Saved";
};

// Remove item from userlist
document.addEventListener("click", async (e) => {
  const button = e.target.closest(".btn-remove");
  if (!button) return;
  e.preventDefault();
  e.stopPropagation();

  const id = button.closest(".content-card").dataset.id;
  const result = await removeItemFromUserlist(id);

  if (result) displayUserlist();
});

export const initMyList = () => {
  displayUserlist();
};
