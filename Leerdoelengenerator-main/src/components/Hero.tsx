import React, { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { HowItWorksModal } from "./HowItWorksModal";

export function Hero() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const scrollToForm = () => {
    document.getElementById("form-start")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 bg-mesh pt-16 pb-20 lg:pt-24 lg:pb-28">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-600 mb-4">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>Nu met AI-GO & Two-Lane support</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary">
          Ontwerp krachtige leerdoelen <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary-light">
            in seconden.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Combineer jouw didactische expertise met slimme AI. Genereer toetsbare doelen die direct voldoen aan Npuls-richtlijnen, SLO-kerndoelen en het AI-GO raamwerk.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={scrollToForm}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 bg-primary hover:bg-primary-800 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Start direct
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setShowHowItWorks(true)}
            className="text-slate-600 hover:text-primary font-medium px-6 py-3 transition-colors"
          >
            Hoe werkt het?
          </button>
        </div>

        {/* Feature pills */}
        <div className="pt-8 flex flex-wrap justify-center gap-3 text-sm font-medium text-slate-500">
          <span className="px-3 py-1 glass-panel rounded-full text-xs uppercase tracking-wider text-slate-600">✨ Constructive Alignment</span>
          <span className="px-3 py-1 glass-panel rounded-full text-xs uppercase tracking-wider text-slate-600">🚀 Two-Lane Approach</span>
          <span className="px-3 py-1 glass-panel rounded-full text-xs uppercase tracking-wider text-slate-600">⚖️ Ethisch Verantwoord</span>
        </div>
      </div>

      {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}
    </section>
  );
}
