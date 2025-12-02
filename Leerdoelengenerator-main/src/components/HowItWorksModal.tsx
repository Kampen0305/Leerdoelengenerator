import React from 'react';
import { X, FileText, Brain, CheckCircle, ArrowRight } from 'lucide-react';

interface HowItWorksModalProps {
    onClose: () => void;
}

export function HowItWorksModal({ onClose }: HowItWorksModalProps) {
    const steps = [
        {
            icon: FileText,
            title: "1. Invoer",
            description: "Kies je onderwijssector (VO, MBO, HBO, WO) en voer je bestaande leerdoel of idee in. Je kunt ook een kwalificatiedossier (KD) importeren voor extra context.",
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100"
        },
        {
            icon: Brain,
            title: "2. AI-Transformatie",
            description: "Onze AI analyseert je invoer en herschrijft deze naar een 'AI-ready' leeruitkomst. Hierbij wordt rekening gehouden met de 'Two-Lane Approach' (wel/geen AI) en het AI-GO raamwerk.",
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "border-purple-100"
        },
        {
            icon: CheckCircle,
            title: "3. Resultaat",
            description: "Je ontvangt een direct bruikbare, toetsbare leeruitkomst inclusief suggesties voor leeractiviteiten, toetsvormen en een ethische verantwoording.",
            color: "text-green-600",
            bg: "bg-green-50",
            border: "border-green-100"
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Hoe werkt de generator?</h2>
                        <p className="text-slate-500 text-sm mt-1">In 3 stappen naar een toekomstbestendig leerdoel</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    <div className="grid md:grid-cols-3 gap-6 relative">
                        {/* Connecting line for desktop */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-100 via-purple-100 to-green-100 -z-10" />

                        {steps.map((step, index) => (
                            <div key={index} className="relative group">
                                <div className={`w-24 h-24 mx-auto ${step.bg} ${step.border} border-2 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                                    <step.icon className={`w-10 h-10 ${step.color}`} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 text-center mb-3">{step.title}</h3>
                                <p className="text-slate-600 text-center text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mt-8">
                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                            <SparklesIcon className="w-4 h-4 text-amber-500 mr-2" />
                            Waarom AI-Ready?
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Studenten gebruiken AI, of we het nu willen of niet. Door leerdoelen "AI-ready" te maken, integreer je AI-geletterdheid direct in het curriculum. Je maakt expliciet wanneer AI wel (Baan 2) of niet (Baan 1) gebruikt mag worden, en hoe studenten dit moeten verantwoorden.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-800 transition-all shadow-lg hover:shadow-xl flex items-center"
                    >
                        Ik snap het, start direct
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function SparklesIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
    );
}
