// src/App.tsx
import React, { useEffect, useState } from "react";
import {
  BookOpen, Brain, FileText, Download, ChevronRight, Lightbulb, Target,
  CheckCircle, Upload, Database, ChevronDown, Save, FolderOpen, Library,
  BarChart3, Shield, Printer, Link2, Sparkles, Menu
} from "lucide-react";

import { KDImport } from "./components/KDImport";
import { SavedObjectives } from "./components/SavedObjectives";
import { TemplateLibrary } from "./components/TemplateLibrary";
import { Hero } from "./components/Hero";
import ExamplesPanel from "./components/ExamplesPanel";

/** Paneel-knoppen werken weer via named exports zoals voorheen */
import { QualityChecker } from "./components/QualityChecker";
import { EducationGuidance } from "./components/EducationGuidance";
import ObjectiveForm from "./ObjectiveForm";

import { KDStructure } from "./types/kd";
import { KDParser } from "./utils/kdParser";
import { ExportUtils } from "./utils/exportUtils";
import { geminiService } from "./services/gemini";
import FeedbackBar from "./components/FeedbackBar";
import type { Education, VoLevel, VSOCluster } from "./types/context";
import { EDUCATION_TYPES, LEVEL_OPTIONS, VO_LEVELS, VSO_CLUSTERS } from "./constants/education";
import InfoBox from "./components/InfoBox";
import { getVoGradeOptions } from "./utils/vo";
import { LevelBadge } from "./components/LevelBadge";
import { NiveauCheck } from "./components/NiveauCheck";
import { feature } from "@/config";
import { LevelKey } from "./domain/levelProfiles";
import Suggestions from "./components/Suggestions";
import { getSuggestions } from "./data/suggestions";
import { inferGoalOrientation, mapEducationLevel } from "./utils/suggestionHelpers";
import type { SuggestionBundle } from "./types/learning";

/* --------------------- Helpers: opslag + delen --------------------- */
const STORAGE_KEY = "ld-app-state-v2";

function encodeState(obj: unknown) {
  return encodeURIComponent(btoa(JSON.stringify(obj)));
}
function decodeState<T = any>(q: string | null): T | null {
  if (!q) return null;
  try { return JSON.parse(atob(decodeURIComponent(q))) as T; } catch { return null; }
}

function toLevelKey(ctx: { education: Education; level: string; voLevel?: VoLevel; vsoCluster?: VSOCluster }): LevelKey {
  switch (ctx.education) {
    case "MBO":
      if (ctx.level === "Niveau 1") return "MBO-1";
      if (ctx.level === "Niveau 2") return "MBO-2";
      if (ctx.level === "Niveau 3") return "MBO-3";
      if (ctx.level === "Niveau 4") return "MBO-4";
      break;
    case "HBO":
      if (ctx.level === "Associate Degree") return "HBO-AD";
      if (ctx.level === "Bachelor") return "HBO-Bachelor";
      if (ctx.level === "Master") return "HBO-Master";
      break;
    case "WO":
      if (ctx.level === "Bachelor") return "WO-Bachelor";
      if (ctx.level === "Master") return "WO-Master";
      break;
    case "VO":
      switch (ctx.voLevel) {
        case "vmbo-bb":
        case "vmbo-kb":
          return "VO-vmbo-bbkb";
        case "vmbo-gl-tl":
          return "VO-vmbo-gtl";
        case "havo":
          return "VO-havo";
        case "vwo":
          return "VO-vwo";
      }
      break;
    case "VSO":
      if (ctx.level === "Vervolgonderwijsroute") return "VSO-vervolgonderwijs";
      if (ctx.level === "Arbeidsmarktgerichte route") return "VSO-arbeidsmarkt";
      if (ctx.level === "Dagbestedingsroute") return "VSO-dagbesteding";
      break;
  }
  console.warn("Onbekend niveau, val terug op HBO-Bachelor");
  return "HBO-Bachelor";
}

/* ===== AI-GO: automatische labeling (regelgebaseerd) ===== */
type AIGOTagKey = "Kennis" | "Vaardigheden" | "Attitude" | "Ethiek";
type Lane = "baan1" | "baan2"; // baan1 = zonder AI, baan2 = met AI
type GenerationSource = "gemini" | "fallback" | null;

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

