import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date"); // Permet de filtrer par date si besoin

  try {
    const reservations = await prisma.reservation.findMany({
      where: date ? { date: new Date(date) } : undefined, // Filtre si une date est fournie
      include: { user: true }, // Inclut les infos utilisateur
    });

    return NextResponse.json({
      reservations: reservations.map((res) => ({
        id: res.id,
        court: res.court,
        date: res.date.toISOString().split("T")[0], // Format YYYY-MM-DD
        startTime: res.startTime,
        userName: res.user?.name || "Inconnu",
      })),
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
