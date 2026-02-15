const header = document.querySelector(".header");
const headerCta = document.querySelector(".header__cta");
const headerInfo = document.querySelector(".header__info");

const headerAuthCheck = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    const loginLink = document.createElement("a");
    loginLink.href = "./login.html";
    loginLink.classList.add("btn", "btn-primary");
    loginLink.textContent = "Sign In";
    headerCta.appendChild(loginLink);

    const registerLink = document.createElement("a");
    registerLink.href = "./register.html";
    registerLink.classList.add("btn", "btn-secondary");
    registerLink.textContent = "Sign Up";
    headerCta.appendChild(registerLink);
  } else {
    const profileLink = document.createElement("a");
    profileLink.href = "./profile.html";
    profileLink.classList.add("header__link");
    profileLink.innerHTML = `<i class="fa-regular fa-user"></i>`;
    headerCta.appendChild(profileLink);

    const searchLink = document.createElement("a");
    searchLink.href = "./explore.html";
    searchLink.classList.add("header__link");
    searchLink.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
    headerCta.appendChild(searchLink);
  }
};

const updateHeaderBtn = () => {
  const menuBtn = document.querySelector(".menu-btn");
  if (headerInfo.classList.contains("active")) {
    menuBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  } else {
    menuBtn.innerHTML = `<i class="fa-solid fa-bars"></i>`;
  }
};

const headerMenuToggle = () => {
  const menuBtn = document.querySelector(".menu-btn");
  const headerInfo = document.querySelector(".header__info");

  if (!menuBtn) return;

  menuBtn.addEventListener("click", () => {
    headerInfo.classList.toggle("active");
    updateHeaderBtn();
  });
};

export function initHeader() {
  if (!header) return;
  headerAuthCheck();
  headerMenuToggle();
}
