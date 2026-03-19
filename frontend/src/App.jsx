import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header.jsx";

import Entry from "./pages/entry.jsx";
import Login from "./pages/login.jsx";
import Home from "./pages/home.jsx";
import Squad from "./pages/Squad.jsx";
import Player from "./pages/Player.jsx";
import NewPlayer from "./pages/NewPlayer.jsx";

import RequireAdmin from "./components/RequireAdmin.jsx";

export default function App() {
  const location = useLocation();

  const hideHeaderRoutes = ["/entrada", "/login"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="app">
      {shouldShowHeader && <Header />}

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