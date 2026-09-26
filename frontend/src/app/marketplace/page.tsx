import { prisma } from "@/lib/prisma";
import ImageFallback from "@/components/ImageFallback";
import ProductIcon from "@/components/ProductIcon";
import { User, Phone, Calendar, Store, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import MarketplaceSearch from "./MarketplaceSearch";
import { formatDate } from "@/lib/market-ui";
import ConvertedPrice from "@/components/ConvertedPrice";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q?.trim() || "";
  const offers = await prisma.supplierOffer.findMany({
    where: q
      ? {
          OR: [
            { productName: { contains: q } },
            { companyName: { contains: q } },
            { description: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
  return (
    <div className="page-shell">
      <header className="surface relative mb-7 overflow-hidden p-5 sm:p-7">
        <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div className="min-w-0 max-w-2xl">
            <div className="eyebrow">Biznes uchun hamkorlik</div>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              B2B Marketplace
            </h1>
            <p className="mt-3 max-w-xl text-sm text-gray-500">
              Ta’minotchilar takliflarini bir joyda ko‘ring. Narxlarni
              solishtiring va hamkorlar bilan bog‘laning.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 md:flex-col">
            <Link href="/marketplace/add" className="button-primary">
              <Plus size={16} />
              Taklif qo‘shish
            </Link>
            <Link href="/profile" className="button-secondary">
              <User size={15} />
              Profilni tahrirlash
            </Link>
          </div>
        </div>
        <MarketplaceSearch />
      </header>
      <p className="mb-4 text-xs text-gray-500">
        <span className="font-semibold text-gray-900">{offers.length}</span> ta
        taklif{q ? " topildi" : " mavjud"}
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {offers.map((offer) => (
          <article
            key={offer.id}
            className="surface group flex min-w-0 flex-col overflow-hidden transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 bg-gray-50/50 p-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <ProductIcon name={offer.productName} size="sm" />
                <span
                  className="truncate text-xs font-medium text-gray-700"
                  title={offer.productName}
                >
                  {offer.productName}
                </span>
              </div>
              <Link
                href={"/product/" + encodeURIComponent(offer.productName)}
                aria-label={offer.productName + ": tahlil"}
                className="shrink-0 rounded-lg p-2 text-blue-600 hover:bg-blue-50"
              >
                <ArrowUpRight size={16} />
              </Link>
            </div>
            {offer.imageUrl ? (
              <div className="h-44 w-full overflow-hidden bg-gray-100">
                <ImageFallback
                  key={offer.imageUrl}
                  src={offer.imageUrl}
                  alt={offer.productName}
                  className="h-full w-full object-cover"
                  fallback={
                    <div className="flex h-full items-center justify-center bg-gray-50">
                      <ProductIcon name={offer.productName} size="xl" />
                    </div>
                  }
                />
              </div>
            ) : (
              <div className="flex h-44 items-center justify-center bg-gray-50">
                <ProductIcon
                  name={offer.productName}
                  size="xl"
                  showCategoryHint={false}
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-4 flex items-center gap-2.5 border-b border-gray-100 pb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                  {offer.user?.profilePicture ? (
                    <ImageFallback
                      key={offer.user.profilePicture}
                      src={offer.user.profilePicture}
                      alt=""
                      className="h-full w-full object-cover"
                      fallback={<User size={15} className="text-gray-400" />}
                    />
                  ) : (
                    <User size={15} className="text-gray-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-500">Sotuvchi</p>
                  <p className="truncate text-xs font-medium">
                    {offer.user?.name || "Foydalanuvchi"}
                  </p>
                </div>
              </div>
              <h2 className="mb-1 break-words text-sm font-semibold">
                {offer.companyName}
              </h2>
              <div className="mb-4 break-words text-xl font-semibold tracking-tight tabular-nums">
                <ConvertedPrice price={offer.price} />
              </div>
              <p className="mb-5 line-clamp-3 flex-1 text-xs text-gray-500">
                {offer.description ||
                  "Qo‘shimcha ma’lumot uchun sotuvchi bilan bog‘laning."}
              </p>
              <div className="mt-auto flex flex-col gap-3">
                {offer.phoneNumber ? (
                  <a
                    href={"tel:" + offer.phoneNumber}
                    className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-50 px-2 text-xs font-semibold text-blue-700 hover:bg-blue-600 hover:text-white"
                  >
                    <Phone size={14} />
                    {offer.phoneNumber}
                  </a>
                ) : (
                  <span className="text-xs text-gray-500">
                    Telefon ko‘rsatilmagan
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <Calendar size={12} />
                  {formatDate(offer.createdAt.toISOString())}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!offers.length && (
        <div className="surface empty-state">
          <Store />
          <h2>{q ? "Mos taklif topilmadi" : "Hozircha takliflar yo‘q"}</h2>
          <p>
            {q
              ? "Boshqa mahsulot yoki kompaniya nomi bilan qidirib ko‘ring."
              : "Birinchi taklifni joylang va mahsulotingizni xaridorlarga tanishtiring."}
          </p>
          <Link
            href={q ? "/marketplace" : "/marketplace/add"}
            className="button-secondary"
          >
            {q ? "Barcha takliflar" : "Taklif qo‘shish"}
          </Link>
        </div>
      )}
    </div>
  );
}
