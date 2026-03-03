import React from "react";
import { useNavigate } from "react-router-dom";

export default function Entry() {
  const nav = useNavigate();

  return (
    <section>
      <div className="entryCard">
        <h1>Turma do Copo FC</h1>
        <div className="muted">Escolha como deseja entrar.</div>

        <div className="entryGrid">
          <button className="entryBtn" onClick={() => nav("/inicio")}>
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