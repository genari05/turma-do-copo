import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/home.jsx";
import Squad from "./pages/Squad.jsx";
import Player from "./pages/Player.jsx";
import NewPlayer from "./pages/NewPlayer.jsx";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/time" element={<Squad />} />
          <Route path="/jogador/:id" element={<Player />} />
          <Route path="/novo" element={<NewPlayer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}