const attachSuggestions = (
  obj: AIReadyOutput,
  ctx: LearningObjective["context"],
): AIReadyOutput => {
  const level = mapEducationLevel({
    original: "",
    education: ctx.education,
    level: ctx.level,
    domain: "",
    assessment: "",
    voLevel: ctx.voLevel,
    voGrade: ctx.voGrade,
    vsoCluster: ctx.vsoCluster,
  });
  const orientation = inferGoalOrientation(obj.newObjective);
  return { ...obj, suggestions: getSuggestions(orientation, level) };
};

/* ------------------------- Types uit jouw app ---------------------- */
interface LearningObjective {
  original: string;
  context: {
    education: Education;
    level: string;
    domain: string;
    assessment: string;
    voLevel?: VoLevel;
    voGrade?: number;
    vsoCluster?: VSOCluster;
  };
}
interface AIReadyOutput {
  newObjective: string;
  rationale: string;
  activities: string[];
  assessments: string[];
  aiLiteracy: string;
  suggestions: SuggestionBundle;
}
interface SavedObjective {
  id: string;
  originalObjective: string;
  aiReadyObjective: string;
  context: {
    education: Education;
    level: string;
    domain: string;
    assessment: string;
    voLevel?: VoLevel;
    voGrade?: number;
    vsoCluster?: VSOCluster;
  };
  createdAt: string;
  tags: string[];
}

