import React, { useState } from "react";
import { api } from "../api/client.js";
import { useNavigate, Link } from "react-router-dom";

export default function NewPlayer() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [position, setPosition] = useState("PIVÔ");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const created = await api.createPlayer({
        name,
        position,
        photo_url: photoURL,
      });
      nav(`/jogador/${created.id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="pageHead">
        <h1>Novo jogador</h1>
        <Link className="btn outline" to="/plantel">
          Voltar
        </Link>
      </div>

      <form className="card form" onSubmit={submit}>
        <label className="label">
          Nome
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: João" />
        </label>

        <label className="label">
          Posição
          <select className="input" value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="GOL">GOL</option>
            <option value="FIXO">FIXO</option>
            <option value="ALA">ALA</option>
            <option value="PIVÔ">PIVÔ</option>
          </select>
        </label>

        <label className="label">
          Foto (URL)
          <input
            className="input"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            placeholder="https://..."
          />
        </label>

        <button className="btn" disabled={loading}>
          {loading ? "Salvando..." : "Cadastrar"}
        </button>

        <div className="muted small">
          Dica: por enquanto você pode deixar a foto vazia.
        </div>
      </form>
    </section>
  );
}