// app/api/login/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé." }, { status: 401 });
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user.id, name: user.name }, SECRET_KEY, { expiresIn: "1h" });

    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } }, { status: 200 });
  } catch  {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
