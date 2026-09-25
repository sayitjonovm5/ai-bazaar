"use client";

export default function SocialProofLogos() {
  const logos = [
    { name: "Figma", label: "FIGMA" },
    { name: "Stripe", label: "stripe" },
    { name: "Spotify", label: "Spotify" },
    { name: "Linear", label: "LINEAR" },
    { name: "Airbnb", label: "airbnb" },
    { name: "Vercel", label: "▲ Vercel" },
    { name: "Slack", label: "slack" },
  ];

  return (
    <div className="w-full pt-10 pb-16 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-8">
          Trusted by top design and product teams worldwide
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
          {logos.map((logo, idx) => (
            <div 
              key={idx} 
              className="text-base sm:text-lg font-black tracking-tighter text-slate-700 hover:text-slate-950 transition-colors select-none"
            >
              {logo.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
