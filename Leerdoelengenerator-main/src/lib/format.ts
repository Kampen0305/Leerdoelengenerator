export function enforceDutchAndSMART(input: string): string {
  let result = input.trim();
  if (!result.toLowerCase().startsWith("de student kan")) {
    const lower = result.charAt(0).toLowerCase() + result.slice(1);
    result = `De student kan ${lower}`;
  }
  if (!result.endsWith('.')) {
    result = result + '.';
  }
  return result;
}
