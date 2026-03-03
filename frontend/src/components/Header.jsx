import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  const logoSrc = "/logo_time.gif"; // coloque sua imagem na pasta public

  return (
    <header className="header">

      {/* LISTRAS PRINCIPAIS */}
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

      {/* MENU ABAIXO DAS LISTRAS */}
      <div className="menuBar">
        <nav className="nav container">
          <NavLink to="/inicio" end className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
            Início
          </NavLink>

          <NavLink to="/time" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
            Time
          </NavLink>

          <NavLink to="/novo" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
            Jogador
          </NavLink>
        </nav>
      </div>

    </header>
  );
}