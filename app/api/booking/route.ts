import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { court, date, startTime, userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    if (!court || !date || !startTime || !userId) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    // Vérifier si la réservation existe déjà
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        court,
        date: new Date(date),
        startTime,
      },
    });

    if (existingReservation) {
      return NextResponse.json({ error: "Ce créneau est déjà réservé." }, { status: 400 });
    }

    // Obtenir les détails de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Créer la réservation
    const newReservation = await prisma.reservation.create({
      data: {
        court,
        date: new Date(date),
        startTime,
        endTime: startTime + 1, // Le créneau dure 1 heure
        userId,
        
      },
    });

    return NextResponse.json({
      message: "Réservation réussie",
      reservation: { ...newReservation, userName: user.name }, // Inclure le nom de l'utilisateur
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
