'use client';
import { useMemo, useState, useEffect } from 'react';
import Filters from './Filters';
import ItemCard from './ItemCard';
import { filterGlossary } from '@/lib/searchGlossary';
import type { BegripCategorie } from '@/types/glossary';
import EmptyState from '@/components/EmptyState';

export default function GlossaryList() {
  const [q,setQ]=useState('');
  const [letter,setLetter]=useState('Alle');
  const [category,setCategory]=useState<BegripCategorie|'Alle'>('Alle');

  // Scroll naar hash bij laden
  useEffect(()=>{
    if (window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView({behavior:'smooth', block:'start'});
    }
  },[]);

  const items = useMemo(()=>filterGlossary({q,letter,category}),[q,letter,category]);

  return (
    <div className="space-y-6">
      <Filters q={q} letter={letter} category={category}
        onChange={({q,letter,category})=>{
          if(q!==undefined) setQ(q);
          if(letter!==undefined) setLetter(letter);
          if(category!==undefined) setCategory(category);
        }}
      />
      {items.length===0 ? (
        <EmptyState>
          Geen resultaten. Probeer een andere zoekterm of filter.
        </EmptyState>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(it => <ItemCard key={it.slug} item={it}/>)}
        </div>
      )}
    </div>
  );
}
