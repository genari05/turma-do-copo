import React, { useEffect, useMemo, useState } from "react";
import { api, resolvePhotoURL } from "../api/client.js";
import { Link } from "react-router-dom";

const DEFAULT_AVATAR = "/icon.png";

function topN(arr, key, n = 7) {
  return [...arr]
    .sort((a, b) => (b[key] || 0) - (a[key] || 0))
    .slice(0, n);
}

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const data = await api.listPlayers();
      setPlayers(data || []);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const totals = useMemo(() => {
    const goals = players.reduce((acc, p) => acc + (p.goals || 0), 0);
    const assists = players.reduce((acc, p) => acc + (p.assists || 0), 0);
    return { goals, assists, count: players.length };
  }, [players]);

  const scorers = useMemo(() => topN(players, "goals", 7), [players]);
  const assisters = useMemo(() => topN(players, "assists", 7), [players]);

  return (
    <section>
      <div className="pageHead">
        <div>
          <h1>Estatísticas do time</h1>
          <div className="muted">Rankings automáticos com base nos jogadores cadastrados.</div>
        </div>
        <Link className="btn outline" to="/time">
          Ver Time
        </Link>
      </div>

      {loading ? (
        <div className="muted">Carregando...</div>
      ) : (
        <>
          {/* Mini cards */}
          <div className="gridCards">
            <div className="card mini" data-variant="blue">
              <div className="miniHead">
                <div className="miniTitle">Jogadores</div>
                <div className="miniIcon">👥</div>
              </div>
              <div className="miniValue">{totals.count}</div>
              <div className="miniHint">Total cadastrado</div>
            </div>

            <div className="card mini" data-variant="blue">
              <div className="miniHead">
                <div className="miniTitle">Gols</div>
                <div className="miniIcon">⚽</div>
              </div>
              <div className="miniValue">{totals.goals}</div>
              <div className="miniHint">Somatório do time</div>
            </div>

            <div className="card mini" data-variant="yellow">
              <div className="miniHead">
                <div className="miniTitle">Assistências</div>
                <div className="miniIcon">🅰️</div>
              </div>
              <div className="miniValue">{totals.assists}</div>
              <div className="miniHint">Somatório do time</div>
            </div>
          </div>

          {/* Rankings modernos lado a lado */}
          <div className="rankGrid">
            <div className="rankCard">
              <div className="rankHeader">
                <div>
                  <h2>Artilharia</h2>
                  <div className="muted small">Top {scorers.length || 0}</div>
                </div>
                <div className="rankBadge blue">Gols</div>
              </div>

              <div className="rankList">
                {scorers.length === 0 ? (
                  <div className="muted">Sem dados ainda.</div>
                ) : (
                  scorers.map((p, idx) => (
                    <Link key={p.id} className="rankRow" to={`/jogador/${p.id}`}>
                      <div className="rankLeft">
                        <div className="rankPos">{idx + 1}</div>

                        <img
                          className="rankAvatar"
                          src={p.photo_url ? resolvePhotoURL(p.photo_url) : DEFAULT_AVATAR}
                          alt={p.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = DEFAULT_AVATAR;
                          }}
                        />

                        <div className="rankMeta">
                          <div className="rankName">{p.name}</div>
                          <div className="rankSub">{p.position}</div>
                        </div>
                      </div>

                      <div className="rankValue">
                        <span className="pill">{p.goals}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="rankCard">
              <div className="rankHeader">
                <div>
                  <h2>Assistências</h2>
                  <div className="muted small">Top {assisters.length || 0}</div>
                </div>
                <div className="rankBadge yellow">Assist.</div>
              </div>

              <div className="rankList">
                {assisters.length === 0 ? (
                  <div className="muted">Sem dados ainda.</div>
                ) : (
                  assisters.map((p, idx) => (
                    <Link key={p.id} className="rankRow" to={`/jogador/${p.id}`}>
                      <div className="rankLeft">
                        <div className="rankPos">{idx + 1}</div>

                        <img
                          className="rankAvatar"
                          src={p.photo_url ? resolvePhotoURL(p.photo_url) : DEFAULT_AVATAR}
                          alt={p.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = DEFAULT_AVATAR;
                          }}
                        />

                        <div className="rankMeta">
                          <div className="rankName">{p.name}</div>
                          <div className="rankSub">{p.position}</div>
                        </div>
                      </div>

                      <div className="rankValue">
                        <span className="pill">{p.assists}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}