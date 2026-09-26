import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Avtorizatsiyadan o'tilmagan. Iltimos, tizimga kiring." },
        { status: 401 }
      );
    }

    const params = await props.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Taklif identifikatori ko'rsatilmadi." },
        { status: 400 }
      );
    }

    const currentUserId = (session.user as any).id;

    // Find the offer to verify existence and ownership
    const offer = await prisma.supplierOffer.findUnique({
      where: { id },
      select: { id: true, userId: true, productName: true, companyName: true },
    });

    if (!offer) {
      return NextResponse.json(
        { error: "Taklif topilmadi yoki allaqachon o'chirilgan." },
        { status: 404 }
      );
    }

    // Strict ownership verification: only the creator can delete their taklif
    if (offer.userId !== currentUserId) {
      return NextResponse.json(
        { error: "Siz faqat o'zingiz kiritgan takliflarni o'chira olasiz." },
        { status: 403 }
      );
    }

    // Delete the offer
    await prisma.supplierOffer.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Taklif muvaffaqiyatli o'chirildi.",
      deletedId: id,
    });
  } catch (error) {
    console.error("DELETE /api/marketplace/offers/[id] error:", error);
    return NextResponse.json(
      { error: "Taklifni o'chirishda kutilmagan xatolik yuz berdi." },
      { status: 500 }
    );
  }
}
