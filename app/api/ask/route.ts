import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question) {
      return new Response(JSON.stringify({ message: "Aucune question fournie" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: question }] }]
      }),
    });

    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Aucune réponse trouvée.";

    return new Response(JSON.stringify({ answer }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (error: unknown) {
    console.error("Erreur API Gemini:", error);
    return new Response(JSON.stringify({ 
      message: "Erreur du serveur", 
      error: String(error) 
    }), {
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
  
  
}

