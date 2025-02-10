"use client";

"use client";

import { useState, useEffect } from "react";
import Booking from "../components/Booking";
import Home from "../components/Home";
import Chat from "../components/Chat"; // 🔥 Import du composant Chat
import Annonce from "../components/Annonce";
import AI from "../components/AI";
export default function HomePage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null); // 🔥 Stocke l'ID de l'utilisateur
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId"); // 🔥 Récupérer l'ID de l'utilisateur

    if (storedUserName) setUserName(storedUserName);
    if (storedUserId) setUserId(parseInt(storedUserId)); // 🔥 Convertir en nombre
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userId"); // 🔥 Supprimer userId aussi
    localStorage.removeItem("token");
    setUserName(null);
    setUserId(null); // 🔥 Réinitialiser l'ID utilisateur
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 📌 Barre de navigation responsive */}
      <nav className="bg-[#A8D08D] shadow-md p-4 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-700 text-center md:text-left">
          🎾 MitchTennisClub
        </h1>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          {userName && <span className="text-gray-700 font-medium">👤 {userName}</span>}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      {/* 📌 Menu de navigation responsive */}
      <div className="bg-gray-200 flex flex-wrap justify-center p-2 shadow-inner gap-2 md:gap-6">
        {["home", "booking", "chat", "annonces", "Ai"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm md:text-lg font-semibold capitalize transition-all ${
              activeTab === tab
                ? "text-white bg-blue-600 rounded-lg shadow"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 📌 Contenu principal adaptatif */}
      <main className="flex flex-col items-center justify-center flex-grow p-4 md:p-6">
        {activeTab === "home" && <Home />}
        {activeTab === "booking" && <Booking />}
        {activeTab === "chat" && userId && <Chat userId={userId} recipientId={2} />}
        {activeTab === "annonces" && <Annonce />}
        {activeTab === "Ai" && <AI/>}
      </main>

      {/* 📌 Pied de page amélioré */}
      <footer className="bg-white shadow-md p-4 text-center text-gray-600 text-sm md:text-base">
        &copy; 2024 MitchTennisClub. Tous droits réservés.
      </footer>
    </div>
  );
}
