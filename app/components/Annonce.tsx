//components/Annonce.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Annonce {
  id: number;
  userId: number;
  userName: string;
  niveau: string;
  dispo: string;
  message: string;
  createdAt: Date;
}
const AnnonceForm = () => {
  const [userName, setUserName] = useState("");
  const [niveau, setNiveau] = useState("");
  const [dispo, setDispo] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName); // 🔥 Remplit automatiquement le champ Nom
    }
  }, []);
  
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
    } catch  {
      toast.error("Impossible de charger les annonces");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!niveau || !dispo || !message) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }
  
    const storedUserId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("userName");
  
    if (!storedUserId || !storedUserName) {
      toast.error("Utilisateur non identifié !");
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch("/api/annonces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "userId": storedUserId, // 🔥 On envoie l'ID de l'utilisateur
          "userName": storedUserName,
        },
        body: JSON.stringify({ niveau, dispo, message }),
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'annonce");
      }
  
      const data = await response.json();
      toast.success("Annonce publiée !");
  
      setAnnonces((prev) => [data.annonce, ...prev]);
  
      setNiveau("");
      setDispo("");
      setMessage("");
    } catch  {
      toast.error("Erreur serveur, réessayez plus tard");
    }
    setLoading(false);
  };
  
  const handleDelete = async (annonceId: number) => {
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
      setAnnonces((prev) => prev.filter((annonce) => annonce.id !== Number(annonceId)));
    } catch  {
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
        <select
        value={niveau}
        onChange={(e) => setNiveau(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Sélectionnez votre niveau</option>
        <option value="Débutant">Débutant</option>
        <option value="Intermédiaire">Intermédiaire</option>
        <option value="Avancé">Avancé</option>
      </select>
      
        <select
        value={dispo}
          onChange={(e) => setDispo(e.target.value)}
          className="w-full p-2 border rounded"
        >
         <option value="">Sélectionnez vos disponibilités</option>
         <option value="Matin">Matin</option>
         <option value="Aprés-midi">Aprés-midi</option>
          <option value="Soir">Soir</option>
          <option value="Week-end">Week-end</option>
          <option value="Soir et Week-end">Soir et Week-end</option>
          </select>
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

      
    </div>
  );
};

export default AnnonceForm;


