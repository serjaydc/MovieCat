const initShowPassword = () => {
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

const initPasswordStrength = () => {
  const passwordInput = document.getElementById("password");
  const strengthList = document.querySelector(".form__strength--list");

  if (!passwordInput || !strengthList) return;

  const requirements = [
    {
      label: "Minimum 6 Characters",
      test: (value) => value.length >= 6,
    },
    {
      label: "At least 1 Capital Letter",
      test: (value) => /[A-Z]/.test(value),
    },
    {
      label: "At least 1 Number",
      test: (value) => /[0-9]/.test(value),
    },
    {
      label: "At least 1 Special Character",
      test: (value) => /[!@#$%^&*(),.?\":{}|<>]/.test(value),
    },
  ];

  strengthList.innerHTML = requirements
    .map(
      (req) => `
        <li class="form__strength--item">
          <span class="icon"><i class="fa-solid fa-x"></i></span>
          <span class="label">${req.label}</span>
        </li>
      `,
    )
    .join("");

  const items = strengthList.querySelectorAll(".form__strength--item");

  passwordInput.addEventListener("input", () => {
    const value = passwordInput.value;

    requirements.forEach((req, index) => {
      const isValid = req.test(value);

      const icon = items[index].querySelector(".icon");

      if (isValid) {
        icon.innerHTML = `<i class="fa-solid fa-check"></i>`;
        items[index].classList.add("valid");
      } else {
        icon.innerHTML = `<i class="fa-solid fa-x"></i>`;
        items[index].classList.remove("valid");
      }
    });
  });
};

export const isPasswordValid = (password) => {
  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
};

export const displayPassword = () => {
  initShowPassword();
  initPasswordStrength();
};
