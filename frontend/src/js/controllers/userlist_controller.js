import { apiList } from "../api/api.js";
import { notyf } from "../ui/notyf.js";
import { checkAuth } from "../auth/auth_guard.js";

export const fetchUserlist = async () => {
  // Check if the user is authenticated
  const token = localStorage.getItem("token");

  if (!token) {
    return [];
  }
  // Fetch the userlist
  try {
    const res = await fetch(`${apiList}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return [];
    }
    // Parse the response
    const data = await res.json();
    // Return the data
    return data || [];
  } catch (error) {
    console.log("Userlist fetch failed:", error);
    return [];
  }
};

export const addItemToUserlist = async (data) => {
  const { token } = checkAuth();
  // Fetch the add route
  const res = await fetch(`${apiList}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  // Parse the response
  const result = await res.json();

  if (!res.ok) {
    notyf.error(result.message || "Something went wrong");
    return null;
  }
  // Return the data
  notyf.success("Added to your list!");
  return result;
};

export const updateItemFromUserlist = async (id, updates) => {
  const { token } = checkAuth();
  // Fetch the update route
  const res = await fetch(`${apiList}/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates), // e.g. { watched: true }
  });
  // Parse the response
  const result = await res.json();

  if (!res.ok) {
    notyf.error(result.message || "Something went wrong");
    return null;
  }
  // Return the data
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
  // Return the data
  return result;
};

export const removeItemFromUserlist = async (id) => {
  const { token } = checkAuth();
  // Fetch the remove route
  const res = await fetch(`${apiList}/remove/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  // Parse the response
  const result = await res.json();

  if (!res.ok) {
    notyf.error(result.message || "Something went wrong");
    return null;
  }
  // Return the data
  notyf.success("Removed from your list!");
  return result;
};
