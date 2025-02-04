"use client";
import React, { useState } from "react";
import ConnectionSection from "../components/ConnectionSection";
import RegisterSection from "../components/RegisterSection";

const Login: React.FC = () => {
  const [isRegisterSection, setRegisterSection] = useState<boolean>(true);

  return (
    <div
      className="h-100 flex items-center justify-center bg-cover bg-center px-4 relative"
      style={{ backgroundImage: "url('/demarrage.jpg')" }}
    >
      {/* Effet de flou sur le fond */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/40"></div>

      {/* Conteneur principal */}
      <div className="relative bg-white bg-opacity-90 p-8 rounded-xl shadow-xl w-full max-w-md">
        {/* Boutons d'alternance */}
        <div className="flex justify-between bg-gray-100 rounded-full p-1 mb-6 w-full">
          <button
            className={`w-1/2 py-2 text-lg font-semibold rounded-full transition-all duration-300 ${
              isRegisterSection
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setRegisterSection(true)}
          >
            Inscription
          </button>
          <button
            className={`w-1/2 py-2 text-lg font-semibold rounded-full transition-all duration-300 ${
              !isRegisterSection
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setRegisterSection(false)}
          >
            Connexion
          </button>
        </div>

        {/* Contenu animé */}
        <div className="transition-opacity duration-500">
          {isRegisterSection ? <RegisterSection /> : <ConnectionSection />}
        </div>
      </div>
    </div>
  );
};

export default Login;
