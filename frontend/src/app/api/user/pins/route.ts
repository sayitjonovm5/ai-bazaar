import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pins = await prisma.pinnedProduct.findMany({
    where: { userId: (session.user as any).id },
    select: { productName: true }
  });

  return NextResponse.json(pins.map(p => p.productName));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productName } = await req.json();

  const pin = await prisma.pinnedProduct.create({
    data: {
      userId: (session.user as any).id,
      productName
    }
  });

  return NextResponse.json(pin);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productName } = await req.json();

  await prisma.pinnedProduct.deleteMany({
    where: {
      userId: (session.user as any).id,
      productName
    }
  });

  return NextResponse.json({ success: true });
}
