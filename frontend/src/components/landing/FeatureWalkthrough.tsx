"use client";

import { useState } from "react";
import { 
  GitFork, 
  MessageSquare, 
  Presentation, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Clock, 
  Users, 
  History,
  CheckCircle2,
  MousePointer2
} from "lucide-react";

export default function FeatureWalkthrough() {
  // Interactive state for Row 1: Connector Line Offset
  const [connectorSpacing, setConnectorSpacing] = useState(120);

  // Interactive state for Row 2: Version History Slider
  const [versionIndex, setVersionIndex] = useState(2);
  const versions = [
    { tag: "v1.0", label: "Initial Draft (5 screens)", date: "2 days ago", author: "Sarah L." },
    { tag: "v1.4", label: "AI Forecast Integrated", date: "Yesterday", author: "Alex K." },
    { tag: "v2.0", label: "Board Presentation Approved", date: "Today, 10:45 AM", author: "Elena V." },
  ];

  // Interactive state for Row 3: Active Presentation Step
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section id="superpowers" className="py-24 md:py-36 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-28">
          <div className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60 mb-4">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            Discover Superpowers
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            From raw data to board-ready <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              presentations in minutes
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to visualize market flows, tell compelling product stories, and align your entire organization without meeting fatigue.
          </p>
        </div>

        {/* ---------------- FEATURE 01 ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-28 md:mb-36">
          
          {/* Left Column: Copy & Quote */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              <span className="w-6 h-px bg-blue-600" />
              <span>Superpower 01</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Lightning-Fast Flow Generation with Smart Auto-Routing
            </h3>

            <p className="text-slate-600 text-base leading-relaxed">
              Connect screens, data feeds, and transaction paths effortlessly. Overflow's intelligent connector engine automatically calculates the shortest, cleanest bezier curves without intersecting screen elements.
            </p>

            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Syncs directly with Figma, Sketch, and UZEX live APIs</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Custom connector styles, dashed lines, and labeled decision pills</span>
              </li>
            </ul>

            {/* Customer Quote Badge */}
            <div className="mt-8 p-5 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-4">
                "Overflow cut our design presentation prep time from 4 hours down to 15 minutes. Our clients finally understand user journeys instantly."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  SL
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Sarah Lin</div>
                  <div className="text-[11px] text-slate-500">Lead Product Designer at Fintech Global</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Card Preview */}
          <div className="lg:col-span-6 bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md relative overflow-hidden group hover:border-blue-400/60 transition-all duration-300">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-6">
              <span>Interactive Path Simulator</span>
              <span className="text-blue-600 font-bold">Drag slider to adjust spacing</span>
            </div>

            {/* Interactive Slider for Node Distance */}
            <div className="mb-6 flex items-center space-x-4 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Node Spacing:</span>
              <input
                type="range"
                min="80"
                max="180"
                value={connectorSpacing}
                onChange={(e) => setConnectorSpacing(Number(e.target.value))}
                className="flex-1 accent-blue-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800">{connectorSpacing}px</span>
            </div>

            {/* Dynamic Diagram Canvas */}
            <div className="relative h-64 bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center justify-center overflow-hidden">
              
              {/* Dynamic SVG Connector Path */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d={`M 140 128 C ${140 + connectorSpacing * 0.4} 128, ${140 + connectorSpacing * 0.6} 128, ${140 + connectorSpacing} 128`}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="animate-flow-dash"
                />
                <circle cx="140" cy="128" r="5" fill="#2563EB" />
                <polygon 
                  points={`${140 + connectorSpacing},124 ${148 + connectorSpacing},128 ${140 + connectorSpacing},132`} 
                  fill="#2563EB" 
                />
              </svg>

              {/* Node 1 */}
              <div 
                className="absolute left-6 w-36 bg-slate-900 text-white rounded-xl p-3 shadow-lg z-20 text-xs"
                style={{ transform: "translateY(0)" }}
              >
                <div className="text-[10px] text-blue-400 font-bold uppercase">Source Node</div>
                <div className="font-bold truncate mt-0.5">UZEX Price Feed</div>
                <div className="text-[10px] text-slate-400 mt-1">24k raw commodities</div>
              </div>

              {/* Node 2 (Moves dynamically with slider) */}
              <div 
                className="absolute w-44 bg-white rounded-xl p-3 shadow-xl border-2 border-blue-500 z-20 text-xs transition-all duration-75"
                style={{ left: `${148 + connectorSpacing}px` }}
              >
                <div className="text-[10px] text-emerald-600 font-bold uppercase flex items-center">
                  <Sparkles className="w-2.5 h-2.5 mr-1" />
                  Chronos AI Target
                </div>
                <div className="font-bold text-slate-900 mt-0.5">7-Day Prediction</div>
                <div className="text-[10px] text-slate-500 mt-1">Confidence: 98.4%</div>
              </div>

            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Automatic obstacle avoidance active</span>
              <span className="text-emerald-600 font-semibold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 0 line collisions
              </span>
            </div>
          </div>

        </div>

        {/* ---------------- FEATURE 02 (ALTERNATING) ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-28 md:mb-36">
          
          {/* Left Column: Interactive Card Preview (Alternating layout) */}
          <div className="order-2 lg:order-1 lg:col-span-6 bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md relative overflow-hidden group hover:border-indigo-400/60 transition-all duration-300">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-6">
              <span>Version History Scrubber</span>
              <span className="text-indigo-600 font-bold">Slide to time travel</span>
            </div>

            {/* Version Time Travel Slider */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-slate-900 flex items-center">
                  <History className="w-4 h-4 text-indigo-600 mr-1.5" />
                  Current View: {versions[versionIndex].tag}
                </span>
                <span className="text-slate-400 text-[11px]">{versions[versionIndex].date}</span>
              </div>

              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={versionIndex}
                onChange={(e) => setVersionIndex(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer mb-3"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>v1.0 (Draft)</span>
                <span>v1.4 (AI Added)</span>
                <span className="font-bold text-indigo-600">v2.0 (Approved)</span>
              </div>
            </div>

            {/* Simulated Canvas Diff Card with Live Multiplayer Tag */}
            <div className="relative bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              
              {/* Simulated Multiplayer Cursor */}
              <div className="absolute top-4 right-8 flex items-center space-x-1.5 bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md z-30 animate-bounce">
                <MousePointer2 className="w-2.5 h-2.5 fill-current" />
                <span>Alex K. editing</span>
              </div>

              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Snapshot Details
              </div>
              <div className="text-base font-extrabold text-slate-900 mt-1">
                {versions[versionIndex].label}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Modified by {versions[versionIndex].author} • All stakeholders notified asynchronously.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-indigo-600 font-semibold">12 comments resolved</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold text-[11px]">
                  Ready for Presentation
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Quote */}
          <div className="order-1 lg:order-2 lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
              <span className="w-6 h-px bg-indigo-600" />
              <span>Superpower 02</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Asynchronous Feedback Without Booking Another Meeting
            </h3>

            <p className="text-slate-600 text-base leading-relaxed">
              No need to gather 10 people on a zoom call just to walk through updates. Drop pins directly onto canvas screens, leave voice or text feedback, and allow executives to review at their own pace.
            </p>

            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Pinpoint commenting with notification threads</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Complete version history rollback with 1-click restore</span>
              </li>
            </ul>

            {/* Customer Quote Badge */}
            <div className="mt-8 p-5 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-4">
                "Our executives now review and approve multi-million dollar procurement flows directly inside the presentation deck. It eliminated three weekly status calls."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  MV
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Marcus Vance</div>
                  <div className="text-[11px] text-slate-500">VP of Product & Strategy</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ---------------- FEATURE 03 ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Copy & Quote */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-purple-600">
              <span className="w-6 h-px bg-purple-600" />
              <span>Superpower 03</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              One-Click Presentation Mode That Wows Every Stakeholder
            </h3>

            <p className="text-slate-600 text-base leading-relaxed">
              Transform your working canvas into an interactive, high-fidelity slide deck with a single click. Guide your audience through step-by-step camera movements, clickable screen hotspots, and live speaker notes.
            </p>

            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mr-3 shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Guided step-by-step story flow with smooth camera panning</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mr-3 shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Interactive prototype hotspots remain fully clickable while presenting</span>
              </li>
            </ul>

            {/* Customer Quote Badge */}
            <div className="mt-8 p-5 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-4">
                "The smoothest presentation experience our clients have ever seen. It feels like navigating a native application rather than static slides."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-rose-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  DK
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Dmitriy Kim</div>
                  <div className="text-[11px] text-slate-500">Head of Operations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Card Preview */}
          <div className="lg:col-span-6 bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md relative overflow-hidden group hover:border-purple-400/60 transition-all duration-300">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-6">
              <span>Presentation Walkthrough Simulator</span>
              <span className="text-purple-600 font-bold">Click steps to preview</span>
            </div>

            {/* Step Selection Pills */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[1, 2, 3].map((step) => (
                <button
                  key={step}
                  onClick={() => setActiveStep(step)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    activeStep === step
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  Step 0{step}
                </button>
              ))}
            </div>

            {/* Simulated Presentation Slide Preview */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm min-h-[200px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-purple-700 font-bold mb-2">
                  <span>PRESENTATION SLIDE 0{activeStep}</span>
                  <span className="text-slate-400 font-normal">Audience View (1080p)</span>
                </div>

                {activeStep === 1 && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <h4 className="text-base font-bold text-slate-900">1. Raw Commodity Ingestion</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Extracting 24,000+ products from official weekly exchange bulletins via automated OCR pipelines.
                    </p>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <h4 className="text-base font-bold text-slate-900">2. Chronos AI Forecasting Model</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Zero-shot transformer projection predicts price trajectories with 98.4% historical backtesting confidence.
                    </p>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <h4 className="text-base font-bold text-slate-900">3. Procurement Execution & Savings</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Locking contract rates before market surges saves organizations up to 14.2% on seasonal purchases.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Speaker notes: Present slide 0{activeStep} in 90 seconds</span>
                <span className="text-purple-600 font-semibold">Ready to present</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
