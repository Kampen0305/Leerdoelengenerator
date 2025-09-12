export async function llmGenerate(prompt: string): Promise<{ text: string }> {
  // Placeholder for LLM integration
  const match = prompt.match(/Niveau:\s*(PO|SO|VSO|MBO|HBO|WO)/);
  const level = match ? match[1] : 'PO';
  return { text: `Niveau: ${level}\nGenereer: ${prompt}` };
}
