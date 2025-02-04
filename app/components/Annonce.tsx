import React, { useState } from "react";
import { toast } from "react-toastify";
import TennisQA from "./AI";
const AnnonceForm = () => {
  const [userName, setUserName] = useState("");
  const [niveau, setNiveau] = useState("");
  const [dispo, setDispo] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !niveau || !dispo || !message) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/annonces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, niveau, dispo, message }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'annonce");
      }

      const data = await response.json();
      toast.success("Annonce publiée !");
      
      // Réinitialiser le formulaire après validation
      setUserName("");
      setNiveau("");
      setDispo("");
      setMessage("");
    } catch (error) {
      toast.error("Erreur serveur, réessayez plus tard");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Publier une annonce</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Votre Nom"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Niveau (Débutant, Intermédiaire, Avancé)"
          value={niveau}
          onChange={(e) => setNiveau(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Disponibilités (ex: Soir, Week-end)"
          value={dispo}
          onChange={(e) => setDispo(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Publication..." : "Publier"}
        </button>
      </form>
      <TennisQA/>
    </div>
  );
};

export default AnnonceForm;

