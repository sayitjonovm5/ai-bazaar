import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const productName = decodeURIComponent(params.id);
  
  const suppliers = await prisma.supplierOffer.findMany({
    where: { productName },
    orderBy: { price: 'asc' }
  });

  return NextResponse.json(suppliers);
}

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = await props.params;
  const productName = decodeURIComponent(params.id);
  const body = await req.json();
  
  const userId = (session.user as any).id;
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!userExists) {
    return NextResponse.json({ error: "Sizning hisobingiz topilmadi, iltimos tizimdan chiqib qayta kiring." }, { status: 401 });
  }

  const offer = await prisma.supplierOffer.create({
    data: {
      productName,
      companyName: body.name,
      price: parseFloat(body.price),
      contact: body.contact,
      description: body.description,
      imageUrl: body.imageUrl,
      userId: (session.user as any).id
    }
  });

  return NextResponse.json(offer);
}
