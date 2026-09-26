import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  
  return NextResponse.json({ name: user.name, profilePicture: user.profilePicture });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const body = await req.json();

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: body.name,
      profilePicture: body.profilePicture,
    },
  });

  return NextResponse.json({ success: true, user });
}
