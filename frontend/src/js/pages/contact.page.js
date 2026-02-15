import { notyf } from "../ui/notyf.js";

export const initContact = () => {
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const data = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    const regexName = /^[a-zA-Z ]+$/g;
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const regexSubject = /^[a-zA-Z0-9 ]+$/g;

    if (!regexName.test(data.name)) {
      notyf.error("Please enter a valid name.");
      return;
    }

    if (!regexEmail.test(data.email)) {
      notyf.error("Please enter a valid email address.");
      return;
    }

    if (!regexSubject.test(data.subject)) {
      notyf.error("Please enter a valid subject.");
      return;
    }

    if (!data.message) {
      notyf.error("Please enter a message.");
      return;
    }

    notyf.success("Message sent!");
    form.reset();
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  });
};
