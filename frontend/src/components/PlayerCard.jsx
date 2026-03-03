import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";

export default function PlayerCard({ player, onUpdated }) {
  const [loading, setLoading] = useState(false);

  async function add(type) {
    try {
      setLoading(true);
      const payload =
        type === "goal"
          ? { goals_delta: 1, assists_delta: 0 }
          : { goals_delta: 0, assists_delta: 1 };

      await api.addStats(player.id, payload);
      onUpdated?.();
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card playerCard">
      <div className="playerHead">
        <img
          className="avatar"
          src={player.photo_url || "https://via.placeholder.com/96x96.png?text=Foto"}
          alt={player.name}
        />
        <div className="playerMeta">
          <div className="playerName">{player.name}</div>
          <div className="playerPos">{player.position}</div>
        </div>
      </div>

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

      <div className="actions">
        <Link className="btn outline" to={`/jogador/${player.id}`}>
          Ver
        </Link>

        <button className="btn" disabled={loading} onClick={() => add("goal")}>
         Gol
        </button>
        <button className="btn" disabled={loading} onClick={() => add("assist")}>
         Assist.
        </button>
      </div>
    </div>
  );
}