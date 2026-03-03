import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api, resolvePhotoURL } from "../api/client.js";

const DEFAULT_AVATAR = "/icon.png";

export default function Player() {
  const { id } = useParams();
  const nav = useNavigate();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  // salvar stats
  const [savingStats, setSavingStats] = useState(false);
  const [goalsFinal, setGoalsFinal] = useState(0);
  const [assistsFinal, setAssistsFinal] = useState(0);

  // editar jogador
  const [savingEdit, setSavingEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPosition, setEditPosition] = useState("ATA");
  const [photoFile, setPhotoFile] = useState(null);

  const photoPreview = useMemo(() => {
    if (!photoFile) return null;
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  async function load() {
    try {
      setLoading(true);
      const data = await api.getPlayer(id);
      setPlayer(data);

      // stats
      setGoalsFinal(Number(data?.goals ?? 0));
      setAssistsFinal(Number(data?.assists ?? 0));

      // edição
      setEditName(data?.name || "");
      setEditPosition(data?.position || "ATA");
      setPhotoFile(null);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  // =========================
  // Atualizar stats (já existia)
  // =========================
  async function saveStats() {
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
      setSavingStats(true);
      await api.addStats(id, { goals_delta: goalsDelta, assists_delta: assistsDelta });
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setSavingStats(false);
    }
  }

  // =========================
  // Editar jogador (nome/posição/foto)
  // =========================
  async function saveEdit() {
    const name = editName.trim();
    const position = String(editPosition || "").trim();

    if (!name || !position) {
      alert("Nome e posição são obrigatórios.");
      return;
    }

    try {
      setSavingEdit(true);

      // se tiver foto -> multipart
      if (photoFile) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("position", position);
        formData.append("photo", photoFile);

        await api.updatePlayerForm(id, formData);
      } else {
        // sem foto -> JSON
        await api.updatePlayerJSON(id, { name, position });
      }

      await load();
      alert("Jogador atualizado!");
    } catch (e) {
      alert(e.message);
    } finally {
      setSavingEdit(false);
    }
  }

  // =========================
  // Deletar jogador
  // =========================
  async function removePlayer() {
    if (!player) return;

    const ok = confirm(`Tem certeza que deseja excluir "${player.name}"?`);
    if (!ok) return;

    try {
      await api.deletePlayer(id);
      alert("Jogador excluído!");
      nav("/time");
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <div className="muted">Carregando...</div>;
  if (!player) return <div className="muted">Jogador não encontrado.</div>;

  const avatarSrc = photoPreview
    ? photoPreview
    : player.photo_url
      ? resolvePhotoURL(player.photo_url)
      : DEFAULT_AVATAR;

  return (
    <section>
      <div className="pageHead">
        <div>
          <h1>Perfil do jogador</h1>
          <div className="muted">Totais, edição e estatísticas.</div>
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
              src={avatarSrc}
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

        {/* ====== ATUALIZAR STATS ====== */}
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
            <div className="saveTitle">Salvar estatísticas</div>
            <div className="muted small">Aplica os valores finais.</div>

            <button className="btn" disabled={savingStats} onClick={saveStats}>
              {savingStats ? "Salvando..." : "Salvar"}
            </button>

            <div className="muted small" style={{ marginTop: 8 }}>
              (Diminuir valores: depois com senha/admin.)
            </div>
          </div>
        </div>

        <div className="profileDivider" />

        {/* ====== EDITAR JOGADOR ====== */}
        <div className="newPlayerGrid">
          <div className="newPlayerPhotoCard">
            <div className="newPlayerPhotoRing">
              <img
                className="newPlayerPhoto"
                src={avatarSrc}
                alt="Foto do jogador"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
            </div>

            <label className="fileBtn">
              Trocar foto
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              />
            </label>

            <div className="muted small" style={{ textAlign: "center" }}>
              Se não selecionar, mantém a foto atual.
            </div>
          </div>

          <div className="newPlayerFormCard">
            <h2>Editar jogador</h2>

            <label className="label">
              Nome
              <input
                className="input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </label>

            <label className="label">
              Posição
              <select
                className="input"
                value={editPosition}
                onChange={(e) => setEditPosition(e.target.value)}
              >
                <option value="GOL">GOL</option>
                <option value="FIXO">FIXO</option>
                <option value="ALA">ALA</option>
                <option value="PIVÔ">PIVÔ</option>
              </select>
            </label>

            <div className="newPlayerActions">
              <button className="btn" disabled={savingEdit} onClick={saveEdit} type="button">
                {savingEdit ? "Salvando..." : "Salvar edição"}
              </button>

              <button className="btn outline" type="button" onClick={() => load()}>
                Cancelar
              </button>
            </div>

            <div className="muted small">
              (Depois a gente coloca senha para editar/deletar/alterar stats.)
            </div>
          </div>
        </div>

        <div className="profileDivider" />

        {/* ====== DELETAR ====== */}
        <div className="dangerZone">
          <div>
            <h2>Excluir jogador</h2>
            <div className="muted small">
              Esta ação não pode ser desfeita.
            </div>
          </div>

          <button className="btn danger" onClick={removePlayer}>
            Excluir jogador
          </button>
        </div>
      </div>
    </section>
  );
}