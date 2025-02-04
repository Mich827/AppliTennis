import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  const userId = url.searchParams.get("userId");

  console.log("Date reçue:", date);
  console.log("UserID reçu:", userId);

  if (!date || !userId) {
    return NextResponse.json({ error: "Date ou utilisateur manquant" }, { status: 400 });
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        date: new Date(date),
      },
      include: {
        user: true, // Assure-toi que le modèle Reservation a bien une relation "user"
      },
    });

    console.log("Réservations récupérées :", reservations);

    return NextResponse.json({
      reservations: reservations.map((res) => ({
        court: res.court,
        startTime: res.startTime,
        userName: res.user?.name || "Inconnu",
      })),
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur de serveur" }, { status: 500 });
  }
}
