import React from 'react';
import type { Sector } from '@/types';
import { getSupportModel } from '@/services/supportRouting';

type Props = {
  sector: Sector;
};

export default function SupportPanel({ sector }: Props) {
  const model = getSupportModel(sector);

  if (model.mode === 'FUNDEREND') {
    return (
      <section aria-labelledby="slo-support-title" className="rounded-2xl border p-4 md:p-6 shadow-sm bg-white">
        <h2 id="slo-support-title" className="text-xl font-semibold">
          Ondersteuning voor docenten (SLO-kerndoelen)
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Dit blok helpt je om opdrachten, leeractiviteiten en formatieve checks te koppelen aan de actuele kerndoelen (Burgerschap & Digitale geletterdheid).
        </p>
        <ul className="mt-4 space-y-3">
          {model.slo.map((item) => (
            <li key={item.id} className="rounded-lg border p-3">
              <h3 className="font-medium">{item.titel}</h3>
              {item.beschrijving && <p className="mt-1 text-sm text-gray-700">{item.beschrijving}</p>}
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {item.leergebied === 'DG' ? 'Digitale geletterdheid' : 'Burgerschap'}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-xs text-gray-500">
          Let op: voor funderend onderwijs tonen we geen Npuls-handreikingen in dit scherm; focus ligt hier op kerndoelen.
        </div>
      </section>
    );
  }

  // Beroeps/HO
  return (
    <section aria-labelledby="npuls-support-title" className="rounded-2xl border p-4 md:p-6 shadow-sm bg-white">
      <h2 id="npuls-support-title" className="text-xl font-semibold">
        Handreikingen & Visie (Npuls)
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Richtlijnendocumenten voor toetsing/examinering en verantwoord gebruik van studiedata & AI in MBO/HBO/WO.
      </p>
      <ul className="mt-4 space-y-3">
        {model.handreikingen.map((doc) => (
          <li key={doc.id} className="rounded-lg border p-3">
            <a href={doc.url} target="_blank" rel="noreferrer" className="font-medium underline">
              {doc.titel}
            </a>
            <div className="mt-1">
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">{doc.type}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
