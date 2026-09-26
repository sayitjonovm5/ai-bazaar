"use client";

import React from "react";
import {
  Fuel,
  Flame,
  Droplets,
  Droplet,
  Wind,
  Gauge,
  Layers,
  Hammer,
  Boxes,
  Coins,
  Shield,
  Component,
  HardHat,
  BrickWall,
  PaintBucket,
  TreePine,
  Wheat,
  Sprout,
  Cloud,
  Nut,
  Candy,
  Apple,
  FlaskConical,
  Cable,
  Wrench,
  Package,
  Sparkles,
  BatteryCharging,
  Cylinder,
  CircleDot,
  Mountain,
  ShoppingBag,
  Hash,
  Construction,
  type LucideIcon,
} from "lucide-react";

export type ProductIconSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ProductIconProps {
  name?: string;
  category?: string;
  size?: ProductIconSize;
  className?: string;
  showCategoryHint?: boolean;
}

export interface ProductVisualMeta {
  bgGradient: string;
  borderColor: string;
  iconColor: string;
  badgeLabel: string;
  badgeColor: string;
  Icon: LucideIcon;
  renderSvg: (iconSize: number) => React.ReactNode;
}

export function getProductVisualMeta(name: string = "", category: string = ""): ProductVisualMeta {
  const text = `${name} ${category}`.toLowerCase();

  // Helper to build visual meta with backward-compatible renderSvg
  const createMeta = (
    Icon: LucideIcon,
    bgGradient: string,
    borderColor: string,
    iconColor: string,
    badgeLabel: string,
    badgeColor: string
  ): ProductVisualMeta => ({
    Icon,
    bgGradient,
    borderColor,
    iconColor,
    badgeLabel,
    badgeColor,
    renderSvg: (s: number) => <Icon size={s} strokeWidth={2} />,
  });

  // 1. FUEL: Gasoline (Avtobenzin, Benzin, AI-80, AI-91, AI-92, AI-95)
  if (
    text.includes("avtobenzin") ||
    text.includes("benzin") ||
    text.includes("ai-80") ||
    text.includes("ai-91") ||
    text.includes("ai-92") ||
    text.includes("ai-95") ||
    text.includes("a-80") ||
    text.includes("a-91") ||
    text.includes("a-92") ||
    text.includes("a-95")
  ) {
    return createMeta(
      Fuel,
      "from-amber-500/20 via-orange-500/20 to-red-500/15",
      "border-amber-300/80 shadow-amber-500/10",
      "text-amber-600",
      "Benzin/Yoqilg'i",
      "bg-amber-100 text-amber-800"
    );
  }

  // 2. FUEL: Diesel (Dizel yoqilg'isi, Solyarka, DT)
  if (text.includes("dizel") || text.includes("solyarka") || text.includes("dt ") || text.includes("dt-") || text.includes("dizelnoe")) {
    return createMeta(
      Gauge,
      "from-yellow-500/20 via-amber-500/25 to-yellow-600/20",
      "border-yellow-300/80 shadow-yellow-500/10",
      "text-amber-700",
      "Dizel",
      "bg-yellow-100 text-yellow-800"
    );
  }

  // 3. FUEL / OILS: Heavy Oil, Mazut, Bitumen, Tar, Kerosene (Neft, Mazut, Moy, Bitum, Gudron, Kerosin)
  if (
    text.includes("mazut") ||
    text.includes("bitum") ||
    text.includes("gudron") ||
    text.includes("neft") ||
    text.includes("moy ") ||
    text.includes("moylar") ||
    text.includes("moylash") ||
    text.includes("kerosin") ||
    text.includes("motor moy") ||
    text.includes("industrial moy")
  ) {
    return createMeta(
      Droplets,
      "from-stone-700/20 via-neutral-800/25 to-amber-950/20",
      "border-stone-300 shadow-stone-600/10",
      "text-stone-800",
      "Neft/Moy",
      "bg-stone-100 text-stone-800"
    );
  }

  // 4. GASES: Propan, Metan, Butan, Azot, Argon, Kislorod, Gaz
  if (
    text.includes("gaz") ||
    text.includes("propan") ||
    text.includes("metan") ||
    text.includes("butan") ||
    text.includes("azot") ||
    text.includes("argon") ||
    text.includes("kislorod") ||
    text.includes("geliy") ||
    text.includes("balon")
  ) {
    return createMeta(
      Wind,
      "from-sky-500/20 via-cyan-500/20 to-blue-500/20",
      "border-sky-300/80 shadow-sky-500/10",
      "text-sky-600",
      "Gaz",
      "bg-sky-100 text-sky-800"
    );
  }

  // 5. COAL & SOLID FUELS: Ko'mir, Koks, Briket, Torf
  if (text.includes("ko'mir") || text.includes("ugol") || text.includes("koks") || text.includes("torf") || text.includes("briket")) {
    return createMeta(
      Mountain,
      "from-stone-900/25 via-zinc-800/25 to-slate-900/20",
      "border-stone-400/80 shadow-stone-500/10",
      "text-stone-900",
      "Ko'mir/Koks",
      "bg-stone-100 text-stone-800"
    );
  }

  // 6. METALLURGY: Rebar, Rods, Wire (Armatura, Katanka, Sim, Provod, Tros)
  if (
    text.includes("armatura") ||
    text.includes("katanka") ||
    text.includes("sim ") ||
    text.includes("provod") ||
    text.includes("tros") ||
    text.includes("kanat") ||
    text.includes("stalnoy sim")
  ) {
    return createMeta(
      Hash,
      "from-slate-600/20 via-blue-700/20 to-slate-800/20",
      "border-slate-300 shadow-slate-500/10",
      "text-slate-700",
      "Armatura/Sim",
      "bg-slate-100 text-slate-800"
    );
  }

  // 7. METALLURGY: Pipes & Cylinders (Truba, Quvur)
  if (text.includes("truba") || text.includes("quvur") || text.includes("truboprovod")) {
    return createMeta(
      Cylinder,
      "from-blue-600/20 via-indigo-600/20 to-slate-700/20",
      "border-blue-300 shadow-blue-500/10",
      "text-blue-700",
      "Truba/Quvur",
      "bg-blue-100 text-blue-800"
    );
  }

  // 8. METALLURGY: Structural Beams, Angles, Channels (Balka, Ugolok, Shveller, Profil)
  if (
    text.includes("ugolok") ||
    text.includes("shveller") ||
    text.includes("balka") ||
    text.includes("dvutavr") ||
    text.includes("profil") ||
    text.includes("reyka")
  ) {
    return createMeta(
      Construction,
      "from-zinc-600/20 via-slate-600/20 to-zinc-700/20",
      "border-zinc-300 shadow-zinc-500/10",
      "text-zinc-700",
      "Prokat/Balka",
      "bg-zinc-100 text-zinc-800"
    );
  }

  // 9. METALLURGY: Copper & Alloys (Mis, Med, Latun, Bronza)
  if (text.includes("mis ") || text.includes("med ") || text.includes("medn") || text.includes("latun") || text.includes("bronza")) {
    return createMeta(
      Coins,
      "from-orange-600/20 via-amber-700/20 to-rose-600/20",
      "border-orange-300 shadow-orange-500/10",
      "text-orange-700",
      "Mis/Bronza",
      "bg-orange-100 text-orange-800"
    );
  }

  // 10. METALLURGY: Aluminum, Zinc, Lead, Tin (Alyuminiy, Rux, Sink, Svinets, Qalay, Titan)
  if (
    text.includes("alyumin") ||
    text.includes("alumin") ||
    text.includes("sink") ||
    text.includes("rux") ||
    text.includes("svinets") ||
    text.includes("qalay") ||
    text.includes("titan")
  ) {
    return createMeta(
      Component,
      "from-cyan-600/20 via-slate-500/20 to-teal-600/20",
      "border-cyan-300 shadow-cyan-500/10",
      "text-cyan-700",
      "Rangli metall",
      "bg-cyan-100 text-cyan-800"
    );
  }

  // 11. METALLURGY: Steel, Sheet metal, Cast iron, General metals (Po'lat, Stal, Prokat, Chugun)
  if (
    text.includes("po'lat") ||
    text.includes("stal") ||
    text.includes("metall") ||
    text.includes("list ") ||
    text.includes("prokat") ||
    text.includes("chugun") ||
    category.includes("Metallurgiya")
  ) {
    return createMeta(
      Layers,
      "from-indigo-600/20 via-blue-600/20 to-slate-600/20",
      "border-indigo-300/80 shadow-indigo-500/10",
      "text-indigo-700",
      "Po'lat/Metall",
      "bg-indigo-100 text-indigo-800"
    );
  }

  // 12. CONSTRUCTION: Cement & Clinker (Sement, Cement, Klinker)
  if (text.includes("sement") || text.includes("cement") || text.includes("klinker") || text.includes("pts-") || text.includes("pts ")) {
    return createMeta(
      Package,
      "from-stone-500/20 via-neutral-600/25 to-stone-600/20",
      "border-stone-300 shadow-stone-500/10",
      "text-stone-700",
      "Sement",
      "bg-stone-100 text-stone-800"
    );
  }

  // 13. CONSTRUCTION: Bricks, Blocks (G'isht, Kirpich, Blok, Gazoblok, Penoblok, Shlakoblok)
  if (
    text.includes("g'isht") ||
    text.includes("kirpich") ||
    text.includes("blok") ||
    text.includes("gazoblok") ||
    text.includes("penoblok") ||
    text.includes("shlakoblok")
  ) {
    return createMeta(
      BrickWall,
      "from-rose-600/20 via-red-600/20 to-orange-600/20",
      "border-rose-300 shadow-red-500/10",
      "text-rose-700",
      "G'isht/Blok",
      "bg-rose-100 text-rose-800"
    );
  }

  // 14. CONSTRUCTION: Concrete, Mortar, Lime, Gypsum, Sand, Gravel (Beton, Ohak, Gips, Qum, Shag'al)
  if (
    text.includes("beton") ||
    text.includes("rastvor") ||
    text.includes("ohak") ||
    text.includes("izvest") ||
    text.includes("gips") ||
    text.includes("alebastr") ||
    text.includes("qum") ||
    text.includes("pesok") ||
    text.includes("shag'al") ||
    text.includes("sheben")
  ) {
    return createMeta(
      HardHat,
      "from-neutral-600/20 via-stone-600/20 to-zinc-600/20",
      "border-neutral-300 shadow-neutral-500/10",
      "text-neutral-700",
      "Beton/Qorishma",
      "bg-neutral-100 text-neutral-800"
    );
  }

  // 15. CONSTRUCTION: Glass (Shisha, Steklo, Oyna, Stekloboy)
  if (text.includes("shisha") || text.includes("steklo") || text.includes("oyna") || text.includes("stekloboy")) {
    return createMeta(
      Sparkles,
      "from-teal-400/20 via-cyan-400/20 to-blue-400/20",
      "border-teal-300 shadow-teal-500/10",
      "text-teal-600",
      "Shisha/Oyna",
      "bg-teal-100 text-teal-800"
    );
  }

  // 16. CONSTRUCTION: Roofing, Slate, Corrugated sheets (Shifer, Profnastil, Cherepitsa, Tom)
  if (
    text.includes("shifer") ||
    text.includes("cherepitsa") ||
    text.includes("profnastil") ||
    text.includes("ondulin") ||
    text.includes("ruberoid") ||
    text.includes("tom ")
  ) {
    return createMeta(
      Shield,
      "from-blue-700/20 via-indigo-700/20 to-slate-800/20",
      "border-blue-300 shadow-blue-500/10",
      "text-blue-700",
      "Tom yopish",
      "bg-blue-100 text-blue-800"
    );
  }

  // 17. CONSTRUCTION: Paints, Varnishes, Coatings (Bo'yoq, Kraska, Emal, Lak, Gruntovka)
  if (
    text.includes("bo'yoq") ||
    text.includes("kraska") ||
    text.includes("emal") ||
    text.includes("lak ") ||
    text.includes("gruntovka") ||
    text.includes("shpaklevka")
  ) {
    return createMeta(
      PaintBucket,
      "from-fuchsia-500/20 via-pink-500/20 to-rose-500/20",
      "border-fuchsia-300 shadow-fuchsia-500/10",
      "text-fuchsia-600",
      "Bo'yoq/Lak",
      "bg-fuchsia-100 text-fuchsia-800"
    );
  }

  // 18. CONSTRUCTION: Timber & Wood (Yog'och, Taxta, Fanera, DSP, MDF, Les, Brus)
  if (
    text.includes("yog'och") ||
    text.includes("taxta") ||
    text.includes("fanera") ||
    text.includes("dsp") ||
    text.includes("mdf") ||
    text.includes("les ") ||
    text.includes("brus") ||
    text.includes("pilomaterial")
  ) {
    return createMeta(
      TreePine,
      "from-amber-700/20 via-yellow-800/20 to-stone-700/20",
      "border-amber-300 shadow-amber-500/10",
      "text-amber-800",
      "Yog'och/Taxta",
      "bg-amber-100 text-amber-800"
    );
  }

  // Fallback for general Construction materials
  if (category.includes("Qurilish materiallari")) {
    return createMeta(
      BrickWall,
      "from-rose-600/20 via-red-600/20 to-orange-600/20",
      "border-red-200 shadow-red-500/10",
      "text-red-700",
      "Qurilish",
      "bg-red-100 text-red-800"
    );
  }

  // 19. AGRICULTURE: Wheat, Grains, Barley, Corn, Flour (Bug'doy, Arpa, Don, Makkajo'xori, Un, Guruch)
  if (
    text.includes("bug'doy") ||
    text.includes("pshenitsa") ||
    text.includes("arpa") ||
    text.includes("yachmen") ||
    text.includes("don ") ||
    text.includes("zerno") ||
    text.includes("makkajo'xori") ||
    text.includes("kukurudza") ||
    text.includes("suli") ||
    text.includes("oves") ||
    text.includes("un ") ||
    text.includes("un(") ||
    text.includes("muka") ||
    text.includes("kepak") ||
    text.includes("otrubi") ||
    text.includes("guruch") ||
    text.includes("ris ")
  ) {
    return createMeta(
      Wheat,
      "from-amber-500/25 via-yellow-500/25 to-amber-600/20",
      "border-amber-300 shadow-amber-500/10",
      "text-amber-700",
      "Bug'doy/Don",
      "bg-amber-100 text-amber-800"
    );
  }

  // 20. AGRICULTURE: Cotton, Fibers, Lint, Yarn (Paxta, Xlopok, Lint, Tola, Volokno, Kalava)
  if (
    text.includes("paxta") ||
    text.includes("xlopok") ||
    text.includes("lint") ||
    text.includes("tola") ||
    text.includes("volokno") ||
    text.includes("kalava") ||
    text.includes("pryaja") ||
    text.includes("ip ")
  ) {
    return createMeta(
      Cloud,
      "from-emerald-500/20 via-teal-500/20 to-emerald-600/20",
      "border-emerald-300 shadow-emerald-500/10",
      "text-emerald-700",
      "Paxta/Tola",
      "bg-emerald-100 text-emerald-800"
    );
  }

  // 21. AGRICULTURE: Cottonseed, Meal, Oilcake (Chigit, Semena, Shrot, Jmix, Kunjara)
  if (
    text.includes("chigit") ||
    text.includes("semena") ||
    text.includes("shrot") ||
    text.includes("jmix") ||
    text.includes("kunjara") ||
    text.includes("urug'")
  ) {
    return createMeta(
      Nut,
      "from-lime-600/20 via-emerald-600/20 to-green-700/20",
      "border-lime-300 shadow-lime-500/10",
      "text-lime-700",
      "Chigit/Shrot",
      "bg-lime-100 text-lime-800"
    );
  }

  // 22. AGRICULTURE: Vegetable / Edible Oil (Yog', Maslo, Paxta yog'i, Kungaboqar)
  if (
    text.includes("yog'") ||
    text.includes("maslo rastitelnoe") ||
    text.includes("kungaboqar") ||
    text.includes("podsolnechnoe") ||
    text.includes("soya yog'")
  ) {
    return createMeta(
      Droplet,
      "from-yellow-400/25 via-amber-400/25 to-orange-400/20",
      "border-yellow-300 shadow-yellow-500/10",
      "text-amber-600",
      "O'simlik yog'i",
      "bg-yellow-100 text-yellow-800"
    );
  }

  // 23. FOOD: Sugar (Shakar, Saxar, Qand)
  if (text.includes("shakar") || text.includes("saxar") || text.includes("qand") || text.includes("patoka")) {
    return createMeta(
      Candy,
      "from-pink-400/20 via-rose-300/20 to-purple-400/20",
      "border-pink-300 shadow-pink-500/10",
      "text-pink-600",
      "Shakar/Qand",
      "bg-pink-100 text-pink-800"
    );
  }

  // 24. FOOD: Fruits & Vegetables (Piyoz, Kartoshka, Meva, Sabzavot)
  if (
    text.includes("piyoz") ||
    text.includes("kartoshka") ||
    text.includes("sabzi") ||
    text.includes("olma") ||
    text.includes("uzum") ||
    text.includes("meva") ||
    text.includes("sabzavot") ||
    text.includes("ovoshch") ||
    text.includes("frukt")
  ) {
    return createMeta(
      Apple,
      "from-red-500/20 via-rose-500/20 to-amber-500/20",
      "border-red-300 shadow-red-500/10",
      "text-red-600",
      "Meva/Sabzavot",
      "bg-red-100 text-red-800"
    );
  }

  // Fallback for general Agriculture & Food
  if (category.includes("Qishloq xo'jaligi")) {
    return createMeta(
      Wheat,
      "from-amber-400/20 via-yellow-500/20 to-orange-400/20",
      "border-amber-300 shadow-amber-500/10",
      "text-amber-700",
      "Qishloq xo'jaligi",
      "bg-amber-100 text-amber-800"
    );
  }

  // 25. CHEMICALS: Fertilizers (Selitra, Ammofos, Karbamid, Udobrenie, O'g'it, Kaliy, Fosfat)
  if (
    text.includes("selitra") ||
    text.includes("ammofos") ||
    text.includes("karbamid") ||
    text.includes("udobrenie") ||
    text.includes("o'g'it") ||
    text.includes("superfosfat") ||
    text.includes("kaliy") ||
    text.includes("fosfat")
  ) {
    return createMeta(
      Sprout,
      "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20",
      "border-violet-300 shadow-violet-500/10",
      "text-violet-600",
      "Mineral o'g'it",
      "bg-violet-100 text-violet-800"
    );
  }

  // 26. CHEMICALS: Acids, Alkalis, Salts, Reactives (Kislota, Sulfat, Xlor, Kaustik, Soda, Natriy)
  if (
    text.includes("kislota") ||
    text.includes("kislot") ||
    text.includes("sulfat") ||
    text.includes("xlor") ||
    text.includes("kaustik") ||
    text.includes("soda") ||
    text.includes("natriy") ||
    text.includes("reaktiv") ||
    category.includes("Kimyoviy moddalar")
  ) {
    return createMeta(
      FlaskConical,
      "from-purple-600/20 via-indigo-600/20 to-violet-600/20",
      "border-purple-300 shadow-purple-500/10",
      "text-purple-700",
      "Kimyoviy modda",
      "bg-purple-100 text-purple-800"
    );
  }

  // 27. POLYMERS: Polyethylene, Polypropylene, Granules, PVC (Polietilen, Polipropilen, Granula, PVX, Plastmassa)
  if (
    text.includes("polietilen") ||
    text.includes("polipropilen") ||
    text.includes("granula") ||
    text.includes("pvx") ||
    text.includes("pvc") ||
    text.includes("polimer") ||
    text.includes("plastmassa") ||
    text.includes("polistirol") ||
    category.includes("Polimerlar")
  ) {
    return createMeta(
      Boxes,
      "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
      "border-cyan-300 shadow-cyan-500/10",
      "text-cyan-700",
      "Polimer/PVX",
      "bg-cyan-100 text-cyan-800"
    );
  }

  // 28. PACKAGING: Films, Sacks, Bags (Plyonka, Paket, Qop, Meshok, Tara)
  if (text.includes("plyonka") || text.includes("paket") || text.includes("qop ") || text.includes("meshok") || text.includes("tara")) {
    return createMeta(
      ShoppingBag,
      "from-sky-500/20 via-teal-500/20 to-blue-500/20",
      "border-sky-300 shadow-sky-500/10",
      "text-sky-700",
      "Qadoqlash",
      "bg-sky-100 text-sky-800"
    );
  }

  // 29. RUBBER & TIRES: (Shina, Pokrishka, Rezina, Kauchuk)
  if (text.includes("shina") || text.includes("pokrishka") || text.includes("rezina") || text.includes("kauchuk")) {
    return createMeta(
      CircleDot,
      "from-zinc-700/25 via-stone-800/25 to-slate-900/25",
      "border-zinc-400 shadow-zinc-500/10",
      "text-zinc-800",
      "Rezina/Shina",
      "bg-zinc-100 text-zinc-800"
    );
  }

  // 30. ELECTRICAL: Cables, Wires (Kabel, Sim, Provod, Elektr)
  if (text.includes("kabel") || text.includes("elektr") || text.includes("transformator") || text.includes("avtomat")) {
    return createMeta(
      Cable,
      "from-blue-600/20 via-cyan-600/20 to-slate-600/20",
      "border-blue-300 shadow-blue-500/10",
      "text-blue-700",
      "Kabel/Elektr",
      "bg-blue-100 text-blue-800"
    );
  }

  // 31. HARDWARE: Bolts, Screws, Nuts (Bolt, Gayka, Shayba, Samorez, Metiz, Mix)
  if (text.includes("bolt") || text.includes("gayka") || text.includes("shayba") || text.includes("samorez") || text.includes("metiz") || text.includes("mix ")) {
    return createMeta(
      Wrench,
      "from-slate-600/20 via-zinc-600/20 to-neutral-700/20",
      "border-slate-300 shadow-slate-500/10",
      "text-slate-700",
      "Metiz/Bolt",
      "bg-slate-100 text-slate-800"
    );
  }

  // 32. POWER: Batteries (Akkumulyator, Batareya, AKB)
  if (text.includes("akkumulyator") || text.includes("batareya") || text.includes("akb")) {
    return createMeta(
      BatteryCharging,
      "from-emerald-600/20 via-teal-600/20 to-green-600/20",
      "border-emerald-300 shadow-emerald-500/10",
      "text-emerald-700",
      "Akkumulyator",
      "bg-emerald-100 text-emerald-800"
    );
  }

  // 33. MACHINERY: Equipment, Machines, Pumps, Motors (Stanok, Nasos, Dvigatel, Uskuna)
  if (text.includes("stanok") || text.includes("nasos") || text.includes("dvigatel") || text.includes("uskuna") || text.includes("mashina")) {
    return createMeta(
      Hammer,
      "from-slate-700/20 via-blue-700/20 to-indigo-800/20",
      "border-slate-300 shadow-slate-500/10",
      "text-slate-700",
      "Texnika/Uskuna",
      "bg-slate-100 text-slate-800"
    );
  }

  // 34. DEFAULT COMMODITY FALLBACK
  return createMeta(
    Package,
    "from-slate-500/15 via-blue-500/15 to-indigo-500/15",
    "border-slate-200 shadow-slate-500/10",
    "text-slate-600",
    "Mahsulot",
    "bg-slate-100 text-slate-700"
  );
}

