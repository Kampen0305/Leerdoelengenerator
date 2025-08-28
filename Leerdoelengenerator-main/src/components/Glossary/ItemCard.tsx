'use client';
import { GlossaryItem } from '@/types/glossary';

export default function ItemCard({item}:{item:GlossaryItem}) {
  const link = `#${item.id}`;
  const copy = async () => {
    await navigator.clipboard.writeText(window.location.origin + '/begrippen' + link);
  };
  return (
    <article id={item.id} className="rounded-2xl border p-4 scroll-mt-24">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{item.term}</h3>
        <div className="flex gap-2">
          <a href={link} aria-label="Deeplink naar begrip" className="text-sm underline">#</a>
          <button onClick={copy} className="text-sm underline">Kopieer link</button>
        </div>
      </div>
      <p className="mt-2">{item.definition}</p>
      <div className="mt-3 text-xs opacity-70">
        <span className="mr-3">Categorie: {item.category}</span>
        {item.alsoKnownAs?.length ? <span>Ook: {item.alsoKnownAs.join(', ')}</span> : null}
      </div>
      {item.seeAlso?.length ? (
        <div className="mt-2 text-sm">
          Zie ook: {item.seeAlso.map(id=>(
            <a key={id} className="underline mr-2" href={`#${id}`}>{id}</a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
