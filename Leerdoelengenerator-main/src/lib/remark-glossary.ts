import { visit } from 'unist-util-visit';
import { getAllBegrippen } from '@/lib/glossary';

// maak snelle lookup op titel (case-insensitive)
const terms = getAllBegrippen().map(b => b.titel);
const regex = new RegExp(`\\b(${terms.map(t => t.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')).join('|')})\\b`, 'i');

export default function remarkGlossary() {
  return (tree: any) => {
    const seen = new Set<string>();
    visit(tree, 'text', (node: any, index: number, parent: any) => {
      if (!node.value) return;
      const m = node.value.match(regex);
      if (!m) return;
      const term = m[1];
      const key = term.toLowerCase();
      if (seen.has(key)) return; // alleen eerste voorkomen
      seen.add(key);

      const before = node.value.slice(0, m.index);
      const after = node.value.slice(m.index! + term.length);

      parent.children.splice(index, 1,
        before ? { type: 'text', value: before } : null,
        {
          type: 'mdxJsxTextElement',
          name: 'GlossaryTooltip',
          attributes: [{ type: 'mdxJsxAttribute', name: 'term', value: term }],
          children: [{ type: 'text', value: term }]
        },
        after ? { type: 'text', value: after } : null
      ).filter(Boolean);
    });
  };
}
