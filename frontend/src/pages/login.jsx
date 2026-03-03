import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { api } from "../api/client.js";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await api.login(password);

      // volta pra rota que ele tentou abrir, ou vai pro /inicio
      const to = loc.state?.from?.pathname || "/inicio";
      nav(to, { replace: true });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="pageHead">
        <div>
          <h1>Login ADM</h1>
          <div className="muted">Acesso para editar o time.</div>
        </div>
        <Link className="btn outline" to="/entrada">
          Voltar
        </Link>
      </div>

      <form className="loginCard" onSubmit={submit}>
        <label className="label">
          Senha
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha"
          />
        </label>

        <button className="btn" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
}