const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error || `Erro HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data?.data;
}

export const api = {
  listPlayers: () => request("/players"),
  getPlayer: (id) => request(`/players/${id}`),
  createPlayer: (payload) =>
    request("/players", { method: "POST", body: JSON.stringify(payload) }),
  addStats: (id, payload) =>
    request(`/players/${id}/stats`, { method: "POST", body: JSON.stringify(payload) }),
};