/* ---------------------------- Component ---------------------------- */
function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LearningObjective>({
    original: "",
    context: { education: "", level: "", domain: "", assessment: "", voLevel: undefined, voGrade: undefined, vsoCluster: undefined },
  });
  const [lane, setLane] = useState<"" | Lane>(""); // Two-Lane keuze
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
  const levelKey: LevelKey = toLevelKey(formData.context);
  const [showEducationGuidance, setShowEducationGuidance] = useState(false);
  const [generationSource, setGenerationSource] = useState<GenerationSource>(null); // NIEUW: bron van de laatste generatie
  const [menuOpen, setMenuOpen] = useState(false);

  const handleExampleSelect = (example: LearningObjective) => {
    setFormData(example);
  };

  /* ---------- Hydrate bij laden (eerst URL, anders localStorage) ---------- */
  useEffect(() => {
    const fromUrl = decodeState<{
      currentStep: number;
      formData: LearningObjective;
      lane?: Lane;
      output: AIReadyOutput | null;
      aiStatement?: string;
      importedKD?: KDStructure | null;
      generationSource?: GenerationSource;
    }>(new URLSearchParams(window.location.search).get("data"));

    if (fromUrl) {
      setCurrentStep(fromUrl.currentStep ?? 1);
      setFormData(fromUrl.formData ?? formData);
      setLane(fromUrl.lane ?? "");
      const out = fromUrl.output
        ? attachSuggestions(fromUrl.output, fromUrl.formData?.context ?? formData.context)
        : null;
      setOutput(out);
      setAiStatement(fromUrl.aiStatement ?? "");
      setGenerationSource(fromUrl.generationSource ?? null);
      if (out) {
        setAiGoTags(
          inferAIGOTags(out.newObjective, {
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
          const out = attachSuggestions(
            saved.output,
            saved.formData?.context ?? formData.context,
          );
          setOutput(out);
          setAiGoTags(
            inferAIGOTags(out.newObjective, {
              withAI: saved.lane === "baan2",
              domain: saved.formData?.context?.domain,
            })
          );
        }
        if (typeof saved.currentStep === "number") setCurrentStep(saved.currentStep);
        if (saved.importedKD) setImportedKD(saved.importedKD);
        if (saved.aiStatement) setAiStatement(saved.aiStatement);
        if (saved.generationSource) setGenerationSource(saved.generationSource as GenerationSource);
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Autosave naar localStorage ---------------- */
  useEffect(() => {
    const state = { currentStep, formData, lane, output, aiStatement, importedKD, generationSource };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [currentStep, formData, lane, output, aiStatement, importedKD, generationSource]);

  const educationTypes: Education[] = [...EDUCATION_TYPES];
  const voLevels: VoLevel[] = [...VO_LEVELS];
  const levels = LEVEL_OPTIONS;
  const vsoClusters: VSOCluster[] = [...VSO_CLUSTERS];

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
    lane !== "" &&
    formData.original.trim() !== "" &&
    formData.context.education.trim() !== "" &&
    formData.context.domain.trim() !== "" &&
    (formData.context.education === "VO"
      ? Boolean(formData.context.voLevel && formData.context.voGrade)
      : formData.context.education === "VSO"
        ? formData.context.level.trim() !== "" && Boolean(formData.context.vsoCluster)
        : formData.context.level.trim() !== "");

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

    // Duidelijke console‑log per pad
    console.log(
      "[AI-check] Lane:", lane,
      "| Gemini beschikbaar?", geminiService.isAvailable()
    );

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
          { ...formData, lane: lane as Lane },
          kdContext
        );

        const adjusted: AIReadyOutput = attachSuggestions(
          {
            ...geminiResponse,
            newObjective:
              lane === "baan2"
                ? geminiResponse.newObjective
                : geminiResponse.newObjective
                    .replace(/met hulp van.*?,\s*/i, "")
                    .replace(/\bAI-?tools?\b/gi, "hulpmiddelen"),
          },
          formData.context,
        );

    if (formData.context.education === "VO" || formData.context.education === "VSO") {
      const repl = (txt: string) =>
        txt.replace(/studenten?/gi, (m) => (m.toLowerCase().endsWith("en") ? "leerlingen" : "leerling"));
      adjusted.newObjective = repl(adjusted.newObjective);
      adjusted.rationale = repl(adjusted.rationale);
      adjusted.activities = adjusted.activities.map(repl);
      adjusted.assessments = adjusted.assessments.map(repl);
      adjusted.aiLiteracy = repl(adjusted.aiLiteracy);
    }

        setOutput(adjusted);
        setGenerationSource("gemini");
        console.log("[AI-check] Gebruik: Gemini (AI)");

        setAiGoTags(
          inferAIGOTags(adjusted.newObjective, {
            withAI: lane === "baan2",
            domain: formData.context.domain,
          })
        );
      } else {
        const generatedObjective = generateAIReadyObjective(formData, lane as Lane);
        const aiOutput: AIReadyOutput = attachSuggestions(
          {
            newObjective: generatedObjective,
            rationale: generateRationale(formData),
            activities: generateActivities(formData, lane as Lane),
            assessments: generateAssessments(formData, lane as Lane),
            aiLiteracy: inferAIGOTags(generatedObjective, {
              withAI: lane === "baan2",
              domain: formData.context.domain,
            }).join(", ") || "kritisch denken, ethiek",
          },
          formData.context,
        );
        setOutput(aiOutput);
        setGenerationSource("fallback");
        console.log("[AI-check] Gebruik: fallback (geen Gemini)");

        setAiGoTags(
          inferAIGOTags(aiOutput.newObjective, {
            withAI: lane === "baan2",
            domain: formData.context.domain,
          })
        );
      }
      setCurrentStep(3);
    } catch (err) {
      console.error("[AI-check] Fout in AI-pad, val terug op fallback:", err);
      const fbObjective = generateAIReadyObjective(formData, lane as Lane);
      const fallback: AIReadyOutput = attachSuggestions(
        {
          newObjective: fbObjective,
          rationale: generateRationale(formData),
          activities: generateActivities(formData, lane as Lane),
          assessments: generateAssessments(formData, lane as Lane),
          aiLiteracy: inferAIGOTags(fbObjective, {
            withAI: lane === "baan2",
            domain: formData.context.domain,
          }).join(", ") || "kritisch denken, ethiek",
        },
        formData.context,
      );
      setOutput(fallback);
      setGenerationSource("fallback");

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
    const subject =
      data.context.education === "VO" || data.context.education === "VSO"
        ? "leerling"
        : "student";
    const originalObjective = data.original || "";
    const baseObjective = originalObjective.toLowerCase();
    const stripped = originalObjective.replace(new RegExp(`^De ${subject} kan `, "i"), "").toLowerCase();
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
      return `De ${subject} kan met hulp van ${equityTerms} ${stripped}, de output ${ethicsTerms}, en de uiteindelijke versie ${autonomyTerms} verbeteren met ${transparencyTerms} binnen de ${data.context.domain} context${kdContext}.`;
    } else if (baseObjective.includes("analyse") || baseObjective.includes("onderzoek") || baseObjective.includes("data")) {
      return `De ${subject} kan ${stripped} waarbij ${whichLane === "baan2" ? "AI-tools" : "hulpmiddelen"} helpen met data verzamelen, de resultaten ${ethicsTerms}, en ${autonomyTerms} conclusies trekken die eerlijk zijn binnen de ${data.context.domain}${kdContext}.`;
    } else if (baseObjective.includes("ontwerp") || baseObjective.includes("creëren") || baseObjective.includes("maken")) {
      return `De ${subject} kan ${stripped} met hulp van ${equityTerms} voor ideeën, de suggesties ${ethicsTerms}, en het eindresultaat ${autonomyTerms} maken met ${transparencyTerms} binnen de ${data.context.domain}${kdContext}.`;
    } else {
      return `De ${subject} kan ${stripped} met hulp van ${equityTerms}, de output ${ethicsTerms}, en ${autonomyTerms} tot een goede uitvoering komen met ${transparencyTerms} binnen de ${data.context.domain} context${kdContext}.`;
    }
  };

  const generateRationale = (data: LearningObjective): string => {
    const educationLevel = data.context.education;
    const domain = data.context.domain;
    const subjectPlural =
      data.context.education === "VO" || data.context.education === "VSO"
        ? "leerlingen"
        : "studenten";
    const subjectSingular =
      data.context.education === "VO" || data.context.education === "VSO"
        ? "leerling"
        : "student";
    let kdRationale = "";
    if (importedKD) {
      kdRationale = ` Deze aanpassing is gebaseerd op het kwalificatiedossier "${importedKD.metadata.title}" en past bij de competenties en werkprocessen.`;
    }
    return `Volgens de Nederlandse visie op AI en eerlijke kansen is het belangrijk dat ${educationLevel}-${subjectPlural} binnen ${domain} leren werken met technologie op een manier die eerlijke kansen biedt voor alle ${subjectPlural}. Deze aangepaste leeruitkomst zorgt ervoor dat ${subjectPlural} leren eerlijk te handelen, begrijpen hoe technologie werkt, en zelf beslissingen blijven nemen. De ${subjectSingular} ontwikkelt zowel vaardigheid als bewustzijn voor verantwoord gebruik.${kdRationale}`;
  };

  const generateActivities = (data: LearningObjective, whichLane: Lane): string[] => {
    const domain = data.context.domain.toLowerCase();
    const withAI = whichLane === "baan2";
    const subjectPlural =
      data.context.education === "VO" || data.context.education === "VSO"
        ? "leerlingen"
        : "studenten";
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
          `Koppel aan werkproces "${contextInfo.relatedWorkProcesses[0].title}" en geef alternatieven voor ${subjectPlural} zonder betaalde tools`
        );
      }
    }
    return base;
  };

  const generateAssessments = (data: LearningObjective, whichLane: Lane): string[] => {
    const withAI = whichLane === "baan2";
    const subject =
      data.context.education === "VO" || data.context.education === "VSO"
        ? "leerling"
        : "student";
    const assessments = [
      `Authentieke opdracht waarin de ${subject} het werkproces laat zien met ${withAI ? "transparant AI-gebruik" : "eigen uitvoering"} en verantwoording`,
      "Portfolio met kritische reflectie op kwaliteit en eerlijke kansen",
      "Mondelinge verificatie over keuzes en betrouwbaarheid van bronnen",
      "Peer-review op toegankelijkheid en inclusie",
    ];
    if (importedKD) {
      assessments.push("Beoordeling volgens KD-criteria, aangevuld met transparantie en inclusie");
    }
    return assessments;
  };

  const handleInputChange = (field: string, value: any) => {
    if (field === "original") {
      setFormData((prev) => ({ ...prev, original: value }));
    } else {
      setFormData((prev) => {
        const next = { ...prev, context: { ...prev.context, [field]: value } };
        if (field === "education") {
          next.context.level = "";
          next.context.voLevel = undefined;
          next.context.voGrade = undefined;
          next.context.vsoCluster = undefined;
        }
        if (field === "voLevel") {
          next.context.voGrade = undefined;
        }
        return next;
      });
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
    const o: AIReadyOutput = attachSuggestions(
      {
        newObjective: objective.aiReadyObjective,
        rationale: generateRationale({ original: objective.originalObjective, context: objective.context }),
        activities: generateActivities({ original: objective.originalObjective, context: objective.context }, lane as Lane),
        assessments: generateAssessments({ original: objective.originalObjective, context: objective.context }, lane as Lane),
        aiLiteracy: inferAIGOTags(objective.aiReadyObjective, {
          withAI: lane === "baan2",
          domain: objective.context.domain,
        }).join(", ") || "kritisch denken, ethiek",
      },
      objective.context,
    );
    setOutput(o);
    setGenerationSource(null); // onbekend voor oudere items
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
      suggestedActivities: output.suggestions.activities.map(
        (a) => `${a.title}: ${a.description}${a.duration ? ` (${a.duration})` : ''}`,
      ),
      suggestedAssessments: output.suggestions.assessments.map(
        (t) => `${t.title}: ${t.description}`,
      ),
      aiGoTags,
      aiStatement,
      generationSource,
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
    setGenerationSource(null);
  };

  /* ---------- Deelbare link + Print + AI-statement ---------- */
  const shareLink = () => {
    const payload = encodeState({ currentStep, formData, lane, output, aiStatement, importedKD, generationSource });
    const url = new URL(window.location.href);
    url.searchParams.set("data", payload);
    navigator.clipboard.writeText(url.toString());
    alert("Deelbare link gekopieerd!");
  };
  const printPdf = () => window.print();
  const buildAIStatement = () => {
    const withAI = lane === "baan2";
    const contextLine =
      formData.context.education === "VO"
        ? `${formData.context.education} – ${formData.context.voLevel} leerjaar ${formData.context.voGrade} – ${formData.context.domain}`
        : `${formData.context.education} – ${formData.context.level} – ${formData.context.domain}`;
    const txt = [
      "AI-statement",
      "",
      `Leerdoel/leeruitkomst: ${output?.newObjective ?? "(nog niet gegenereerd)"}`,
      `Context: ${contextLine}`,
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-4">
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
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                      AI Leerdoelengenerator
                    </h1>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Shield className="w-4 h-4 mr-1 text-green-600" />
                      Maak leeruitkomsten geschikt voor AI en eerlijke kansen (gratis tools)
                      {/* Altijd zichtbaar AI-statuslabel */}
                      <span
                        className={`text-xs font-semibold ml-2 ${
                          geminiService.isAvailable() ? "text-purple-600" : "text-gray-400"
                        }`}
                        title={geminiService.isAvailable() ? "Gemini actief" : "Fallback actief"}
                      >
                        {geminiService.isAvailable() ? "• AI actief (Gemini)" : "• AI uit (fallback)"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                {importedKD && (
                  <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <Database className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      {importedKD.metadata.title}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setShowTemplateLibrary(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white h-11 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Library className="w-4 h-4" />
                  <span>Voorbeelden</span>
                </button>

                <button
                  onClick={() => setShowSavedObjectives(true)}
                  className="flex items-center space-x-2 bg-gray-600 text-white h-11 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Opgeslagen</span>
                </button>

                <button
                  onClick={() => setShowKDImport(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white h-11 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Upload className="w-4 h-4" />
                  <span>KD Importeren</span>
                </button>

                <a
                  href="/begrippen"
                  className="flex items-center space-x-2 bg-gray-100 text-gray-800 h-11 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Begrippen</span>
                </a>
              </div>

              <button
                className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
              >
                <Menu className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </div>
          {menuOpen && (
            <div className="mt-4 flex flex-col space-y-2 md:hidden">
              {importedKD && (
                <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <Database className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {importedKD.metadata.title}
                  </span>
                </div>
              )}

              <button
                onClick={() => {
                  setShowTemplateLibrary(true);
                  setMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white h-11 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg w-full"
              >
                <Library className="w-4 h-4" />
                <span>Voorbeelden</span>
              </button>

              <button
                onClick={() => {
                  setShowSavedObjectives(true);
                  setMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-2 bg-gray-600 text-white h-11 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg w-full"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Opgeslagen</span>
              </button>

              <button
                onClick={() => {
                  setShowKDImport(true);
                  setMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white h-11 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg w-full"
              >
                <Upload className="w-4 h-4" />
                <span>KD Importeren</span>
              </button>

              <a
                href="/begrippen"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-800 h-11 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg w-full"
              >
                <BookOpen className="w-4 h-4" />
                <span>Begrippen</span>
              </a>
            </div>
          )}
        </div>
      </header>

      <Hero />
      <div id="form-start" className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Progress Steps */}
        <div>
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
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ExamplesPanel onSelectExample={handleExampleSelect} />
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Target className="w-5 h-5 text-green-600 mr-2" />
                  Origineel Leerdoel & Context
                </h2>

                <div className="space-y-6">
                  {/* Two-Lane keuze */}
                  <ObjectiveForm
                    lane={lane}
                    onLaneChange={setLane}
                    geminiAvailable={geminiService.isAvailable()}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Huidige leeruitkomst *
                    </label>
                    <textarea
                      value={formData.original}
                      onChange={(e) => handleInputChange("original", e.target.value)}
                      placeholder={`Bijvoorbeeld: De ${['VO','VSO'].includes(formData.context.education) ? 'leerling' : 'student'} kan een zakelijke e-mail schrijven in correct Nederlands.`}
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

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Niveau opleiding *
                        {formData.context.education === "VSO" && (
                          <InfoBox>
                            <p>
                              VSO: differentieer op leerroutes en werk handelingsgericht.
                            </p>
                          </InfoBox>
                        )}
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

                    {formData.context.education !== "VO" && (
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
                    )}
                  </div>

                  {formData.context.education === "VSO" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        VSO-cluster *
                      </label>
                      <select
                        value={formData.context.vsoCluster || ""}
                        onChange={(e) => handleInputChange("vsoCluster", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Kies cluster</option>
                        {vsoClusters.map((cluster) => (
                          <option key={cluster} value={cluster}>
                            {cluster}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formData.context.education === "VO" && (
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          VO-niveau *
                        </label>
                        <select
                          value={formData.context.voLevel || ""}
                          onChange={(e) => handleInputChange("voLevel", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Kies VO-niveau</option>
                          {voLevels.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Leerjaar *
                        </label>
                        <select
                          value={formData.context.voGrade ?? ""}
                          onChange={(e) => handleInputChange("voGrade", parseInt(e.target.value))}
                          disabled={!formData.context.voLevel}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50"
                        >
                          <option value="">Kies leerjaar</option>
                          {getVoGradeOptions(formData.context.voLevel).map((grade) => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="grid lg:grid-cols-2 gap-6">
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
                    className="w-full bg-gradient-to-r from-green-600 to-orange-500 text-white py-3.5 px-6 rounded-lg font-medium hover:from-green-700 hover:to-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                  >
                    Omzetten naar AI-ready onderwijs
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Examples Sidebar */}
            <div className="lg:col-span-1 space-y-6">
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
                  <p><strong>Eerlijke kansen:</strong> gratis en toegankelijke tools</p>
                  <p><strong>Vooroordelen herkennen:</strong> kwaliteit/bias check</p>
                  <p><strong>Transparant:</strong> AI-statement bij resultaat</p>
                  <p><strong>Ethiek:</strong> verantwoord en privacy-bewust</p>
                  <p><strong>Inclusie:</strong> alternatieven zonder betaalde tools</p>
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

            {/* Paneel-knoppen renderen zoals voorheen */}
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
                    <div className="mb-2"><LevelBadge levelKey={levelKey} /></div>
                    <p className="text-sm font-medium text-green-800 mb-2">AI-ready:</p>
                    <p className="text-green-700">{output.newObjective}</p>
                    <p className="text-xs text-gray-600 mt-2">
                      Context: {formData.context.education === "VO"
                        ? `${formData.context.voLevel} leerjaar ${formData.context.voGrade}`
                        : formData.context.level}
                      {' '}– {formData.context.domain}
                    </p>

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
                    {!feature.aiReadyGoalsV2 && (
                      <div className="mt-4">
                        <NiveauCheck levelKey={levelKey} objective={output.newObjective} />
                      </div>
                    )}

                    {/* BRON: duidelijk zichtbaar onder de leeruitkomst */}
                    <div className="mt-3 text-xs text-gray-500">
                      {generationSource === "gemini" && (
                        <span>Gegenereerd met <strong>Gemini (AI)</strong>.</span>
                      )}
                      {generationSource === "fallback" && (
                        <span><strong>Lokaal</strong> gegenereerd (geen AI-verbinding).</span>
                      )}
                      {generationSource === null && (
                        <span>Bron onbekend (bijv. geladen uit opgeslagen item).</span>
                      )}
                    </div>
                  </div>
                  <FeedbackBar />
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

            {output.suggestions && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <Suggestions data={output.suggestions} />
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-sm text-gray-600">
        <a href="/over" className="hover:underline">Transparantie & Verantwoording</a>
      </footer>

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
