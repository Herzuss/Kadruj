// Wspólne formatowanie ceny. Cena w bazie jest w GROSZACH (integer, np. 12900),
// więc dzielimy przez 100 i pokazujemy jako polską walutę → "129,00 zł".
// Trzymanie tego w jednym miejscu = jedna zmiana, gdy np. dojdzie inna waluta.
export function formatPrice(grosze: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(grosze / 100)
}
