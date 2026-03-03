const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const { isForm, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    headers: isForm
      ? { ...(rest.headers || {}) } // não define Content-Type
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
  listPlayers: () => request("/players"),
  getPlayer: (id) => request(`/players/${id}`),

  createPlayer: (formData) =>
    request("/players", { method: "POST", body: formData, isForm: true }),

  addStats: (id, payload) =>
    request(`/players/${id}/stats`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // ✅ PUT JSON (nome/posição)
  updatePlayerJSON: (id, payload) =>
    request(`/players/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // ✅ PUT multipart (nome/posição/foto)
  updatePlayerForm: (id, formData) =>
    request(`/players/${id}`, {
      method: "PUT",
      body: formData,
      isForm: true,
    }),

  // ✅ DELETE
  deletePlayer: (id) =>
    request(`/players/${id}`, {
      method: "DELETE",
    }),
};