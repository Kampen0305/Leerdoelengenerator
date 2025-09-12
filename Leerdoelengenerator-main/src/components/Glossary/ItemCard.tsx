'use client';
import type { Begrip } from '@/types/glossary';

export default function ItemCard({item}:{item:Begrip}) {
  const link = `#${item.slug}`;
  const copy = async () => {
    await navigator.clipboard.writeText(window.location.origin + '/begrippen' + link);
  };
  return (
    <article id={item.slug} className="rounded-2xl border p-4 scroll-mt-24">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{item.titel}</h3>
        <div className="flex gap-2">
          <a href={link} aria-label="Deeplink naar begrip" className="text-sm underline">#</a>
          <button onClick={copy} className="text-sm underline">Kopieer link</button>
        </div>
      </div>
      <p className="mt-2">{item.definitie}</p>
      <div className="mt-3 text-xs opacity-70">
        <span className="mr-3">Categorie: {item.categorie}</span>
      </div>
      {item.zieOok?.length ? (
        <div className="mt-2 text-sm">
          Zie ook: {item.zieOok.map(id=> (
            <a key={id} className="underline mr-2" href={`#${id}`}>{id}</a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
