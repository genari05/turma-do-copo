import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { api } from "../api/client.js";

export default function Header() {
  const logoSrc = "/logo_time.gif";
  const nav = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadMe() {
      try {
        setLoadingAuth(true);
        const me = await api.me();
        if (alive) setIsAdmin(me?.role === "admin");
      } catch (err) {
        console.warn("Erro ao verificar usuário:", err);
        if (alive) setIsAdmin(false);
      } finally {
        if (alive) setLoadingAuth(false);
      }
    }

    loadMe();

    return () => {
      alive = false;
    };
  }, []);

  async function handleLogout() {
    try {
      await api.logout();
    } catch (err) {
      console.warn("Erro ao fazer logout:", err);
    }
    nav("/entrada", { replace: true });
  }

  return (
    <header className="header">
      <div className="heroStripes">
        <div className="stripe stripeBlue"></div>
        <div className="stripe stripeWhite"></div>
        <div className="stripe stripeYellow"></div>

        <div className="heroLogo">
          <img
            src={logoSrc}
            alt="Logo Turma do Copo FC"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement.classList.add("logoFallback");
              e.currentTarget.parentElement.innerText = "TDC";
            }}
          />
        </div>
      </div>

      <div className="menuBar">
        <nav className="nav container">
          <NavLink
            to="/inicio"
            end
            className={({ isActive }) =>
              isActive ? "navLink active" : "navLink"
            }
          >
            Início
          </NavLink>

          <NavLink
            to="/time"
            className={({ isActive }) =>
              isActive ? "navLink active" : "navLink"
            }
          >
            Time
          </NavLink>

          {!loadingAuth && isAdmin && (
            <NavLink
              to="/novo"
              className={({ isActive }) =>
                isActive ? "navLink active" : "navLink"
              }
            >
              Add Jogador
            </NavLink>
          )}

          {!loadingAuth && isAdmin && (
            <button
              type="button"
              className="navLink navButton"
              onClick={handleLogout}
            >
              Sair
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}