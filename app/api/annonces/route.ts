import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Créer une annonce
export async function POST(req: Request) {
  try {
    const { userName, niveau, dispo, message } = await req.json();

    if (!userName || !niveau || !dispo || !message) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const annonce = await prisma.annonce.create({
      data: { userId: 1, userName, niveau, dispo, message }, // Remplace 1 par l'ID réel de l'utilisateur
    });
    

    return NextResponse.json({ annonce });
  } catch (error) {
    console.error("Erreur lors de la création de l'annonce :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
