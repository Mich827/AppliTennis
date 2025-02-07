import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TennisQA from "./AI";

const AnnonceForm = () => {
  const [userName, setUserName] = useState("");
  const [niveau, setNiveau] = useState("");
  const [dispo, setDispo] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [annonces, setAnnonces] = useState([]); // Stocke les annonces

  // Charger les annonces au montage du composant
  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      const response = await fetch("/api/getAnnonces", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des annonces");
      }

      const data = await response.json();
      setAnnonces(data.annonces);
    } catch (error) {
      toast.error("Impossible de charger les annonces");
    }
  };

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

      // Mettre à jour la liste des annonces après la publication
      setAnnonces((prev) => [data.annonce, ...prev]);

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
  const handleDelete = async (annonceId: string) => {
    try {
      const response = await fetch("/api/deleteAnnonce", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: annonceId }),
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'annonce");
      }
  
      toast.success("Annonce supprimée !");
      setAnnonces((prev) => prev.filter((annonce) => annonce.id !== annonceId));
    } catch (error) {
      toast.error("Impossible de supprimer l'annonce");
    }
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

      {/* Affichage des annonces */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Annonces récentes</h2>
        {annonces.length === 0 ? (
          <p>Aucune annonce pour le moment.</p>
        ) : (
          <ul className="space-y-4">
  {annonces.map((annonce) => (
    <li key={annonce.id} className="p-4 border rounded shadow flex justify-between items-center">
      <div>
        <p className="font-bold">{annonce.userName} ({annonce.niveau})</p>
        <p><strong>Dispo :</strong> {annonce.dispo}</p>
        <p>{annonce.message}</p>
        <p className="text-sm text-gray-500">
          Publiée le {new Date(annonce.createdAt).toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={() => handleDelete(annonce.id)}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Supprimer
      </button>
    </li>
  ))}
</ul>


        )}
      </div>

      <TennisQA />
    </div>
  );
};

export default AnnonceForm;


