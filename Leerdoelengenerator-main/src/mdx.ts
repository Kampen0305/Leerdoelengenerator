import remarkGlossary from '@/lib/remark-glossary';

export const mdxOptions = {
  remarkPlugins: [
    // ...andere plugins
    process.env.GLOSSARY_INLINE === 'true' ? remarkGlossary : null,
  ].filter(Boolean),
};
