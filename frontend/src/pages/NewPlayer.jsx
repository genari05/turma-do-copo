import React, { useMemo, useState } from "react";
import { api } from "../api/client.js";
import { useNavigate, Link } from "react-router-dom";

const DEFAULT_AVATAR = "/avatar-default.png";

export default function NewPlayer() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [position, setPosition] = useState("ATA");
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const previewURL = useMemo(() => {
    if (!photoFile) return null;
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  async function submit(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Informe o nome do jogador.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("position", position);

      if (photoFile) formData.append("photo", photoFile);

      const created = await api.createPlayer(formData);
      nav(`/jogador/${created.id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <div className="pageHead">
        <div>
          <h1>Novo jogador</h1>
          <div className="muted">Cadastre o jogador e envie a foto (opcional).</div>
        </div>
        <Link className="btn outline" to="/time">
          Voltar
        </Link>
      </div>

      <form className="newPlayerPro" onSubmit={submit}>
        <div className="newPlayerGrid">
          <div className="newPlayerPhotoCard">
            <div className="newPlayerPhotoRing">
              <img
                className="newPlayerPhoto"
                src={previewURL || DEFAULT_AVATAR}
                alt="Foto do jogador"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
            </div>

            <label className="fileBtn">
              Escolher foto
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              />
            </label>

            <div className="muted small" style={{ textAlign: "center" }}>
              Se não enviar, usamos o ícone padrão.
            </div>
          </div>

          <div className="newPlayerFormCard">
            <label className="label">
              Nome
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João"
              />
            </label>

            <label className="label">
              Posição
              <select
                className="input"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="GOL">GOL</option>
                <option value="FIXO">FIXO</option>
                <option value="ALA">ALA</option>
                <option value="PIVÔ">PIVÔ</option>
              </select>
            </label>

            <div className="newPlayerActions">
              <button className="btn" disabled={saving} type="submit">
                {saving ? "Cadastrando..." : "Cadastrar jogador"}
              </button>

              <Link className="btn outline" to="/time">
                Cancelar
              </Link>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}