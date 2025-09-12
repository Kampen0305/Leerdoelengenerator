import { LevelCluster } from "@/lib/basis";
import { toast } from "@/components/useToast";

type SectorState = {
  PO?: boolean; SO?: boolean; VO?: boolean; VSO?: boolean;
  MBO?: boolean; HBO?: boolean; WO?: boolean;
};

function deriveLevelCluster(s: SectorState): LevelCluster {
  const funderend = !!(s.PO || s.SO || s.VO || s.VSO);
  const mbo = !!s.MBO;
  const hbo = !!s.HBO;
  const wo  = !!s.WO;

  const vervolgCount = [mbo, hbo, wo].filter(Boolean).length;

  // 1) Blokkeer combi’s
  if ((funderend && vervolgCount > 0) || vervolgCount > 1) {
    throw new Error(
      "Kies óf funderend (PO/SO/VO/VSO) óf één vervolgonderwijsniveau (MBO/HBO/WO)."
    );
  }
  // 2) Bepaal cluster
  if (funderend) return LevelCluster.FUNDEREND;
  if (mbo) return LevelCluster.MBO;
  if (hbo) return LevelCluster.HBO;
  if (wo)  return LevelCluster.WO;

  throw new Error("Geen onderwijsniveau geselecteerd.");
}

export async function submitGenerator(form: {
  sector: SectorState;
  // … overige velden (leeruitkomst, context, etc.)
}) {
  let level: LevelCluster;
  try {
    level = deriveLevelCluster(form.sector);
  } catch (err) {
    toast((err as Error).message);
    throw err;
  }

  const res = await fetch("/api/generate/objectives", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      level,
      // … overige velden
    }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Genereren mislukt.");
  }
  return (await res.json()) as {
    basisLabel: string;
    content: string;
    meta: { level: LevelCluster; basis: string };
  };
}

export { deriveLevelCluster };
