import React from "react";
import { Link } from "react-router-dom";
import { resolvePhotoURL } from "../api/client.js";

const DEFAULT_AVATAR = "/icon.png"; // foto padrão quando não tem foto do jogador
const ICON_USER = "/icon.png"; // ícone do topo do card (pode trocar por outro arquivo)

export default function PlayerCard({ player }) {
  return (
    <div className="playerMiniCard">
      <div className="miniHead">
        <div className="miniTitle">{player.position}</div>

        <div className="miniIconImgWrap" title="Jogador">
          <img
            className="miniIconImg"
            src={ICON_USER}
            alt="Ícone"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>

      <div className="playerMiniTop">
        <img
          className="playerMiniAvatar"
          src={player.photo_url ? resolvePhotoURL(player.photo_url) : DEFAULT_AVATAR}
          alt={player.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_AVATAR;
          }}
        />

        <div className="playerMiniName">{player.name}</div>
      </div>

      <div className="playerMiniStats">
        <div className="miniStat">
          <span className="miniStatLabel">Gols</span>
          <span className="miniStatValue">{player.goals}</span>
        </div>

        <div className="miniStat">
          <span className="miniStatLabel">Assist.</span>
          <span className="miniStatValue">{player.assists}</span>
        </div>
      </div>

      <Link
        to={`/jogador/${player.id}`}
        className="btn outline"
        style={{ width: "100%", textAlign: "center" }}
      >
        Ver perfil
      </Link>
    </div>
  );
}