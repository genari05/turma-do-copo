import React from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";

export default function Entry() {
  const nav = useNavigate();

  async function enterVisitor() {
    await api.logout().catch(() => {});
    nav("/inicio");
  }

  return (
    <section>
      <div className="entryCard">
        <h1>Turma do Copo FC</h1>
        <div className="muted">Escolha como deseja entrar.</div>

        <div className="entryGrid">
          <button className="entryBtn" onClick={enterVisitor}>
            <div className="entryTitle">Visitante</div>
            <div className="muted small">Ver estatísticas e elenco</div>
          </button>

          <button className="entryBtn" onClick={() => nav("/login")}>
            <div className="entryTitle">ADM</div>
            <div className="muted small">Editar, criar, deletar e atualizar</div>
          </button>
        </div>
      </div>
    </section>
  );
}