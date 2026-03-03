import React, { useEffect, useState } from "react";
import { api } from "../api/client.js";
import PlayerCard from "../components/PlayerCard.jsx";
import { Link } from "react-router-dom";

export default function Squad() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

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

  async function loadMe() {
    try {
      setAuthLoading(true);
      const me = await api.me();
      setIsAdmin(me?.role === "admin");
    } catch {
      setIsAdmin(false);
    } finally {
      setAuthLoading(false);
    }
  }

  useEffect(() => {
    load();
    loadMe();
  }, []);

  return (
    <section>
      <div className="pageHead">
        <h1>Plantel</h1>

        {!authLoading && isAdmin && (
          <Link className="btn" to="/novo">
            Adicionar jogador
          </Link>
        )}
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