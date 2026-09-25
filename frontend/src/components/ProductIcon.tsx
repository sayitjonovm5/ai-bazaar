"use client";

import React from "react";

export type ProductIconSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ProductIconProps {
  name?: string;
  category?: string;
  size?: ProductIconSize;
  className?: string;
  showCategoryHint?: boolean;
}

interface ProductVisualMeta {
  bgGradient: string;
  borderColor: string;
  iconColor: string;
  badgeLabel: string;
  badgeColor: string;
  renderSvg: (iconSize: number) => React.ReactNode;
}

export function getProductVisualMeta(name: string = "", category: string = ""): ProductVisualMeta {
  const text = `${name} ${category}`.toLowerCase();

  // 1. FUEL: Gasoline (Avtobenzin A-80, A-91, A-92, A-95)
  if (text.includes("avtobenzin") || text.includes("benzin") || text.includes("ai-80") || text.includes("ai-91") || text.includes("ai-92") || text.includes("ai-95") || text.includes("a-80") || text.includes("a-92") || text.includes("a-95")) {
    return {
      bgGradient: "from-amber-500/15 via-orange-500/20 to-red-500/15",
      borderColor: "border-amber-200/80 shadow-amber-500/10",
      iconColor: "text-amber-600",
      badgeLabel: "Yoqilg'i",
      badgeColor: "bg-amber-100 text-amber-800",
      renderSvg: (s) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="22" x2="15" y2="22" />
          <line x1="4" y1="9" x2="14" y2="9" />
          <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
          <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" />
          <circle cx="9" cy="6" r="1.5" fill="currentColor" />
        </svg>
      ),
    };
  }

  // 2. FUEL: Diesel (Dizel yoqilg'isi, Solyarka)
  if (text.includes("dizel") || text.includes("solyarka") || text.includes("dt ")) {
    return {
      bgGradient: "from-yellow-500/20 via-amber-500/20 to-amber-600/20",
      borderColor: "border-yellow-200/80 shadow-yellow-500/10",
      iconColor: "text-yellow-700",
      badgeLabel: "Dizel",
      badgeColor: "bg-yellow-100 text-yellow-800",
      renderSvg: (s) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4" />
          <path d="m4.93 10.93 2.83-2.83" />
          <path d="M2 18h4" />
          <circle cx="12" cy="18" r="4" />
          <path d="M16 18a6 6 0 0 0-6-6" />
          <path d="M18 10V6a2 2 0 0 0-2-2h-3" />
        </svg>
      ),
    };
  }

  // 3. FUEL: Oil / Mazut / Bitum / Gudron
  if (text.includes("mazut") || text.includes("bitum") || text.includes("gudron") || text.includes("neft") || text.includes("moy")) {
    return {
      bgGradient: "from-stone-700/20 via-neutral-800/25 to-amber-950/20",
      borderColor: "border-stone-300 shadow-stone-600/10",
      iconColor: "text-stone-800",
      badgeLabel: "Neft/Mazut",
      badgeColor: "bg-stone-100 text-stone-800",
      renderSvg: (s) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          <path d="M12 11.5a3 3 0 0 0-3 3" />
        </svg>
      ),
    };
  }

  // 4. FUEL / CHEMICALS: Gas (Gaz, Propan, Metan, Butan, Azot, Argon)
  if (text.includes("gaz") || text.includes("propan") || text.includes("metan") || text.includes("butan") || text.includes("azot") || text.includes("argon") || text.includes("balon")) {
    return {
      bgGradient: "from-sky-500/20 via-cyan-500/20 to-blue-500/20",
      borderColor: "border-sky-200/80 shadow-sky-500/10",
      iconColor: "text-sky-600",
      badgeLabel: "Gaz/Suyuqlik",
      badgeColor: "bg-sky-100 text-sky-800",
      renderSvg: (s) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="6" width="10" height="15" rx="3" />
          <path d="M9 6V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
          <path d="M10 2h4" />
          <line x1="7" y1="12" x2="17" y2="12" />
        </svg>
      ),
    };
  }

  // 5. METALLURGY: Rebar (Armatura, Katanka, Sim)
  if (text.includes("armatura") || text.includes("katanka") || text.includes("sim") || text.includes("provod")) {
    return {
      bgGradient: "from-slate-600/20 via-blue-700/20 to-slate-800/20",
      borderColor: "border-slate-300 shadow-slate-500/10",
      iconColor: "text-slate-700",
      badgeLabel: "Armatura",
      badgeColor: "bg-slate-100 text-slate-800",
      renderSvg: (s) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="4" x2="20" y2="20" strokeWidth="3" />
          <line x1="7" y1="3" x2="9" y2="5" />
          <line x1="11" y1="7" x2="13" y2="9" />
          <line x1="15" y1="11" x2="17" y2="13" />
          <line x1="19" y1="15" x2="21" y2="17" />
          <line x1="4" y1="12" x2="12" y2="20" strokeWidth="2" strokeDasharray="2 2" />
        </svg>
      ),
    };
  }

  // 6. METALLURGY: Angles, Channels, Beams (Ugolok, Shveller, Balka)
  if (text.includes("ugolok") || text.includes("shveller") || text.includes("balka") || text.includes("profil")) {
    return {
      bgGradient: "from-zinc-600/20 via-slate-600/20 to-zinc-700/20",
      borderColor: "border-zinc-300 shadow-zinc-500/10",
      iconColor: "text-zinc-700",
      badgeLabel: "Prokat",
      badgeColor: "bg-zinc-100 text-zinc-800",
      renderSvg: (s) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 4v14a2 2 0 0 0 2 2h13" strokeWidth="3" />
          <path d="M5 4h4" />
          <path d="M20 16v4" />
        </svg>
      ),
    };
  }

  // 7. METALLURGY: Steel Sheet & General Metal (Po'lat, Stal, Prokat, Truba)
  if (text.includes("po'lat") || text.includes("stal") || text.includes("metall") || text.includes("truba") || category.includes("Metallurgiya")) {
    return {
      bgGradient: "from-indigo-600/15 via-blue-600/20 to-slate-600/20",
      borderColor: "border-indigo-200/80 shadow-indigo-500/10",
      iconColor: "text-indigo-700",
      badgeLabel: "Po'lat",
      badgeColor: "bg-indigo-100 text-indigo-800",
      renderSvg: (s) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    };
  }

  // 8. METALLURGY: Copper (Mis, Katanka mis)
  if (text.includes("mis") || text.includes("latun") || text.includes("bronza")) {
    return {
      bgGradient: "from-orange-600/20 via-amber-700/20 to-rose-600/20",
      borderColor: "border-orange-200 shadow-orange-500/10",
      iconColor: "text-orange-700",
      badgeLabel: "Mis",
      badgeColor: "bg-orange-100 text-orange-800",
      renderSvg: (s) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
          <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
        </svg>
      ),
    };
  }

  // 9. CONSTRUCTION: Cement (Sement PTs 400, 500)
  if (text.includes("sement") || text.includes("cement") || text.includes("qoplarda sement")) {
    return {
      bgGradient: "from-stone-500/20 via-neutral-600/25 to-stone-600/20",
      borderColor: "border-stone-300 shadow-stone-500/10",
      iconColor: "text-stone-700",
      badgeLabel: "Sement",
      badgeColor: "bg-stone-100 text-stone-800",
      renderSvg: (s) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 8h14l-2 13H7L5 8z" />
          <path d="M7 8V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
          <path d="M9 13h6" strokeDasharray="1 1" />
          <circle cx="12" cy="15" r="1.5" fill="currentColor" />
        </svg>
      ),
    };
  }

  // 10. CONSTRUCTION: Brick / Concrete (G'isht, Beton, Shifer, Gips, Ohak)
  if (text.includes("g'isht") || text.includes("kirpich") || text.includes("beton") || text.includes("shifer") || text.includes("gips") || text.includes("ohak") || category.includes("Qurilish materiallari")) {
    return {
      bgGradient: "from-rose-600/20 via-red-600/20 to-orange-600/20",
      borderColor: "border-red-200 shadow-red-500/10",
      iconColor: "text-red-700",
      badgeLabel: "Qurilish",
      badgeColor: "bg-red-100 text-red-800",
      renderSvg: (s) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="12" y1="4" x2="12" y2="12" />
          <line x1="7.5" y1="12" x2="7.5" y2="20" />
          <line x1="16.5" y1="12" x2="16.5" y2="20" />
        </svg>
      ),
    };
  }

  // 11. AGRICULTURE: Wheat & Grains (Bug'doy, Arpa, Don, Makkajo'xori, Un)
  if (text.includes("bug'doy") || text.includes("arpa") || text.includes("don") || text.includes("makkajo'xori") || text.includes("un ") || text.includes("un(")) {
    return {
      bgGradient: "from-amber-500/20 via-yellow-500/25 to-amber-600/20",
      borderColor: "border-amber-200 shadow-amber-500/10",
      iconColor: "text-amber-700",
      badgeLabel: "Bug'doy/Don",
      badgeColor: "bg-amber-100 text-amber-800",
      renderSvg: (s) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 22 16 8" />
          <path d="M12 2a4 4 0 0 0-4 4c0 3 4 6 4 6s4-3 4-6a4 4 0 0 0-4-4z" />
          <path d="M18 8a3 3 0 0 0-3 3c0 2 3 4 3 4s3-2 3-4a3 3 0 0 0-3-3z" />
          <path d="M6 14a3 3 0 0 0-3 3c0 2 3 4 3 4s3-2 3-4a3 3 0 0 0-3-3z" />
        </svg>
      ),
    };
  }

  // 12. AGRICULTURE: Cotton (Paxta, Paxta tolasi, Lint, Ulik)
  if (text.includes("paxta") || text.includes("lint") || text.includes("tola")) {
    return {
      bgGradient: "from-emerald-500/20 via-teal-500/20 to-emerald-600/20",
      borderColor: "border-emerald-200 shadow-emerald-500/10",
      iconColor: "text-emerald-700",
      badgeLabel: "Paxta",
      badgeColor: "bg-emerald-100 text-emerald-800",
      renderSvg: (s) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9Z" strokeDasharray="3 3" />
          <path d="M12 7c-2 0-3.5 1.5-3.5 3.5 0 2 1.5 3.5 3.5 3.5s3.5-1.5 3.5-3.5c0-2-1.5-3.5-3.5-3.5Z" />
          <path d="M8 12c-1.5 0-2.5 1-2.5 2.5S6.5 17 8 17s2.5-1 2.5-2.5" />
          <path d="M16 12c1.5 0 2.5 1 2.5 2.5S17.5 17 16 17s-2.5-1-2.5-2.5" />
        </svg>
      ),
    };
  }

  // 13. AGRICULTURE: Food & Edible Oil / Sugar (Yog', Shakar, Oziq-ovqat)
  if (text.includes("yog'") || text.includes("shakar") || text.includes("kungaboqar") || text.includes("paxta yog'") || category.includes("Qishloq xo'jaligi")) {
    return {
      bgGradient: "from-yellow-400/20 via-amber-400/20 to-orange-400/20",
      borderColor: "border-yellow-300 shadow-yellow-500/10",
      iconColor: "text-amber-600",
      badgeLabel: "Oziq-ovqat",
      badgeColor: "bg-yellow-100 text-yellow-800",
      renderSvg: (s) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          <path d="M19 3v4" />
          <path d="M21 5h-4" />
        </svg>
      ),
    };
  }

  // 14. CHEMICALS & FERTILIZERS: (Selitra, Ammofos, Karbamid, Kislota)
  if (text.includes("selitra") || text.includes("ammofos") || text.includes("karbamid") || text.includes("kislota") || text.includes("ammiak") || category.includes("Kimyoviy moddalar")) {
    return {
      bgGradient: "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20",
      borderColor: "border-violet-200 shadow-violet-500/10",
      iconColor: "text-violet-600",
      badgeLabel: "Kimyo/O'g'it",
      badgeColor: "bg-violet-100 text-violet-800",
      renderSvg: (s) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
          <path d="M8.5 2h7" />
          <path d="M7 16h10" />
          <circle cx="12" cy="13" r="1" fill="currentColor" />
        </svg>
      ),
    };
  }

  // 15. POLYMERS & PLASTICS: (Polietilen, Polipropilen, PVX, Granula)
  if (text.includes("polietilen") || text.includes("polipropilen") || text.includes("pvx") || text.includes("granula") || text.includes("polimer") || category.includes("Polimerlar")) {
    return {
      bgGradient: "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
      borderColor: "border-cyan-200 shadow-cyan-500/10",
      iconColor: "text-cyan-700",
      badgeLabel: "Polimer/PVX",
      badgeColor: "bg-cyan-100 text-cyan-800",
      renderSvg: (s) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
      ),
    };
  }

  // 16. DEFAULT COMMODITY
  return {
    bgGradient: "from-slate-500/15 via-blue-500/15 to-indigo-500/15",
    borderColor: "border-slate-200 shadow-slate-500/10",
    iconColor: "text-slate-600",
    badgeLabel: "Xomashyo",
    badgeColor: "bg-slate-100 text-slate-700",
    renderSvg: (s) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7.5 4.27 9 5.15" />
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
  };
}

const sizeConfig: Record<ProductIconSize, { box: string; iconPx: number; rounded: string }> = {
  xs: { box: "w-6 h-6", iconPx: 14, rounded: "rounded-md" },
  sm: { box: "w-9 h-9", iconPx: 18, rounded: "rounded-lg" },
  md: { box: "w-11 h-11", iconPx: 22, rounded: "rounded-xl" },
  lg: { box: "w-14 h-14", iconPx: 28, rounded: "rounded-2xl" },
  xl: { box: "w-20 h-20", iconPx: 38, rounded: "rounded-3xl" },
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

  return (
    <div className={`relative inline-flex items-center shrink-0 ${className}`}>
      <div
        className={`${cfg.box} ${cfg.rounded} bg-gradient-to-br ${meta.bgGradient} border ${meta.borderColor} ${meta.iconColor} shadow-sm flex items-center justify-center transition-transform hover:scale-105`}
        title={`${name} (${meta.badgeLabel})`}
      >
        {meta.renderSvg(cfg.iconPx)}
      </div>
      {showCategoryHint && (
        <span className={`ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.badgeColor}`}>
          {meta.badgeLabel}
        </span>
      )}
    </div>
  );
}
