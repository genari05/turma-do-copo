import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client.js";

export default function Player() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [goalsDelta, setGoalsDelta] = useState(0);
  const [assistsDelta, setAssistsDelta] = useState(0);

  async function load() {
    try {
      setLoading(true);
      const data = await api.getPlayer(id);
      setPlayer(data);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function submitAdd() {
    try {
      await api.addStats(id, {
        goals_delta: Number(goalsDelta) || 0,
        assists_delta: Number(assistsDelta) || 0,
      });
      setGoalsDelta(0);
      setAssistsDelta(0);
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <div className="muted">Carregando...</div>;
  if (!player) return <div className="muted">Jogador não encontrado.</div>;

  return (
    <section>
      <div className="pageHead">
        <h1>Jogador</h1>
        <Link className="btn outline" to="/plantel">
          Voltar
        </Link>
      </div>

      <div className="card playerProfile">
        <div className="profileTop">
          <img
            className="avatar big"
            src={player.photo_url || "https://via.placeholder.com/128x128.png?text=Foto"}
            alt={player.name}
          />
          <div>
            <div className="playerName big">{player.name}</div>
            <div className="playerPos">{player.position}</div>

            <div className="playerStats">
              <div className="statPill">
                <span className="statLabel">Gols</span>
                <span className="statValue">{player.goals}</span>
              </div>
              <div className="statPill">
                    <span className="statLabel">Assistências</span>               
                    <span className="statValue">{player.assists}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        <h2>Adicionar estatísticas</h2>
        <div className="formRow">
          <label className="label">
            + Gols
            <input
              className="input"
              type="number"
              min="0"
              value={goalsDelta}
              onChange={(e) => setGoalsDelta(e.target.value)}
            />
          </label>

          <label className="label">
            + Assistências
            <input
              className="input"
              type="number"
              min="0"
              value={assistsDelta}
              onChange={(e) => setAssistsDelta(e.target.value)}
            />
          </label>

          <button className="btn" onClick={submitAdd}>
            Salvar
          </button>
        </div>

        <div className="muted small">
          (Depois a gente coloca senha/admin para proteger essa área.)
        </div>
      </div>
    </section>
  );
}