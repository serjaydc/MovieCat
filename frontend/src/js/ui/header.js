const header = document.querySelector(".header");
const headerCta = document.querySelector(".header__cta");
const headerInfo = document.querySelector(".header__info");

const headerAuthCheck = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    const loginLink = document.createElement("a");
    loginLink.href = "/src/pages/login.html";
    loginLink.classList.add("btn", "btn-primary");
    loginLink.textContent = "Sign In";
    headerCta.appendChild(loginLink);

    const registerLink = document.createElement("a");
    registerLink.href = "/src/pages/register.html";
    registerLink.classList.add("btn", "btn-secondary");
    registerLink.textContent = "Sign Up";
    headerCta.appendChild(registerLink);
  } else {
    const profileLink = document.createElement("a");
    profileLink.href = "/src/pages/profile.html";
    profileLink.classList.add("header__link");
    profileLink.innerHTML = `<i class="fa-regular fa-user"></i>`;
    headerCta.appendChild(profileLink);

    const searchLink = document.createElement("a");
    searchLink.href = "/src/pages/explore.html";
    searchLink.classList.add("header__link");
    searchLink.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
    headerCta.appendChild(searchLink);
  }
};

const headerMenuToggle = () => {
  const menuBtn = document.querySelector(".menu-btn");

  menuBtn.addEventListener("click", () => {
    headerInfo.classList.toggle("active");
  });
};

export function initHeader() {
  if (!header) return;
  headerAuthCheck();
  headerMenuToggle();
}
