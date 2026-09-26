/**
 * Returns a realistic local product image URL based on the product name or category.
 * Returns null if no specific image is matched, so the UI can fallback to a category icon.
 */

const keywordMap: Record<string, string> = {
  "armatura": "rebar.jpg",
  "po'lat": "steel.jpg",
  "chelik": "steel.jpg",
  "temir": "steel.jpg",
  "metall": "steel.jpg",
  "quvur": "steel_pipes.jpg",
  "choksiz": "steel_pipes.jpg",
  "kabel": "cable.jpg",
  "sim": "cable.jpg",
  "paxta": "cotton.jpg",
  "portlend": "cement.jpg",
  "sement": "cement.jpg",
  "beton": "cement.jpg",
  "polietilen": "plastic_pellets.jpg",
  "polipropilen": "plastic_pellets.jpg",
  "pet": "plastic_pellets.jpg",
  "sintetik": "plastic_pellets.jpg",
  "dizel": "fuel.jpg",
  "benzin": "fuel.jpg",
  "ai-80": "fuel.jpg",
  "ai-91": "fuel.jpg",
  "ai-92": "fuel.jpg",
  "ai-95": "fuel.jpg",
  "a-80": "fuel.jpg",
  "a-92": "fuel.jpg",
  "a-95": "fuel.jpg",
  "motor": "fuel.jpg",
  "moyi": "fuel.jpg",
  "transmissiya": "fuel.jpg",
  "suyuq": "fuel.jpg",
  "kvadrat": "steel_profile.jpg",
  "burchak": "steel_profile.jpg",
  "profil": "steel_profile.jpg",
  "shveller": "steel_profile.jpg",
  "to'rtburchaklar": "steel_profile.jpg",
  "to'rtburchak": "steel_profile.jpg",
  "doira": "steel_round.jpg",
  "insektisid": "agri_chemicals.jpg",
  "herbiside": "agri_chemicals.jpg",
  "pestisid": "agri_chemicals.jpg",
  "dori": "agri_chemicals.jpg",
  "issiq": "steel_hot_rolled.jpg",
  "varaq": "steel_sheet.jpg",
  "shisha": "glass.jpg",
  "bug'doy": "wheat.jpg",
  "yong'oq": "walnuts.jpg",
  "emal": "paint.jpg",
  "bo'yoq": "paint.jpg",
  "bolt": "bolts.jpg",
  "mis": "steel.jpg",
  "alyuminiy": "steel.jpg",
  "oltin": "steel.jpg"
};

export function getProductImageUrl(name: string = "", category: string = ""): string | null {
  const text = name.toLowerCase();
  
  // Find the first matching keyword in the name
  for (const [keyword, imageFile] of Object.entries(keywordMap)) {
    if (text.includes(keyword)) {
      return `/images/products/${imageFile}`;
    }
  }

  // Fallback to category if name doesn't match
  const cat = category.toLowerCase();
  if (cat.includes("yoqilg'i")) return "/images/products/fuel.jpg";
  if (cat.includes("metallurgiya")) return "/images/products/steel.jpg";
  if (cat.includes("qurilish")) return "/images/products/cement.jpg";
  if (cat.includes("oziq-ovqat") || cat.includes("qishloq")) return "/images/products/wheat.jpg";
  if (cat.includes("kimyoviy")) return "/images/products/agri_chemicals.jpg";
  if (cat.includes("polimerlar") || cat.includes("plastmassa")) return "/images/products/plastic_pellets.jpg";

  // Return null if no match found so UI can use an icon
  return null;
}

