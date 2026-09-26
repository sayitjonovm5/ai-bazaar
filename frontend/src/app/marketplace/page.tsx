import { prisma } from "@/lib/prisma";
import ImageFallback from "@/components/ImageFallback";
import ProductIcon from "@/components/ProductIcon";
import { User, Phone, Calendar, Store, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import MarketplaceSearch from "./MarketplaceSearch";
import { formatDate } from "@/lib/market-ui";
import ConvertedPrice from "@/components/ConvertedPrice";

export default async function MarketplacePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams?.q || "";
  let offers: any[] = [];
  try {
    offers = await prisma.supplierOffer.findMany({
      where: q ? {
        OR: [
          { productName: { contains: q } },
          { companyName: { contains: q } },
          { description: { contains: q } }
        ]
      } : undefined,
      orderBy: { createdAt: "desc" },
      include: { user: true }
    });
  } catch (error) {
    console.error("Marketplace offers fetch error:", error);
    offers = [];
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8 bg-white/70 backdrop-blur-2xl p-8 rounded-3xl border border-white/60 shadow-xs relative overflow-hidden">
        
        <div className="absolute top-8 right-8 z-20 flex flex-col gap-3">
          <Link href="/marketplace/add" className="bg-blue-600/90 hover:bg-blue-600 text-white backdrop-blur-md px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-600/20">
            + Taklif qo'shish
          </Link>
          <Link href="/profile" className="bg-white/60 hover:bg-white/90 text-slate-700 backdrop-blur-md border border-white/70 px-5 py-2.5 rounded-xl text-sm font-medium transition-all text-center shadow-2xs">
            Profilni tahrirlash
          </Link>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">B2B Marketplace</h1>
          <p className="text-slate-600 max-w-2xl text-lg">
            Barcha mahsulotlar uchun global ta'minotchilar takliflari bir joyda. Eng yaxshi narxlarni toping va ishonchli hamkorlar bilan bog'laning.
          </p>
          <MarketplaceSearch />
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
           <Store className="w-48 h-48 text-slate-900" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {offers.map((offer: any) => (
          <div key={offer.id} className="group bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg hover:bg-white/90 transition-all duration-200 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/50 flex items-center justify-between bg-white/40 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <ProductIcon name={offer.productName} size="sm" />
                <span className="font-semibold text-sm text-slate-800 truncate max-w-[120px]">{offer.productName}</span>
              </div>
              <Link href={`/product/${encodeURIComponent(offer.productName)}`} className="text-xs text-blue-600 font-medium hover:underline">
                Tahlil &rarr;
              </Link>
            </div>
            {offer.imageUrl ? (
              <div className="w-full h-48 bg-slate-100/60 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={offer.imageUrl} alt={offer.companyName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ) : (
              <div className="w-full h-32 bg-gradient-to-br from-white/40 to-slate-100/60 flex items-center justify-center">
                 <ProductIcon name={offer.productName} size="xl" showCategoryHint={false} />
              </div>
            )}

            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4 border-b border-white/50 pb-4">
                <div className="w-10 h-10 rounded-full bg-white/70 overflow-hidden border border-white/80 flex-shrink-0 flex items-center justify-center shadow-2xs">
                  {offer.user?.profilePicture ? (
                    <ImageFallback
                      key={offer.user.profilePicture}
                      src={offer.user.profilePicture}
                      alt=""
                      className="h-full w-full object-cover"
                      fallback={<User size={15} className="text-gray-400" />}
                    />
                  ) : (
                    <User className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Sotuvchi</p>
                  <p className="text-sm font-semibold text-slate-800 line-clamp-1">{offer.user?.name || "Foydalanuvchi"}</p>
                </div>
              </div>
  
              <h3 className="font-bold text-slate-900 text-lg mb-1">{offer.companyName}</h3>
              <p className="text-2xl font-bold text-emerald-600 mb-4">{Number(offer.price).toLocaleString()} UZS</p>
              
              <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3">{offer.description}</p>
              
              <div className="flex flex-col gap-3 mt-auto">
                {(offer.phoneNumber || offer.contact) ? (
                  <a href={`tel:${offer.phoneNumber || offer.contact}`} className="flex items-center justify-center w-full py-2.5 bg-blue-600/10 text-blue-700 hover:bg-blue-600 hover:text-white backdrop-blur-md border border-blue-600/20 rounded-xl font-medium text-sm gap-2 transition-all shadow-2xs">
                    <Phone className="w-4 h-4" />
                    {offer.phoneNumber || offer.contact}
                  </a>
                ) : null}
                <div className="flex items-center text-xs text-slate-400 justify-between">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(offer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {offers.length === 0 && (
        <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-3xl border border-white/60 border-dashed">
           <h3 className="text-xl font-medium text-slate-500">Hozircha hech qanday taklif yo'q</h3>
        </div>
      )}
    </div>
  );
}
