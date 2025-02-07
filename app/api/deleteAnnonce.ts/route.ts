import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "ID requis" }, { status: 400 });
    }

    // 🔥 Suppression de l'annonce avec Prisma
    await prisma.annonce.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Annonce supprimée avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur suppression annonce:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
