// src/App.tsx
import React, { useEffect, useState } from "react";
import {
  BookOpen, Brain, Users, FileText, Download, ChevronRight, Lightbulb, Target,
  CheckCircle, Upload, Database, ChevronDown, Save, FolderOpen, Library,
  BarChart3, Shield, Printer, Link2, Sparkles
} from "lucide-react";

import { KDImport } from "./components/KDImport";
import { SavedObjectives } from "./components/SavedObjectives";
import { TemplateLibrary } from "./components/TemplateLibrary";

/** BELANGRIJK: named exports zoals voorheen */
import { QualityChecker } from "./components/QualityChecker";
import { EducationGuidance } from "./components/EducationGuidance";

import { KDStructure } from "./types/kd";
import { KDParser } from "./utils/kdParser";
import { ExportUtils } from "./utils/exportUtils";
import { geminiService } from "./services/geminiService";

/* --------------------- Helpers: opslag + delen --------------------- */
const STORAGE_KEY = "ld-app-state-v2";

function encodeState(obj: unknown) {
  return encodeURIComponent(btoa(JSON.stringify(obj)));
}
function decodeState<T = any>(q: string | null): T | null {
  if (!q) return null;
  try { return JSON.parse(atob(decodeURIComponent(q))) as T; } catch { return null; }
}

/* ===== AI-GO: automatische labeling (regelgebaseerd) ===== */
type AIGOTagKey = "Kennis" | "Vaardigheden" | "Attitude" | "Ethiek";
type Lane = "baan1" | "baan2"; // baan1 = zonder AI, baan2 = met AI

const AIGO_KEYWORDS: Record<AIGOTagKey, RegExp[]> = {
  Kennis: [
    /\b(begrip|uitleg(gen)?|verklaar|kennis|theorie|principes|concept(en)?)\b/i,
    /\b(ai|algoritme(n)?|model(len)?|dataset(s)?|prompt(s)?)\b/i,
  ],
  Vaardigheden: [
    /\b(past toe|toepassen|uitvoeren|maken|ontwerpen|opstellen|implementeren|analyseren|organiseren|plannen)\b/i,
    /\b(evalueren|testen|controleren|valideren|feedback|itereren)\b/i,
  ],
  Attitude: [
    /\b(reflectie|reflecteren|houding|samenwerken|communiceren|eigen verantwoordelijkheid|professioneel)\b/i,
    /\b(inclusie(f)?|toegankelijk(heid)?|veilig(e)? leer-|veilig sportklimaat)\b/i,
  ],
  Ethiek: [
    /\b(ethiek|ethisch|transparantie|verantwoording|bias|voor(o)ordeel|fair(ness)?|eerlijke kansen)\b/i,
    /\b(bron(nering)?|bronvermelding|privacy|avg|autonomie)\b/i,
  ],
};

function inferAIGOTags(
  text: string,
  opts?: { withAI?: boolean; domain?: string }
): AIGOTagKey[] {
  if (!text?.trim()) return [];
  const t = text.toLowerCase();
  const scores = new Map<AIGOTagKey, number>([
    ["Kennis", 0],
    ["Vaardigheden", 0],
    ["Attitude", 0],
    ["Ethiek", 0],
  ]);

  (Object.keys(AIGO_KEYWORDS) as AIGOTagKey[]).forEach((k) => {
    const hits = AIGO_KEYWORDS[k].reduce((acc, rx) => acc + (rx.test(t) ? 1 : 0), 0);
    scores.set(k, (scores.get(k) || 0) + hits);
  });

  if (opts?.domain) {
    scores.set("Vaardigheden", (scores.get("Vaardigheden") || 0) + 1);
    scores.set("Attitude", (scores.get("Attitude") || 0) + 0.5);
  }
  if (opts?.withAI) {
    scores.set("Ethiek", (scores.get("Ethiek") || 0) + 1);
    scores.set("Kennis", (scores.get("Kennis") || 0) + 0.5);
  }

  const sorted = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const above1 = sorted.filter(([, s]) => s >= 1).map(([k]) => k);
  if (above1.length) return above1.slice(0, 4);
  return sorted.slice(0, 2).map(([k]) => k);
}

