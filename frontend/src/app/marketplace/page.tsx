import { prisma } from "@/lib/prisma";
import ImageFallback from "@/components/ImageFallback";
import ProductIcon from "@/components/ProductIcon";
import { User, Phone, Calendar, Store, Plus, ArrowUpRight, Tag } from "lucide-react";
import Link from "next/link";
import MarketplaceFilterBar from "./MarketplaceFilterBar";
import { formatDate } from "@/lib/market-ui";
import ConvertedPrice from "@/components/ConvertedPrice";
import { inferCategoryFromName } from "@/lib/product-categories";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MarketplaceImage from "@/components/MarketplaceImage";
import DeleteOfferButton from "@/components/DeleteOfferButton";
import { getSellerAvatar } from "@/lib/marketplace-images";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id;

  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams?.q?.trim() || "";
  const selectedCategory = resolvedSearchParams?.category || "All";

  let offers: any[] = [];
  try {
    offers = await prisma.supplierOffer.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
  } catch (error) {
    console.error("Marketplace offers fetch error:", error);
    offers = [];
  }

  // Attach inferred category to each offer
  const offersWithCategory = offers.map((offer) => ({
    ...offer,
    category: inferCategoryFromName(offer.productName),
  }));

  // Filter offers by category and search query
  const filteredOffers = offersWithCategory.filter((offer) => {
    const matchesCategory =
      selectedCategory === "All" || offer.category === selectedCategory;

    if (!matchesCategory) return false;

    if (!q) return true;

    const lowerQ = q.toLowerCase();
    const matchesProduct = offer.productName.toLowerCase().includes(lowerQ);
    const matchesCompany = offer.companyName.toLowerCase().includes(lowerQ);
    const matchesDesc = (offer.description || "").toLowerCase().includes(lowerQ);
    const matchesCat = (offer.category || "").toLowerCase().includes(lowerQ);

    return matchesProduct || matchesCompany || matchesDesc || matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header Banner */}
      <div className="mb-8 bg-white/70 backdrop-blur-2xl p-8 rounded-3xl border border-white/60 shadow-xs relative overflow-hidden">
        <div className="absolute top-8 right-8 z-20 flex flex-col sm:flex-row gap-3">
          <Link
            href="/marketplace/add"
            className="bg-blue-600/90 hover:bg-blue-600 text-white backdrop-blur-md px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-600/20 text-center"
          >
            + Taklif qo'shish
          </Link>
          <Link
            href="/profile"
            className="bg-white/60 hover:bg-white/90 text-slate-700 backdrop-blur-md border border-white/70 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all text-center shadow-2xs"
          >
            Profilni tahrirlash
          </Link>
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-100/70 px-2.5 py-1 rounded-full border border-blue-200/50">
              B2B Savdo Maydonchasi
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {filteredOffers.length} ta faol taklif
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            B2B Marketplace
          </h1>
          <p className="text-slate-600 text-base md:text-lg">
            Barcha tovar va xomashyolar uchun global ta'minotchilar takliflari bir joyda. Real-vaqt valyuta konvertatsiyasi va toifalar bo'yicha saralash.
          </p>

          {/* Interactive Search Bar, Category Filter & Currency Switcher */}
          <MarketplaceFilterBar />
        </div>

        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Store className="w-64 h-64 text-slate-900" />
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredOffers.map((offer: any) => {
          const isOwner = Boolean(currentUserId && offer.userId === currentUserId);

          return (
            <div
              key={offer.id}
              className={`group bg-white/75 backdrop-blur-xl border ${
                isOwner ? "border-blue-300/80 shadow-[0_8px_30px_rgb(59,130,246,0.08)] ring-1 ring-blue-500/20" : "border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              } hover:shadow-lg hover:bg-white/90 transition-all duration-200 rounded-2xl flex flex-col overflow-hidden relative`}
            >
              {/* Header with Product Icon, Category & Actions */}
              <div className="p-4 border-b border-white/50 flex items-center justify-between bg-white/40 backdrop-blur-sm gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <ProductIcon name={offer.productName} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-slate-800 truncate block">
                        {offer.productName}
                      </span>
                      {isOwner && (
                        <span className="text-[9px] uppercase tracking-wider font-bold bg-amber-100/90 text-amber-800 border border-amber-300/80 px-1.5 py-0.5 rounded-md shrink-0 shadow-2xs">
                          Sizniki
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200/60 inline-block">
                      {offer.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/product/${encodeURIComponent(offer.productName)}`}
                    className="text-xs text-blue-600 font-medium hover:underline flex items-center"
                  >
                    Tahlil <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                  </Link>

                  {/* Delete button only visible to the owner */}
                  {isOwner && (
                    <DeleteOfferButton
                      offerId={offer.id}
                      productName={offer.productName}
                    />
                  )}
                </div>
              </div>

              {/* Product Image with multi-layer fallback & online support */}
              <div className="w-full h-44 bg-slate-100/60 relative overflow-hidden group/img">
                <MarketplaceImage
                  src={offer.imageUrl}
                  productName={offer.productName}
                  category={offer.category}
                  alt={offer.productName || offer.companyName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-semibold text-white tracking-wide border border-white/20">
                  {offer.category}
                </div>
              </div>

            {/* Offer Body */}
            <div className="p-5 flex-1 flex flex-col">
              {/* Seller info */}
              <div className="flex items-center gap-3 mb-4 border-b border-white/50 pb-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-white/80 shrink-0 shadow-2xs relative">
                  <ImageFallback
                    key={offer.user?.profilePicture || offer.user?.id || offer.id}
                    src={getSellerAvatar(offer.user)}
                    alt={offer.user?.name || offer.companyName || "Sotuvchi"}
                    className="h-full w-full object-cover"
                    fallback={<User size={18} className="text-gray-400 m-auto" />}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-slate-400 font-medium">Sotuvchi</p>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-full font-semibold">
                      Tasdiqlangan
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {offer.user?.name || (offer.user?.email ? offer.user.email.split("@")[0] : "Savdo vakili")}
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-base mb-1 truncate">
                {offer.companyName}
              </h3>

              {/* Dynamic Currency Converted Price */}
              <div className="text-2xl font-bold text-emerald-600 mb-3 tracking-tight">
                <ConvertedPrice price={offer.price} />
              </div>

              <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3">
                {offer.description || "Mahsulot haqida qo'shimcha ma'lumot ko'rsatilmagan."}
              </p>

              {/* Contact Buttons */}
              <div className="flex flex-col gap-3 mt-auto">
                {offer.phoneNumber || offer.contact ? (
                  <a
                    href={`tel:${offer.phoneNumber || offer.contact}`}
                    className="flex items-center justify-center w-full py-2.5 bg-blue-600/10 text-blue-700 hover:bg-blue-600 hover:text-white backdrop-blur-md border border-blue-600/20 rounded-xl font-semibold text-sm gap-2 transition-all shadow-2xs"
                  >
                    <Phone className="w-4 h-4" />
                    {offer.phoneNumber || offer.contact}
                  </a>
                ) : null}

                <div className="flex items-center text-xs text-slate-400 justify-between">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />{" "}
                    {new Date(offer.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: #{offer.id.slice(-6)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredOffers.length === 0 && (
        <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-3xl border border-white/60 border-dashed">
          <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            Hech qanday taklif topilmadi
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Tanlangan qidiruv yoki kategoriya bo'yicha hozircha takliflar mavjud emas.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
          >
            Filtrlarni tozalash
          </Link>
        </div>
      )}
    </div>
  );
}
