import { apiList } from "../api/api.js";
import { notyf } from "../ui/notyf.js";
import { checkAuth } from "../auth/auth_guard.js";

export const fetchUserlist = async () => {
  const { token } = checkAuth();

  const res = await fetch(`${apiList}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    notyf.error(data.message || "Something went wrong");
    return null;
  }

  return data;
};

export const addItemToUserlist = async (data) => {
  const { token } = checkAuth();

  const res = await fetch(`${apiList}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    notyf.error(result.message || "Something went wrong");
    return null;
  }
  notyf.success("Added to your list!");
  return result;
};

export const updateItemFromUserlist = async (id, updates) => {
  const { token } = checkAuth();

  const res = await fetch(`${apiList}/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates), // e.g. { watched: true }
  });

  const result = await res.json();

  if (!res.ok) {
    notyf.error(result.message || "Something went wrong");
    return null;
  }

  if ("watched" in updates) {
    if (updates.watched === true) {
      notyf.success("Marked as Watched");
    } else {
      notyf.success("Removed from Watched");
    }
  }

  if ("liked" in updates) {
    if (updates.liked === true) {
      notyf.success("Added to Liked");
    } else {
      notyf.success("Removed from Liked");
    }
  }

  return result;
};

export const removeItemFromUserlist = async (id) => {
  const { token } = checkAuth();

  const res = await fetch(`${apiList}/remove/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    notyf.error(result.message || "Something went wrong");
    return null;
  }
  notyf.success("Removed from your list!");
  return result;
};
