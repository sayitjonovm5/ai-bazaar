import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email va parol kiritilishi shart." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Bunday foydalanuvchi mavjud emas." },
        { status: 404 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { error: "Kiritilgan parol noto'g'ri." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Kiritilgan parol noto'g'ri." },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Validate login error:", error);
    return NextResponse.json(
      { error: "Server bilan bog'lanishda xatolik." },
      { status: 500 }
    );
  }
}
