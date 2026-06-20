const API_BASE_URL = "http://127.0.0.1:5000";

export function getAuthToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem("authToken") || "";
}

export async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getAuthToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
}
