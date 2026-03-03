import React, { useEffect, useState } from "react";
import { api } from "../api/client.js";
import PlayerCard from "../components/PlayerCard.jsx";
import { Link } from "react-router-dom";

export default function Squad() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const data = await api.listPlayers();
      setPlayers(data || []);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section>
      <div className="pageHead">
        <h1>Plantel</h1>

        {/* Como /time está protegido, sempre pode mostrar */}
        <Link className="btn" to="/novo">
          Adicionar jogador
        </Link>
      </div>

      {loading ? (
        <div className="muted">Carregando...</div>
      ) : players.length === 0 ? (
        <div className="muted">Nenhum jogador cadastrado ainda.</div>
      ) : (
        <div className="grid">
          {players.map((p) => (
            <PlayerCard key={p.id} player={p} />
          ))}
        </div>
      )}
    </section>
  );
}