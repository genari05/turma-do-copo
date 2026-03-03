import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, resolvePhotoURL } from "../api/client.js";

const DEFAULT_AVATAR = "/icon.png";

export default function Player() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [goalsFinal, setGoalsFinal] = useState(0);
  const [assistsFinal, setAssistsFinal] = useState(0);

  async function load() {
    try {
      setLoading(true);
      const data = await api.getPlayer(id);
      setPlayer(data);

      setGoalsFinal(Number(data?.goals ?? 0));
      setAssistsFinal(Number(data?.assists ?? 0));
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function save() {
    if (!player) return;

    const newGoals = Math.max(0, Number(goalsFinal) || 0);
    const newAssists = Math.max(0, Number(assistsFinal) || 0);

    const goalsDelta = newGoals - (player.goals || 0);
    const assistsDelta = newAssists - (player.assists || 0);

    if (goalsDelta < 0 || assistsDelta < 0) {
      alert("Para diminuir valores, vamos liberar isso depois com senha/admin.");
      return;
    }

    try {
      setSaving(true);
      await api.addStats(id, { goals_delta: goalsDelta, assists_delta: assistsDelta });
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="muted">Carregando...</div>;
  if (!player) return <div className="muted">Jogador não encontrado.</div>;

  return (
    <section>
      <div className="pageHead">
        <div>
          <h1>Perfil do jogador</h1>
          <div className="muted">Totais e atualização de estatísticas.</div>
        </div>

        <Link className="btn outline" to="/time">
          Voltar
        </Link>
      </div>

      <div className="profilePro">
        <div className="profileTopPro">
          <div className="profileAvatarRing">
            <img
              className="profileAvatarPro"
              src={player.photo_url ? resolvePhotoURL(player.photo_url) : DEFAULT_AVATAR}
              alt={player.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
            />
          </div>

          <div className="profileInfoPro">
            <div className="profileNamePro">{player.name}</div>

            <div className="profileTagRow">
              <span className="profileTag">{player.position}</span>
            </div>

            <div className="profileTotals">
              <div className="totalPill">
                <div className="totalLabel">Gols</div>
                <div className="totalValue">{player.goals}</div>
              </div>

              <div className="totalPill">
                <div className="totalLabel">Assistências</div>
                <div className="totalValue">{player.assists}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="profileDivider" />

        <div className="editGridPro">
          <div className="editCard">
            <div className="editCardHead">
              <div>
                <div className="editTitle">Atualizar Gols</div>
                <div className="muted small">Valor final</div>
              </div>
              <div className="editBadge blue">⚽</div>
            </div>

            <input
              className="editNumber"
              type="number"
              min="0"
              value={goalsFinal}
              onChange={(e) => setGoalsFinal(e.target.value)}
            />
            <div className="muted small">Atual: {player.goals}</div>
          </div>

          <div className="editCard">
            <div className="editCardHead">
              <div>
                <div className="editTitle">Atualizar Assistências</div>
                <div className="muted small">Valor final</div>
              </div>
              <div className="editBadge yellow">🅰️</div>
            </div>

            <input
              className="editNumber"
              type="number"
              min="0"
              value={assistsFinal}
              onChange={(e) => setAssistsFinal(e.target.value)}
            />
            <div className="muted small">Atual: {player.assists}</div>
          </div>

          <div className="saveCard">
            <div className="saveTitle">Salvar alterações</div>
            <div className="muted small">Aplica os valores finais.</div>

            <button className="btn" disabled={saving} onClick={save}>
              {saving ? "Salvando..." : "Salvar"}
            </button>

            <div className="muted small" style={{ marginTop: 8 }}>
              (Diminuir valores: depois com senha/admin.)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}