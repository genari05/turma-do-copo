const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const { isForm, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include", // ✅ envia/recebe cookie de sessão
    headers: isForm
      ? { ...(rest.headers || {}) }
      : { "Content-Type": "application/json", ...(rest.headers || {}) },
    ...rest,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error || `Erro HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data?.data;
}

export function resolvePhotoURL(photo_url) {
  if (!photo_url) return "";
  if (photo_url.startsWith("http")) return photo_url;
  return `${API_URL}${photo_url}`;
}

export const api = {
  // auth
  me: () => request("/auth/me"),
  login: (password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ password }) }),
  logout: () => request("/auth/logout", { method: "POST" }),

  // players (público)
  listPlayers: () => request("/players"),
  getPlayer: (id) => request(`/players/${id}`),

  // players (admin)
  createPlayer: (formData) =>
    request("/players", { method: "POST", body: formData, isForm: true }),

  addStats: (id, payload) =>
    request(`/players/${id}/stats`, { method: "POST", body: JSON.stringify(payload) }),

  updatePlayerJSON: (id, payload) =>
    request(`/players/${id}`, { method: "PUT", body: JSON.stringify(payload) }),

  updatePlayerForm: (id, formData) =>
    request(`/players/${id}`, { method: "PUT", body: formData, isForm: true }),

  deletePlayer: (id) => request(`/players/${id}`, { method: "DELETE" }),
};