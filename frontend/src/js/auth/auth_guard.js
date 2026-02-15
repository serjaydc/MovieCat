// Check if the user is authenticated
export function checkAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  return { token };
}
