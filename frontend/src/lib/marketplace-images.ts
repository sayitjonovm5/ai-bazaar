export interface ProductImageData {
  local: string;
  online: string;
}

export const SELLER_AVATARS = [
  "/images/avatars/person-1.jpg",
  "/images/avatars/person-2.jpg",
  "/images/avatars/person-3.jpg",
  "/images/avatars/person-4.jpg",
];

/**
 * Returns a deterministic, realistic seller portrait avatar.
 */
export function getSellerAvatar(user?: { id?: string | null; name?: string | null; email?: string | null; profilePicture?: string | null } | null): string {
  if (user?.profilePicture && user.profilePicture.trim().length > 0) {
    return user.profilePicture.trim();
  }
  const key = user?.id || user?.email || user?.name || "seller-avatar";
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % SELLER_AVATARS.length;
  return SELLER_AVATARS[index];
}

export const COMMODITY_IMAGE_MAP: Record<string, ProductImageData> = {
  fuel: {
    local: "/images/products/fuel.jpg",
    online: "/images/products/fuel.jpg",
  },
  cotton: {
    local: "/images/products/cotton.jpg",
    online: "/images/products/cotton.jpg",
  },
  cement: {
    local: "/images/products/cement.jpg",
    online: "/images/products/cement.jpg",
  },
  oil: {
    local: "/images/products/oil.jpg",
    online: "/images/products/oil.jpg",
  },
  metal: {
    local: "/images/products/metal.jpg",
    online: "/images/products/metal.jpg",
  },
  grain: {
    local: "/images/products/grain.jpg",
    online: "/images/products/grain.jpg",
  },
  polymer: {
    local: "/images/products/polymer.jpg",
    online: "/images/products/polymer.jpg",
  },
  fertilizer: {
    local: "/images/products/fertilizer.jpg",
    online: "/images/products/fertilizer.jpg",
  },
  coal: {
    local: "/images/products/coal.jpg",
    online: "/images/products/coal.jpg",
  },
  trade: {
    local: "/images/products/trade.jpg",
    online: "/images/products/trade.jpg",
  },
};

/**
 * Returns the best matching product image key based on product name and/or category.
 */
export function resolveCommodityKey(productName?: string, category?: string): string {
  const name = (productName || "").toLowerCase();
  const cat = (category || "").toLowerCase();

  // Match by specific keywords in product name
  if (name.includes("paxta") || name.includes("cotton") || name.includes("tola")) {
    return "cotton";
  }
  if (name.includes("benzin") || name.includes("yoqilg'i") || name.includes("dizel") || name.includes("gaz") || name.includes("propan") || name.includes("metan")) {
    return "fuel";
  }
  if (name.includes("sement") || name.includes("cement") || name.includes("beton") || name.includes("ohangaron") || name.includes("g'isht")) {
    return "cement";
  }
  if (name.includes("sanoat moyi") || name.includes("moyi") || name.includes("moy") || name.includes("oil") || name.includes("lubricant") || name.includes("neft")) {
    return "oil";
  }
  if (name.includes("metall") || name.includes("armatura") || name.includes("po'lat") || name.includes("stal") || name.includes("quvur") || name.includes("truba") || name.includes("temir")) {
    return "metal";
  }
  if (name.includes("bug'doy") || name.includes("don") || name.includes("un") || name.includes("shakar") || name.includes("arpa") || name.includes("makkajo'xori") || name.includes("guruch")) {
    return "grain";
  }
  if (name.includes("polimer") || name.includes("polietilen") || name.includes("plastmassa") || name.includes("granula") || name.includes("polipropilen")) {
    return "polymer";
  }
  if (name.includes("o'g'it") || name.includes("karbamid") || name.includes("azot") || name.includes("fosfat") || name.includes("selitra") || name.includes("kimyo")) {
    return "fertilizer";
  }
  if (name.includes("ko'mir") || name.includes("coal")) {
    return "coal";
  }

  // Match by category
  if (cat.includes("yoqilg'i") || cat.includes("fuel")) return "fuel";
  if (cat.includes("metallurgiya") || cat.includes("metal")) return "metal";
  if (cat.includes("qurilish") || cat.includes("construction")) return "cement";
  if (cat.includes("qishloq") || cat.includes("oziq-ovqat") || cat.includes("agri")) return "cotton";
  if (cat.includes("kimyo") || cat.includes("fertilizer")) return "fertilizer";
  if (cat.includes("polimer") || cat.includes("plastmassa") || cat.includes("polymer")) return "polymer";

  return "trade";
}

/**
 * Returns a reliable local image path for the commodity.
 */
export function getProductLocalImage(productName?: string, category?: string): string {
  const key = resolveCommodityKey(productName, category);
  return COMMODITY_IMAGE_MAP[key]?.local || COMMODITY_IMAGE_MAP.trade.local;
}

/**
 * Returns a high-resolution online image URL for the commodity.
 */
export function getProductOnlineImage(productName?: string, category?: string): string {
  const key = resolveCommodityKey(productName, category);
  return COMMODITY_IMAGE_MAP[key]?.online || COMMODITY_IMAGE_MAP.trade.online;
}

/**
 * Returns the primary image for a taklif/product.
 * If provided imageUrl is valid and not empty, it returns it;
 * otherwise it returns the best commodity fallback image.
 */
export function getOfferImageUrl(
  imageUrl?: string | null,
  productName?: string,
  category?: string
): string {
  if (imageUrl && imageUrl.trim().length > 0) {
    return imageUrl.trim();
  }
  return getProductLocalImage(productName, category);
}
