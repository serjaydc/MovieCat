import {
  initProfile,
  initLogout,
  deleteAccount,
} from "../auth/auth_controllers.js";
import { fetchUserlist } from "../controllers/userlist_controller.js";

// Display the user profile
const displayProfileStats = async () => {
  const data = await initProfile();
  const profileDetails = document.querySelector(".profile__details");

  profileDetails.innerHTML = `
    <div class="profile__user">
        <div class="profile__avatar">
            <p>${data.username.slice(0, 1).toUpperCase()}</p>
        </div>
        <div class="profile__info">
            <h2>${data.username}</h2>
            <p>${data.email}</p>
        </div>
    </div>
    <div class="profile__cta">
        <button class="btn btn-secondary btn-logout">Logout</button>
        <button class="btn btn-delete">Delete Account</button>
    </div>
    `;
};

// Display the userlist stats
const displayUserlistStats = async () => {
  const userlist = await fetchUserlist();
  const profileStats = document.querySelector(".profile__stats");

  const total = userlist.length;
  const movies = userlist.filter((item) => item.media_type === "movie").length;
  const tvShows = userlist.filter((item) => item.media_type === "tv").length;
  const watched = userlist.filter((item) => item.watched).length;
  const liked = userlist.filter((item) => item.liked).length;

  profileStats.innerHTML = `
    <div class="profile__stat">
        <h3>${total}</h3>
        <p>Items Saved</p>
    </div>

    <div class="profile__stat">
        <h3>${movies}</h3>
        <p>Movies</p>
    </div>

    <div class="profile__stat">
        <h3>${tvShows}</h3>
        <p>TV Shows</p>
    </div>

    <div class="profile__stat">
        <h3>${watched}</h3>
        <p>Watched</p>
    </div>

    <div class="profile__stat">
        <h3>${liked}</h3>
        <p>Liked</p>
    </div>
  `;
};

// Logout and delete account
document.addEventListener("click", async (e) => {
  const button = e.target.closest(".btn-logout, .btn-delete");
  if (!button) return;

  if (button.classList.contains("btn-logout")) {
    await initLogout();
  } else if (button.classList.contains("btn-delete")) {
    await deleteAccount();
  }
});

export const displayProfile = () => {
  displayProfileStats();
  displayUserlistStats();
};
