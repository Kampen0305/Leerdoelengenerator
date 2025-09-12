import { useId, useState } from 'react';
import { getBegripMap } from '@/lib/glossary';

type Props = { term: string; children?: React.ReactNode };

export default function GlossaryTooltip({ term, children }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const begrippen = getBegripMap();
  const key = term.toLowerCase();
  const b = begrippen[key];

  if (!b) return <>{children ?? term}</>;

  return (
    <span className="relative inline-block">
      <button
        type="button"
        className="underline decoration-dotted underline-offset-2"
        aria-describedby={id}
        onClick={() => setOpen(o => !o)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
      >
        {children ?? b.titel}
      </button>
      {open && (
        <div
          id={id}
          role="tooltip"
          className="absolute z-20 mt-2 w-80 max-w-[90vw] rounded-2xl border bg-background p-4 shadow-xl"
        >
          <div className="text-sm font-semibold">{b.titel}</div>
          <p className="mt-1 text-sm leading-snug">{b.definitie}</p>
          {b.zieOok?.length ? (
            <div className="mt-2 text-xs opacity-80">
              <span className="font-medium">Zie ook: </span>
              {b.zieOok.map((z, i) => (
                <a key={z} href={`/begrippen#${z}`} className="hover:underline">
                  {z.replaceAll('-', ' ')}{i < b.zieOok!.length - 1 ? ', ' : ''}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </span>
  );
}
