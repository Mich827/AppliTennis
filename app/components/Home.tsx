"use client";

import { useState, useEffect } from "react";

const images = [
  "/images/terrain1.jpg",
  "/images/terrain2.jpg",
  "/images/terrain3.jpg",
  "/images/terrain4.jpg",
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [weather, setWeather] = useState<{ temp: number; description: string; icon: string } | null>(null);
  const API_KEY = "ed04c726a0230d3c78c5a8ad7a0f4e86"; // 🔥 Remplacez par votre clé OpenWeatherMap
  const CITY = "Marseille"; // 🏙️ Remplacez par votre ville

  useEffect(() => {
    // Changement d'image toutes les 3 secondes
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Récupérer la météo
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=fr`
        );
        const data = await response.json();
        setWeather({
          temp: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        });
      } catch (error) {
        console.error("Erreur de récupération météo :", error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10">
      {/* Section de présentation + météo */}
      <section className="text-center max-w-3xl flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎾 Bienvenue au MitchTennisClub
        </h1>

        {/* 🌤️ Bloc météo */}
        {weather && (
          <div className="flex items-center space-x-4 bg-blue-100 p-3 rounded-lg shadow-md mb-4">
            <img src={weather.icon} alt="Météo" className="w-12 h-12" />
            <div>
              <p className="text-lg font-semibold text-gray-800">{weather.temp}°C</p>
              <p className="text-gray-600 capitalize">{weather.description}</p>
            </div>
          </div>
        )}

        <p className="text-lg text-gray-600">
          Le MitchTennisClub est un lieu où passion et convivialité se
          rencontrent. Profitez de nos courts de tennis de qualité, participez à
          des tournois excitants et rejoignez une communauté dynamique de
          joueurs de tous niveaux.
        </p>
      </section>

      {/* Carrousel d'images */}
      <section className="relative w-full max-w-6xl mt-10">
        <div className="overflow-hidden rounded-lg shadow-lg w-full h-96 md:h-[500px] relative">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Club image ${index + 1}`}
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </section>
    </div>
  );
}
