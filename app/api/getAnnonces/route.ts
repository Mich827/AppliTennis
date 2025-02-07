import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const annonces = await prisma.annonce.findMany({
      orderBy: { createdAt: "desc" }, // Trier par date de création
    });

    return NextResponse.json({ annonces });
  } catch (error) {
    console.error("Erreur lors du chargement des annonces :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
