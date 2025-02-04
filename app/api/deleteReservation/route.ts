import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  try {
    const { reservationId } = await req.json();

    if (!reservationId) {
      return NextResponse.json({ error: "ID de réservation manquant" }, { status: 400 });
    }

    await prisma.reservation.delete({
      where: { id: reservationId },
    });

    return NextResponse.json({ message: "Réservation annulée" });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
