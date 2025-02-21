import { useState } from "react";

export default function AI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Une erreur est survenue");

      setAnswer(data.answer);
      setQuestion(""); // 🔥 Réinitialisation du champ après validation
    } catch  {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
        Posez une question
      </h1>

      <textarea
        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
        placeholder="Tapez votre question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        className="w-full mt-3 bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300 hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
        onClick={handleAsk}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 border-2 border-t-white border-blue-500 rounded-full"
              viewBox="0 0 24 24"
            ></svg>
            En cours...
          </span>
        ) : (
          "Poser la question"
        )}
      </button>

      {error && (
        <p className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          ❌ {error}
        </p>
      )}

      {answer && (
        <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-md">
          <h2 className="font-semibold text-gray-700">Réponse :</h2>
          <p className="text-gray-900 mt-1">{answer}</p>
        </div>
      )}
    </div>
  );
}

