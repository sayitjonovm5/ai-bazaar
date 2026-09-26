export interface ProductImageData {
  local: string;
  online: string;
}

export const COMMODITY_IMAGE_MAP: Record<string, ProductImageData> = {
  fuel: {
    local: "/images/products/fuel.jpg",
    online: "https://images.unsplash.com/photo-1545231027-637d2f6210f8?auto=format&fit=crop&w=800&q=80",
  },
  cotton: {
    local: "/images/products/cotton.jpg",
    online: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80",
  },
  cement: {
    local: "/images/products/cement.jpg",
    online: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
  },
  oil: {
    local: "/images/products/oil.jpg",
    online: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
  },
  metal: {
    local: "/images/products/metal.jpg",
    online: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=800&q=80",
  },
  grain: {
    local: "/images/products/grain.jpg",
    online: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  },
  polymer: {
    local: "/images/products/polymer.jpg",
    online: "https://images.unsplash.com/photo-1526951521990-620dc14c214b?auto=format&fit=crop&w=800&q=80",
  },
  fertilizer: {
    local: "/images/products/fertilizer.jpg",
    online: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80",
  },
  coal: {
    local: "/images/products/coal.jpg",
    online: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
  },
  trade: {
    local: "/images/products/trade.jpg",
    online: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
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
