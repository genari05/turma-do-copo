import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { api } from "../api/client.js";

export default function RequireAdmin() {
  const [ok, setOk] = useState(null);
  const loc = useLocation();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await api.me();
        if (!alive) return;
        setOk(data?.role === "admin");
      } catch {
        if (!alive) return;
        setOk(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [loc.pathname]);

  if (ok === null) return <div style={{ padding: 16 }}>Carregando...</div>;
  if (!ok) return <Navigate to="/login" replace state={{ from: loc }} />;

  return <Outlet />;
}