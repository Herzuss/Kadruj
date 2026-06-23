// Zamiana tekstu na slug bezpieczny do URL-a, z obsługą polskich znaków.
// Bez transliteracji "mgła" → "mga" (ł wycięte). Z nią → "mgla". Ważne dla SEO.
const PL_MAP: Record<string, string> = {
  ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[ąćęłńóśźż]/g, (znak) => PL_MAP[znak] ?? znak) // ł→l, ó→o, ...
    .replace(/\s+/g, '-') // spacje → myślniki
    .replace(/[^a-z0-9-]/g, '') // wytnij resztę znaków spoza a-z,0-9,-
    .replace(/-+/g, '-') // zwiń wielokrotne myślniki w jeden
    .replace(/^-+|-+$/g, '') // utnij myślniki z początku/końca
}
