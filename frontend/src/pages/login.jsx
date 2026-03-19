import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
          <div className="muted">Acesso administrativo</div>
        </div>

        <Link className="btn outline" to="/entrada">
          Voltar
        </Link>
      </div>

      <form className="loginCard" onSubmit={submit}>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a senha"
        />

        <button className="btn" disabled={loading} type="submit">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
}