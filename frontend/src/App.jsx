import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { api } from "./api/client.js";

import Header from "./components/Header.jsx";

import Entry from "./pages/entry.jsx";
import Login from "./pages/login.jsx";
import Home from "./pages/Home.jsx";
import Squad from "./pages/Squad.jsx";
import Player from "./pages/Player.jsx";
import NewPlayer from "./pages/NewPlayer.jsx";

import RequireAdmin from "./components/RequireAdmin.jsx";

export default function App() {

  // 🔥 Sempre que der F5 volta para tela principal
  useEffect(() => {
    const navEntry = performance.getEntriesByType("navigation")?.[0];
    const isReload = navEntry?.type === "reload";

    if (isReload) {
      api.logout().catch(() => {});
      window.location.replace("/entrada");
    }
  }, []);

  return (
    <div className="app">
      <Header />

      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/entrada" replace />} />

          {/* Público */}
          <Route path="/entrada" element={<Entry />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="/time" element={<Squad />} />
          <Route path="/jogador/:id" element={<Player />} />

          {/* Admin */}
          <Route element={<RequireAdmin />}>
            <Route path="/novo" element={<NewPlayer />} />
          </Route>

          <Route path="*" element={<Navigate to="/entrada" replace />} />
        </Routes>
      </main>
    </div>
  );
}