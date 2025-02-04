import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Récupérer les messages entre deux utilisateurs
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = parseInt(searchParams.get("userId") || "0");
  const recipientId = parseInt(searchParams.get("recipientId") || "0");

  if (!userId || !recipientId) {
    return NextResponse.json({ error: "Utilisateurs invalides" }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: recipientId },
        { senderId: recipientId, receiverId: userId },
      ],
    },
    orderBy: { timestamp: "asc" },
  });

  return NextResponse.json(messages);
}

// Envoyer un message
export async function POST(req: Request) {
  const { senderId, receiverId, content } = await req.json();

  if (!senderId || !receiverId || !content) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: { senderId, receiverId, content },
  });

  return NextResponse.json(message, { status: 201 });
}
