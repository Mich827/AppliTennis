//api/annonces/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Créer une annonce
export async function POST(req: Request) {
  try {
    const { niveau, dispo, message } = await req.json();

    // 🚀 Récupérer l'utilisateur connecté depuis localStorage côté client
    const storedUserId = req.headers.get("userId"); // On récupère l'userId envoyé par le client
    const storedUserName = req.headers.get("userName");

    if (!storedUserId || !storedUserName) {
      return NextResponse.json({ error: "Utilisateur non identifié" }, { status: 401 });
    }

    const annonce = await prisma.annonce.create({
      data: {
        userId: parseInt(storedUserId), // Assurez-vous que c'est un nombre
        userName: storedUserName,
        niveau,
        dispo,
        message,
      },
    });

    return NextResponse.json({ annonce });
  } catch (error) {
    console.error("Erreur lors de la création de l'annonce :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
