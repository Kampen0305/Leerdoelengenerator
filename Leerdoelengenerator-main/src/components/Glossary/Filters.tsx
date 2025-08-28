'use client';
import { GlossaryCategory } from '@/types/glossary';

const letters = ['Alle',...Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ')];
const categories: (GlossaryCategory|'Alle')[] = [
  'Alle','AI & Geletterdheid','Toetsing & Examinering','Kaders & Wetgeving',
  'Didactiek & Curriculum','Datagebruik & Privacy','Onderwijsniveaus'
];

export default function Filters({
  q, letter, category, onChange
}: {
  q: string; letter: string; category: (GlossaryCategory|'Alle');
  onChange: (v:{q?:string;letter?:string;category?:(GlossaryCategory|'Alle')})=>void;
}) {
  return (
    <div className="space-y-3">
      <input
        aria-label="Zoeken in begrippen"
        className="w-full border rounded-xl px-3 py-2"
        placeholder="Zoek op term, betekenis of synoniem…"
        value={q}
        onChange={e=>onChange({q:e.target.value})}
      />
      <div className="flex flex-wrap gap-2">
        {letters.map(l=>(
          <button key={l}
            className={`px-2 py-1 rounded-full text-sm border ${letter===l?'bg-black text-white':'bg-white'}`}
            onClick={()=>onChange({letter:l})}
            aria-pressed={letter===l}
          >{l}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(c=>(
          <button key={c}
            className={`px-3 py-1 rounded-full text-sm border ${category===c?'bg-black text-white':'bg-white'}`}
            onClick={()=>onChange({category:c})}
            aria-pressed={category===c}
          >{c}</button>
        ))}
      </div>
    </div>
  );
}
