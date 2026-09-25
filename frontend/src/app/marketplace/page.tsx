import { prisma } from "@/lib/prisma";
import ProductIcon from "@/components/ProductIcon";
import { Phone, Calendar, Store } from "lucide-react";
import Link from "next/link";

export default async function MarketplacePage() {
  const offers = await prisma.supplierOffer.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">B2B Marketplace</h1>
          <p className="text-gray-500 max-w-2xl text-lg">
            Barcha mahsulotlar uchun global ta'minotchilar takliflari bir joyda. Eng yaxshi narxlarni toping va ishonchli hamkorlar bilan bog'laning.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
           <Store className="w-48 h-48" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {offers.map((offer: any) => (
          <div key={offer.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <ProductIcon name={offer.productName} size="sm" />
                <span className="font-medium text-sm text-gray-700 truncate max-w-[120px]">{offer.productName}</span>
              </div>
              <Link href={`/product/${encodeURIComponent(offer.productName)}`} className="text-xs text-blue-600 hover:underline">
                Tahlil &rarr;
              </Link>
            </div>
            
            {offer.imageUrl ? (
              <div className="w-full h-48 bg-gray-100 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={offer.imageUrl} alt={offer.companyName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ) : (
              <div className="w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                 <ProductIcon name={offer.productName} size="xl" showCategoryHint={false} />
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-gray-900 text-lg mb-1">{offer.companyName}</h3>
              <p className="text-2xl font-bold text-emerald-600 mb-4">{Number(offer.price).toLocaleString()} UZS</p>
              
              <p className="text-sm text-gray-600 mb-6 flex-1 line-clamp-3">{offer.description}</p>
              
              <div className="flex flex-col gap-3 mt-auto">
                <a href={`tel:${offer.contact}`} className="flex items-center justify-center w-full py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors rounded-xl font-medium text-sm gap-2">
                  <Phone className="w-4 h-4" />
                  {offer.contact}
                </a>
                <div className="flex items-center text-xs text-gray-400 justify-between">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(offer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {offers.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
           <h3 className="text-xl font-medium text-gray-500">Hozircha hech qanday taklif yo'q</h3>
        </div>
      )}
    </div>
  );
}