const sizeConfig: Record<ProductIconSize, { box: string; iconSize: number; rounded: string }> = {
  xs: { box: "w-6 h-6", iconSize: 13, rounded: "rounded-md" },
  sm: { box: "w-9 h-9", iconSize: 18, rounded: "rounded-xl" },
  md: { box: "w-11 h-11", iconSize: 22, rounded: "rounded-xl" },
  lg: { box: "w-14 h-14", iconSize: 28, rounded: "rounded-2xl" },
  xl: { box: "w-20 h-20", iconSize: 38, rounded: "rounded-3xl" },
};

export default function ProductIcon({
  name = "",
  category = "",
  size = "md",
  className = "",
  showCategoryHint = false,
}: ProductIconProps) {
  const meta = getProductVisualMeta(name, category);
  const cfg = sizeConfig[size] || sizeConfig.md;
  const Icon = meta.Icon;

  return (
    <div className={`relative inline-flex items-center shrink-0 ${className}`}>
      <div
        className={`${cfg.box} ${cfg.rounded} bg-gradient-to-br ${meta.bgGradient} border ${meta.borderColor} ${meta.iconColor} shadow-2xs flex items-center justify-center transition-transform hover:scale-105`}
        title={`${name} (${meta.badgeLabel})`}
      >
        <Icon size={cfg.iconSize} strokeWidth={2} />
      </div>
      {showCategoryHint && (
        <span className={`ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.badgeColor}`}>
          {meta.badgeLabel}
        </span>
      )}
    </div>
  );
}
