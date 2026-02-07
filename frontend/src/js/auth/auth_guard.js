export function checkAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/src/pages/login.html";
    return false;
  }

  return (true, token);
}