/* ------------------------- Types uit jouw app ---------------------- */
interface LearningObjective {
  original: string;
  context: {
    education: string;
    level: string;
    domain: string;
    assessment: string;
  };
}
interface AIReadyOutput {
  newObjective: string;
  rationale: string;
  activities: string[];
  assessments: string[];
}
interface SavedObjective {
  id: string;
  originalObjective: string;
  aiReadyObjective: string;
  context: {
    education: string;
    level: string;
    domain: string;
    assessment: string;
  };
  createdAt: string;
  tags: string[];
}

/* ---------------------------- Component ---------------------------- */
function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LearningObjective>({
    original: "",
    context: { education: "", level: "", domain: "", assessment: "" },
  });
  const [lane, setLane] = useState<Lane>("baan1"); // Two-Lane keuze
  const [output, setOutput] = useState<AIReadyOutput | null>(null);
  const [aiGoTags, setAiGoTags] = useState<AIGOTagKey[]>([]);
  const [aiStatement, setAiStatement] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKDImport, setShowKDImport] = useState(false);
  const [showSavedObjectives, setShowSavedObjectives] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [importedKD, setImportedKD] = useState<KDStructure | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showQualityChecker, setShowQualityChecker] = useState(false);
  const [showEducationGuidance, setShowEducationGuidance] = useState(false);

  /* ---------- Hydrate bij laden (eerst URL, anders localStorage) ---------- */
  useEffect(() => {
    const fromUrl = decodeState<{
      currentStep: number;
      formData: LearningObjective;
      lane?: Lane;
      output: AIReadyOutput | null;
      aiStatement?: string;
      importedKD?: KDStructure | null;
    }>(new URLSearchParams(window.location.search).get("data"));

    if (fromUrl) {
      setCurrentStep(fromUrl.currentStep ?? 1);
      setFormData(fromUrl.formData ?? formData);
      setLane(fromUrl.lane ?? "baan1");
      setOutput(fromUrl.output ?? null);
      setAiStatement(fromUrl.aiStatement ?? "");
      if (fromUrl.output) {
        setAiGoTags(
          inferAIGOTags(fromUrl.output.newObjective, {
            withAI: (fromUrl.lane ?? "baan1") === "baan2",
            domain: fromUrl.formData?.context?.domain,
          })
        );
      }
      if (fromUrl.importedKD) setImportedKD(fromUrl.importedKD);
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.formData) setFormData(saved.formData);
        if (typeof saved.lane === "string") setLane(saved.lane);
        if (saved.output) {
          setOutput(saved.output);
          setAiGoTags(
            inferAIGOTags(saved.output.newObjective, {
              withAI: saved.lane === "baan2",
              domain: saved.formData?.context?.domain,
            })
          );
        }
        if (typeof saved.currentStep === "number") setCurrentStep(saved.currentStep);
        if (saved.importedKD) setImportedKD(saved.importedKD);
        if (saved.aiStatement) setAiStatement(saved.aiStatement);
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Autosave naar localStorage ---------------- */
  useEffect(() => {
    const state = { currentStep, formData, lane, output, aiStatement, importedKD };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [currentStep, formData, lane, output, aiStatement, importedKD]);

  const educationTypes = ["MBO", "HBO", "WO"];
  const levels = {
    MBO: ["Niveau 1", "Niveau 2", "Niveau 3", "Niveau 4"],
    HBO: ["Bachelor", "Associate Degree"],
    WO: ["Bachelor", "Master"],
  };

  const examples = [
    {
      original: "De student kan een zakelijke e-mail schrijven in correct Nederlands.",
      context: "MBO niveau 3, secretarieel medewerker",
      newObjective:
        "De student kan met hulp van AI-tools een zakelijke e-mail maken, de AI-tekst controleren en verbeteren, en zelf de juiste toon kiezen voor de ontvanger.",
    },
    {
      original: "De student kan een marktanalyse uitvoeren voor een nieuwe product.",
      context: "HBO Bachelor, Marketing",
      newObjective:
        "De student kan een marktanalyse maken waarbij AI-tools helpen met data verzamelen, de AI-resultaten controleren op juistheid, en zelf conclusies trekken voor het product.",
    },
  ];

  const isFormDataComplete = () =>
    formData.original.trim() !== "" &&
    formData.context.education.trim() !== "" &&
    formData.context.level.trim() !== "" &&
    formData.context.domain.trim() !== "";

  /* -------------------- Step-switch → automatisch genereren -------------------- */
  useEffect(() => {
    if (currentStep === 2 && !isProcessing && !output) {
      if (isFormDataComplete()) {
        transformToAIReady();
      } else {
        setCurrentStep(1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  /* -------------------- KD import → context invullen -------------------- */
  useEffect(() => {
    if (importedKD && formData.original) {
      setFormData((prev) => ({
        ...prev,
        context: {
          ...prev.context,
          education: importedKD.metadata.level.includes("MBO")
            ? "MBO"
            : importedKD.metadata.level.includes("HBO")
            ? "HBO"
            : "WO",
          level: importedKD.metadata.level,
          domain: importedKD.metadata.sector,
          assessment: prev.context.assessment,
        },
      }));
    }
  }, [importedKD, formData.original]);

  const transformToAIReady = async () => {
    if (!isFormDataComplete()) {
      setCurrentStep(1);
      return;
    }
    setIsProcessing(true);
    try {
      if (geminiService.isAvailable()) {
        const kdContext = importedKD
          ? {
              title: importedKD.metadata.title,
              code: importedKD.metadata.code,
              relatedCompetencies: KDParser.extractContextForObjective(
                importedKD,
                formData.original
              ).relatedCompetencies,
              relatedWorkProcesses: KDParser.extractContextForObjective(
                importedKD,
                formData.original
              ).relatedWorkProcesses,
            }
          : undefined;

        const geminiResponse = await geminiService.generateAIReadyObjective(
          { ...formData, lane },
          kdContext
        );
        const adjusted: AIReadyOutput = {
          ...geminiResponse,
          newObjective:
            lane === "baan2"
              ? geminiResponse.newObjective
              : geminiResponse.newObjective
                  .replace(/met hulp van.*?,\s*/i, "")
                  .replace(/\bAI-?tools?\b/gi, "hulpmiddelen"),
        };
        setOutput(adjusted);
        setAiGoTags(
          inferAIGOTags(adjusted.newObjective, {
            withAI: lane === "baan2",
            domain: formData.context.domain,
          })
        );
      } else {
        const aiOutput: AIReadyOutput = {
          newObjective: generateAIReadyObjective(formData, lane),
          rationale: generateRationale(formData),
          activities: generateActivities(formData, lane),
          assessments: generateAssessments(formData, lane),
        };
        setOutput(aiOutput);
        setAiGoTags(
          inferAIGOTags(aiOutput.newObjective, {
            withAI: lane === "baan2",
            domain: formData.context.domain,
          })
        );
      }
      setCurrentStep(3);
    } catch {
      const fallback: AIReadyOutput = {
        newObjective: generateAIReadyObjective(formData, lane),
        rationale: generateRationale(formData),
        activities: generateActivities(formData, lane),
        assessments: generateAssessments(formData, lane),
      };
      setOutput(fallback);
      setAiGoTags(
        inferAIGOTags(fallback.newObjective, {
          withAI: lane === "baan2",
          domain: formData.context.domain,
        })
      );
      setCurrentStep(3);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAIReadyObjective = (data: LearningObjective, whichLane: Lane): string => {
    const originalObjective = data.original || "";
    const baseObjective = originalObjective.toLowerCase();
    let kdContext = "";
    if (importedKD) {
      const contextInfo = KDParser.extractContextForObjective(importedKD, originalObjective);
      if (contextInfo.relatedCompetencies.length > 0) {
        kdContext = ` binnen de competentie "${contextInfo.relatedCompetencies[0].title}"`;
      }
    }
    const equityTerms = whichLane === "baan2" ? "gratis AI-tools die iedereen kan gebruiken" : "hulpmiddelen";
    const ethicsTerms = whichLane === "baan2" ? "controleren of de AI eerlijk is" : "kwaliteitscontrole";
    const transparencyTerms = whichLane === "baan2" ? "uitleggen hoe AI is gebruikt" : "verantwoorden";
    const autonomyTerms = "zelf";

    if (baseObjective.includes("schrijven") || baseObjective.includes("tekst") || baseObjective.includes("communicatie")) {
      return `De student kan met hulp van ${equityTerms} ${originalObjective.replace(/^De student kan /, "").toLowerCase()}, de output ${ethicsTerms}, en de uiteindelijke versie ${autonomyTerms} verbeteren met ${transparencyTerms} binnen de ${data.context.domain} context${kdContext}.`;
    } else if (baseObjective.includes("analyse") || baseObjective.includes("onderzoek") || baseObjective.includes("data")) {
      return `De student kan ${originalObjective.replace(/^De student kan /, "").toLowerCase()} waarbij ${whichLane === "baan2" ? "AI-tools" : "hulpmiddelen"} helpen met data verzamelen, de resultaten ${ethicsTerms}, en ${autonomyTerms} conclusies trekken die eerlijk zijn binnen de ${data.context.domain}${kdContext}.`;
    } else if (baseObjective.includes("ontwerp") || baseObjective.includes("creëren") || baseObjective.includes("maken")) {
      return `De student kan ${originalObjective.replace(/^De student kan /, "").toLowerCase()} met hulp van ${equityTerms} voor ideeën, de suggesties ${ethicsTerms}, en het eindresultaat ${autonomyTerms} maken met ${transparencyTerms} binnen de ${data.context.domain}${kdContext}.`;
    } else {
      return `De student kan ${originalObjective.replace(/^De student kan /, "").toLowerCase()} met hulp van ${equityTerms}, de output ${ethicsTerms}, en ${autonomyTerms} tot een goede uitvoering komen met ${transparencyTerms} binnen de ${data.context.domain} context${kdContext}.`;
    }
  };

  const generateRationale = (data: LearningObjective): string => {
    const educationLevel = data.context.education;
    const domain = data.context.domain;
    let kdRationale = "";
    if (importedKD) {
      kdRationale = ` Deze aanpassing is gebaseerd op het kwalificatiedossier "${importedKD.metadata.title}" en past bij de competenties en werkprocessen.`;
    }
    return `Volgens de Nederlandse visie op AI en eerlijke kansen is het belangrijk dat ${educationLevel}-studenten binnen ${domain} leren werken met technologie op een manier die eerlijke kansen biedt voor alle studenten. Deze aangepaste leeruitkomst zorgt ervoor dat studenten leren eerlijk te handelen, begrijpen hoe technologie werkt, en zelf beslissingen blijven nemen. De student ontwikkelt zowel vaardigheid als bewustzijn voor verantwoord gebruik.${kdRationale}`;
  };

  const generateActivities = (data: LearningObjective, whichLane: Lane): string[] => {
    const domain = data.context.domain.toLowerCase();
    const withAI = whichLane === "baan2";
    const base = [
      `${withAI ? "Gebruik gratis AI-tools" : "Gebruik passende hulpmiddelen"} voor ${domain}-taken en controleer kwaliteit`,
      "Werk samen om resultaten te controleren op fouten en vooroordelen",
      "Licht je keuzes toe (transparantie) en reflecteer op het proces",
      "Presenteer je werk en licht toe hoe je tot beslissingen kwam",
      "Bedenk richtlijnen voor eerlijk gebruik in jouw vakgebied",
    ];
    if (importedKD) {
      const contextInfo = KDParser.extractContextForObjective(importedKD, data.original);
      if (contextInfo.relatedWorkProcesses.length > 0) {
        base.push(
          `Koppel aan werkproces "${contextInfo.relatedWorkProcesses[0].title}" en geef alternatieven voor studenten zonder betaalde tools`
        );
      }
    }
    return base;
  };

  const generateAssessments = (_data: LearningObjective, whichLane: Lane): string[] => {
    const withAI = whichLane === "baan2";
    const assessments = [
      `Authentieke opdracht waarin de student het werkproces laat zien met ${withAI ? "transparant AI-gebruik" : "eigen uitvoering"} en verantwoording`,
      "Portfolio met kritische reflectie op kwaliteit en eerlijke kansen",
      "Mondelinge verificatie over keuzes en betrouwbaarheid van bronnen",
      "Peer-review op toegankelijkheid en inclusie",
    ];
    if (importedKD) {
      assessments.push("Beoordeling volgens KD-criteria, aangevuld met transparantie en inclusie");
    }
    return assessments;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "original") {
      setFormData((prev) => ({ ...prev, original: value }));
    } else {
      setFormData((prev) => ({ ...prev, context: { ...prev.context, [field]: value } }));
    }
  };
  const handleKDImported = (kd: KDStructure) => setImportedKD(kd);

  const saveObjective = () => {
    if (!output) return;
    const savedObjective: SavedObjective = {
      id: Date.now().toString(),
      originalObjective: formData.original,
      aiReadyObjective: output.newObjective,
      context: formData.context,
      createdAt: new Date().toISOString(),
      tags: [formData.context.domain, formData.context.education, "Nederlandse Visie"],
    };
    const existing = JSON.parse(localStorage.getItem("savedObjectives") || "[]");
    existing.push(savedObjective);
    localStorage.setItem("savedObjectives", JSON.stringify(existing));
    alert("Leerdoel opgeslagen.");
  };

  const loadObjective = (objective: SavedObjective) => {
    setFormData({ original: objective.originalObjective, context: objective.context });
    const o: AIReadyOutput = {
      newObjective: objective.aiReadyObjective,
      rationale: generateRationale({ original: objective.originalObjective, context: objective.context }),
      activities: generateActivities({ original: objective.originalObjective, context: objective.context }, lane),
      assessments: generateAssessments({ original: objective.originalObjective, context: objective.context }, lane),
    };
    setOutput(o);
    setAiGoTags(inferAIGOTags(o.newObjective, { withAI: lane === "baan2", domain: objective.context.domain }));
    setCurrentStep(3);
    setShowSavedObjectives(false);
  };

  const useTemplate = (template: any) => {
    setFormData({
      original: template.originalObjective,
      context: { education: template.education, level: template.level, domain: template.domain, assessment: "" },
    });
    setShowTemplateLibrary(false);
  };

  const getExportData = () => {
    if (!output) return null;
    return {
      originalObjective: formData.original,
      context: formData.context,
      lane,
      aiReadyObjective: output.newObjective,
      rationale: output.rationale,
      suggestedActivities: output.activities,
      suggestedAssessments: output.assessments,
      aiGoTags,
      aiStatement,
      kdContext: importedKD
        ? {
            title: importedKD.metadata.title,
            code: importedKD.metadata.code,
            relatedCompetencies: KDParser.extractContextForObjective(importedKD, formData.original).relatedCompetencies,
          }
        : null,
      nationalVisionCompliance: true,
      exportDate: new Date().toLocaleDateString("nl-NL"),
      generatedBy: "DigitEd AI Curriculum Designer v2.0",
    };
  };

  const handleExport = (format: "pdf" | "word" | "json") => {
    const exportData = getExportData();
    if (!exportData) return;
    switch (format) {
      case "pdf":
        ExportUtils.exportToPDF(exportData);
        break;
      case "word":
        ExportUtils.exportToWord(exportData);
        break;
      case "json":
        ExportUtils.exportToJSON(exportData);
        break;
    }
    setShowExportMenu(false);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({ original: "", context: { education: "", level: "", domain: "", assessment: "" } });
    setLane("baan1");
    setOutput(null);
    setAiGoTags([]);
    setAiStatement("");
    setIsProcessing(false);
    setShowQualityChecker(false);
    setShowEducationGuidance(false);
  };

  /* ---------- Deelbare link + Print + AI-statement ---------- */
  const shareLink = () => {
    const payload = encodeState({ currentStep, formData, lane, output, aiStatement, importedKD });
    const url = new URL(window.location.href);
    url.searchParams.set("data", payload);
    navigator.clipboard.writeText(url.toString());
    alert("Deelbare link gekopieerd!");
  };
  const printPdf = () => window.print();
  const buildAIStatement = () => {
    const withAI = lane === "baan2";
    const txt = [
      "AI-statement",
      "",
      `Leerdoel/leeruitkomst: ${output?.newObjective ?? "(nog niet gegenereerd)"}`,
      `Context: ${formData.context.education} – ${formData.context.level} – ${formData.context.domain}`,
      "",
      `Gebruik van ${withAI ? "gratis AI-tools" : "hulpmiddelen"}:`,
      withAI
        ? "- Ik heb gratis AI-tools gebruikt (bijv. browser, prompts, open bronnen) ter ondersteuning (ideas, structureren, feedback)."
        : "- Ik heb geen AI-tools gebruikt; ik heb eigen uitvoering en bronnen ingezet.",
      "- Ik heb keuzes, bewerkingen en bronnen gecontroleerd (kwaliteit, actualiteit, eventuele bias).",
      "- Ik licht toe welke delen AI-suggesties zijn en welke mijn eigen bijdrage zijn (transparantie).",
      "- Ik noem gebruikte bronnen en respecteer privacy/AVG.",
    ].join("\n");
    setAiStatement(txt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* DigitEd Logo */}
              <a
                href="https://www.digited.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
                title="Ga naar DigitEd website"
              >
                <img src="/logo5.png" alt="DigitEd Logo" className="h-12 w-auto" />
              </a>

              <div className="border-l border-gray-300 pl-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-green-600 to-orange-500 p-2 rounded-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                      AI Leerdoelenmaker
                    </h1>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Shield className="w-4 h-4 mr-1 text-green-600" />
                      Maak leeruitkomsten geschikt voor AI en eerlijke kansen (gratis tools)
                      {geminiService.isAvailable() && <span className="ml-2 text-green-600 font-medium">• AI-Enhanced</span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {importedKD && (
                <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <Database className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{importedKD.metadata.title}</span>
                </div>
              )}

              <button
                onClick={() => setShowTemplateLibrary(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Library className="w-4 h-4" />
                <span>Voorbeelden</span>
              </button>

              <button
                onClick={() => setShowSavedObjectives(true)}
                className="flex items-center space-x-2 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Opgeslagen</span>
              </button>

              <button
                onClick={() => setShowKDImport(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Upload className="w-4 h-4" />
                <span>KD Importeren</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: "Invoer", icon: FileText },
              { step: 2, title: "Omzetten", icon: Brain },
              { step: 3, title: "Resultaat", icon: CheckCircle },
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    currentStep >= step
                      ? "bg-gradient-to-r from-green-600 to-orange-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`ml-2 font-medium ${
                    currentStep >= step
                      ? "bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent"
                      : "text-gray-500"
                  }`}
                >
                  {title}
                </span>
                {step < 3 && <ChevronRight className="w-4 h-4 text-gray-400 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Input Form */}
        {currentStep === 1 && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Target className="w-5 h-5 text-green-600 mr-2" />
                  Origineel Leerdoel & Context
                </h2>

                <div className="space-y-6">
                  {/* Two-Lane keuze */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-slate-700 mb-2">Kies aanpak</div>
                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="lane"
                          value="baan1"
                          checked={lane === "baan1"}
                          onChange={() => setLane("baan1")}
                        />
                        <span>Baan 1 — zonder AI (individuele bekwaamheid)</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="lane"
                          value="baan2"
                          checked={lane === "baan2"}
                          onChange={() => setLane("baan2")}
                        />
                        <span>Baan 2 — met AI (werkrealistisch, gratis tools)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Huidige leeruitkomst *
                    </label>
                    <textarea
                      value={formData.original}
                      onChange={(e) => handleInputChange("original", e.target.value)}
                      placeholder="Bijvoorbeeld: De student kan een zakelijke e-mail schrijven in correct Nederlands."
                      className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200"
                    />
                    {importedKD && formData.original && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          <strong>KD Context:</strong>{" "}
                          {KDParser.extractContextForObjective(importedKD, formData.original).suggestedContext}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Onderwijstype *
                      </label>
                      <select
                        value={formData.context.education}
                        onChange={(e) => handleInputChange("education", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Kies type</option>
                        {educationTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Niveau *
                      </label>
                      <select
                        value={formData.context.level}
                        onChange={(e) => handleInputChange("level", e.target.value)}
                        disabled={!formData.context.education}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50"
                      >
                        <option value="">Kies niveau</option>
                        {formData.context.education &&
                          levels[formData.context.education as keyof typeof levels]?.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vakgebied *
                      </label>
                      <input
                        type="text"
                        value={formData.context.domain}
                        onChange={(e) => handleInputChange("domain", e.target.value)}
                        placeholder="Bijvoorbeeld: Marketing, Zorg, ICT"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Huidige toetsvorm
                      </label>
                      <input
                        type="text"
                        value={formData.context.assessment}
                        onChange={(e) => handleInputChange("assessment", e.target.value)}
                        placeholder="Bijvoorbeeld: Portfolio, Examen"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!isFormDataComplete()}
                    className="w-full bg-gradient-to-r from-green-600 to-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                  >
                    Omzetten naar AI-ready onderwijs
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Examples Sidebar */}
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Voorbeelden (Nederlandse Visie)
                </h3>
                <div className="space-y-4">
                  {examples.map((example, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 border border-green-100">
                      <p className="text-sm text-gray-600 mb-2">{example.context}</p>
                      <p className="text-sm font-medium text-gray-800 mb-2">Origineel:</p>
                      <p className="text-sm text-gray-700 mb-3 italic">"{example.original}"</p>
                      <p className="text-sm font-medium text-green-700 mb-2">AI-ready (Eerlijke kansen):</p>
                      <p className="text-sm text-green-800 italic">"{example.newObjective}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {importedKD && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <h3 className="font-semibold text-orange-800 mb-3 flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Geïmporteerd KD
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Titel:</strong> {importedKD.metadata.title}
                    </p>
                    <p>
                      <strong>Code:</strong> {importedKD.metadata.code}
                    </p>
                    <p>
                      <strong>Niveau:</strong> {importedKD.metadata.level}
                    </p>
                    <p>
                      <strong>Sector:</strong> {importedKD.metadata.sector}
                    </p>
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-orange-200">
                      <div className="text-center">
                        <div className="font-bold text-orange-700">{importedKD.competencies.length}</div>
                        <div className="text-orange-600 text-xs">Competenties</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-orange-700">{importedKD.workProcesses.length}</div>
                        <div className="text-orange-600 text-xs">Werkprocessen</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-orange-700">{importedKD.learningOutcomes.length}</div>
                        <div className="text-orange-600 text-xs">Leeruitkomsten</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dutch Vision Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Nederlandse Visie
                </h3>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>
                    <strong>Eerlijke kansen:</strong> gratis en toegankelijke tools
                  </p>
                  <p>
                    <strong>Vooroordelen herkennen:</strong> kwaliteit/bias check
                  </p>
                  <p>
                    <strong>Transparant:</strong> AI-statement bij resultaat
                  </p>
                  <p>
                    <strong>Ethiek:</strong> verantwoord en privacy-bewust
                  </p>
                  <p>
                    <strong>Inclusie:</strong> alternatieven zonder betaalde tools
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Processing */}
        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-green-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-600 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-orange-200"></div>
                <div
                  className="absolute inset-2 rounded-full border-4 border-transparent border-t-orange-500 animate-spin"
                  style={{ animationDirection: "reverse" }}
                ></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {geminiService.isAvailable()
                  ? "AI-Enhanced omzetting naar AI-ready onderwijs..."
                  : "Omzetting naar AI-ready onderwijs..."}
              </h2>
              <p className="text-gray-600 mb-4">
                Uw leerdoel wordt omgezet naar een AI-ready versie die past bij de Nederlandse richtlijnen voor eerlijke kansen en goed gebruik.
              </p>
              <div className="text-sm text-gray-500">
                <p>✓ Originele leeruitkomst analyseren</p>
                {importedKD && <p>✓ KD-context en competenties betrekken</p>}
                {geminiService.isAvailable() && <p>✓ AI-Enhanced niveau-specifieke aanpassingen</p>}
                <p>✓ Transparantie en inclusie meenemen</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {currentStep === 3 && output && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent flex items-center">
                <Shield className="w-6 h-6 text-green-600 mr-2" />
                AI-Ready Leeruitkomst
                {geminiService.isAvailable() && <span className="text-sm font-normal text-green-600 ml-2">• AI-Enhanced</span>}
              </h2>

              {/* Actieknoppen */}
              <div className="flex flex-wrap gap-3 items-center">
                <button
                  onClick={() => setShowEducationGuidance(!showEducationGuidance)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Handreikingen</span>
                </button>

                <button
                  onClick={() => setShowQualityChecker(!showQualityChecker)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Kwaliteit</span>
                </button>

                <button
                  onClick={saveObjective}
                  className="flex items-center space-x-2 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>Opslaan</span>
                </button>

                {/* Print / Deelbaar */}
                <button
                  onClick={printPdf}
                  className="flex items-center space-x-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white py-2 px-4 rounded-lg font-medium hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-md hover:shadow-lg"
                  title="Print of sla als PDF op"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / PDF</span>
                </button>

                <button
                  onClick={shareLink}
                  className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  title="Kopieer een link met de huidige invoer en resultaat"
                >
                  <Link2 className="w-4 h-4" />
                  <span>Deelbare link</span>
                </button>

                {/* AI-statement genereren */}
                <button
                  onClick={buildAIStatement}
                  className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-2 px-4 rounded-lg font-medium hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 shadow-md hover:shadow-lg"
                  title="Genereer transparante AI-verantwoording"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI-statement</span>
                </button>

                {/* Export-menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Downloaden</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showExportMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleExport("pdf")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-2 text-red-500" />
                          PDF Document
                        </button>
                        <button
                          onClick={() => handleExport("word")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-2 text-blue-500" />
                          Word Document
                        </button>
                        <button
                          onClick={() => handleExport("json")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-2 text-gray-500" />
                          JSON Data
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={resetForm}
                  className="flex items-center space-x-2 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <span>Nieuw Leerdoel</span>
                </button>
              </div>
            </div>

            {/* <<<<< HIER worden de panelen getoond zoals voorheen >>>>> */}
            {showEducationGuidance && (
              <EducationGuidance
                context={formData.context}
                aiReadyObjective={output.newObjective}
              />
            )}

            {showQualityChecker && (
              <QualityChecker
                objective={output.newObjective}
                context={formData.context}
              />
            )}

            {/* Result blokken */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Original vs New */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Vergelijking</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-2">Origineel:</p>
                    <p className="text-red-700">{formData.original}</p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-2">AI-ready:</p>
                    <p className="text-green-700">{output.newObjective}</p>

                    {/* AI-GO chips */}
                    {aiGoTags.length > 0 && (
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {aiGoTags.map((tag) => (
                          <span
                            key={tag}
                            title={
                              tag === "Kennis"
                                ? "Begrip, concepten, theorie, AI-basiskennis"
                                : tag === "Vaardigheden"
                                ? "Toepassen/uitvoeren, maken, evalueren"
                                : tag === "Attitude"
                                ? "Reflectie, samenwerking, toegankelijkheid"
                                : "Ethiek, transparantie, privacy, eerlijke kansen"
                            }
                            className={
                              tag === "Kennis"
                                ? "px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm border border-indigo-200"
                                : tag === "Vaardigheden"
                                ? "px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm border border-emerald-200"
                                : tag === "Attitude"
                                ? "px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm border border-amber-200"
                                : "px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-sm border border-rose-200"
                            }
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rationale + AI-statement */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 text-green-600 mr-2" />
                  Uitleg & AI-statement
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">{output.rationale}</p>
                {aiStatement && (
                  <pre className="p-3 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap text-sm">
                    {aiStatement}
                  </pre>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Learning Activities */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 text-green-600 mr-2" />
                  Leeractiviteiten
                </h3>
                <ul className="space-y-3">
                  {output.activities.map((activity, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">{idx + 1}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{activity}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assessment Forms */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 text-orange-500 mr-2" />
                  Toetsvormen
                </h3>
                <ul className="space-y-3">
                  {output.assessments.map((assessment, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-orange-600">{idx + 1}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{assessment}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showKDImport && <KDImport onKDImported={handleKDImported} onClose={() => setShowKDImport(false)} />}
      {showSavedObjectives && <SavedObjectives onLoadObjective={loadObjective} onClose={() => setShowSavedObjectives(false)} />}
      {showTemplateLibrary && <TemplateLibrary onUseTemplate={useTemplate} onClose={() => setShowTemplateLibrary(false)} />}

      {/* Click outside to close export menu */}
      {showExportMenu && <div className="fixed inset-0 z-5" onClick={() => setShowExportMenu(false)} />}
    </div>
  );
}

export default App;
