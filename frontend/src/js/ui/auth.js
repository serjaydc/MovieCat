export const initShowPassword = () => {
  const btnPassword = document.querySelector(".btn-password");

  btnPassword.addEventListener("click", () => {
    const passwordInput = document.getElementById("password");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      btnPassword.innerHTML = `Hide <i class='fa-solid fa-eye-slash'></i>`;
    } else {
      passwordInput.type = "password";
      btnPassword.innerHTML = `Show <i class='fa-solid fa-eye'></i>`;
    }
  });
};
