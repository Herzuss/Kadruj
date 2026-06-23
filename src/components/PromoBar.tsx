// Pasek promocyjny na samej górze strony. Zasada UX: komunikuj wartość
// (próg darmowej wysyłki) zanim user zacznie scrollować — podbija koszyk.
export function PromoBar() {
  return (
    <div className="bg-neutral-900 text-white">
      <p className="mx-auto max-w-5xl px-6 py-2.5 text-center text-xs font-medium tracking-wide">
        Darmowa wysyłka wydruków od 200 zł
      </p>
    </div>
  )
}
