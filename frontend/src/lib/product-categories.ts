export const MARKETPLACE_CATEGORIES = [
  "All",
  "Yoqilg'i",
  "Metallurgiya",
  "Qurilish materiallari",
  "Qishloq xo'jaligi va oziq-ovqat",
  "Kimyoviy moddalar",
  "Polimerlar va plastmassa",
  "Boshqa",
] as const;

export type MarketplaceCategory = (typeof MARKETPLACE_CATEGORIES)[number];

export function inferCategoryFromName(productName: string): string {
  if (!productName) return "Boshqa";

  const text = productName.toLowerCase().trim();

  // 1. Fuel / Yoqilg'i
  if (
    text.includes("benzin") ||
    text.includes("dizel") ||
    text.includes("solyarka") ||
    text.includes("gaz") ||
    text.includes("mazut") ||
    text.includes("moy") ||
    text.includes("kerosin") ||
    text.includes("neft") ||
    text.includes("ugol") ||
    text.includes("ko'mir") ||
    text.includes("propan") ||
    text.includes("butan") ||
    text.includes("yoqilg'i") ||
    text.includes("gazolin") ||
    text.includes("ai-80") ||
    text.includes("ai-91") ||
    text.includes("ai-92") ||
    text.includes("ai-95") ||
    text.includes("a-80") ||
    text.includes("a-91") ||
    text.includes("a-92") ||
    text.includes("a-95") ||
    text.includes("bitum") ||
    text.includes("gudron")
  ) {
    return "Yoqilg'i";
  }

  // 2. Metallurgy / Metallurgiya
  if (
    text.includes("armatura") ||
    text.includes("metall") ||
    text.includes("po'lat") ||
    text.includes("stal") ||
    text.includes("prokat") ||
    text.includes("katanka") ||
    text.includes("alyuminiy") ||
    text.includes("mis") ||
    text.includes("rux") ||
    text.includes("sim") ||
    text.includes("truba") ||
    text.includes("ugolok") ||
    text.includes("shveller") ||
    text.includes("list") ||
    text.includes("latun") ||
    text.includes("qotishma") ||
    text.includes("chuyan")
  ) {
    return "Metallurgiya";
  }

  // 3. Construction / Qurilish materiallari
  if (
    text.includes("sement") ||
    text.includes("gips") ||
    text.includes("ohak") ||
    text.includes("shpaklyovka") ||
    text.includes("beton") ||
    text.includes("g'isht") ||
    text.includes("qum") ||
    text.includes("shifer") ||
    text.includes("linoleum") ||
    text.includes("qurilish") ||
    text.includes("keramika") ||
    text.includes("kafel") ||
    text.includes("penoplast") ||
    text.includes("steklo") ||
    text.includes("oyna") ||
    text.includes("marmar") ||
    text.includes("granit") ||
    text.includes("brus") ||
    text.includes("taxta") ||
    text.includes("dsp") ||
    text.includes("dvp") ||
    text.includes("fanera")
  ) {
    return "Qurilish materiallari";
  }

  // 4. Agriculture & Food / Qishloq xo'jaligi va oziq-ovqat
  if (
    text.includes("paxta") ||
    text.includes("bug'doy") ||
    text.includes("un") ||
    text.includes("shakar") ||
    text.includes("yog'") ||
    text.includes("go'sht") ||
    text.includes("sut") ||
    text.includes("soya") ||
    text.includes("arpa") ||
    text.includes("makkajo'xori") ||
    text.includes("sholi") ||
    text.includes("guruch") ||
    text.includes("yem") ||
    text.includes("oziq") ||
    text.includes("kunjara") ||
    text.includes("sheluxa") ||
    text.includes("lint") ||
    text.includes("don") ||
    text.includes("sabzavot") ||
    text.includes("meva")
  ) {
    return "Qishloq xo'jaligi va oziq-ovqat";
  }

  // 5. Chemicals / Kimyoviy moddalar
  if (
    text.includes("kislota") ||
    text.includes("soda") ||
    text.includes("mineral") ||
    text.includes("ammiak") ||
    text.includes("selitra") ||
    text.includes("karbamid") ||
    text.includes("xlor") ||
    text.includes("sulfat") ||
    text.includes("superfosfat") ||
    text.includes("o'g'it") ||
    text.includes("kimyo") ||
    text.includes("kaustik") ||
    text.includes("fosfat") ||
    text.includes("azot") ||
    text.includes("kaliy")
  ) {
    return "Kimyoviy moddalar";
  }

  // 6. Polymers & Plastics / Polimerlar va plastmassa
  if (
    text.includes("polietilen") ||
    text.includes("polipropilen") ||
    text.includes("pvc") ||
    text.includes("pvx") ||
    text.includes("plastmassa") ||
    text.includes("polistirol") ||
    text.includes("granula") ||
    text.includes("polimer") ||
    text.includes("plyonka") ||
    text.includes("paket") ||
    text.includes("rezina") ||
    text.includes("kauchuk")
  ) {
    return "Polimerlar va plastmassa";
  }

  return "Boshqa";
}
