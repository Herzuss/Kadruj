import type { Product } from '@/payload-types'
import Link from 'next/link'
import { formatPrice } from '@/lib/format'

export default function ProductCard({ product }: { product: Product }) {
  const isDigital = product.type === 'digital'

  return (
    <Link
      href={`/produkty/${product.slug}`}
      // group + overflow-hidden: zaokrąglone rogi obejmują też obszar zdjęcia.
      // hover na ramce daje subtelny feedback "to jest klikalne".
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 transition hover:border-neutral-400"
    >
      {/* Obszar zdjęcia. aspect-square = kwadrat skalujący się z szerokością karty.
          Na razie placeholder — zastąpi go <Image> w kroku 7 (Uploadthing). */}
      <div className="flex aspect-square items-center justify-center bg-neutral-100 text-sm text-neutral-400">
        Zdjęcie wkrótce
      </div>

      {/* flex-1: treść rozciąga się, więc ceny w rzędzie kart są wyrównane,
          nawet gdy tytuły mają różną długość. */}
      <div className="flex flex-1 flex-col p-4">
        {/* w-fit: pigułka obejmuje tylko swój tekst, nie całą szerokość */}
        <span
          className={`mb-2 inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isDigital ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {isDigital ? 'Cyfrowy' : 'Fizyczny'}
        </span>

        {/* h3 — bo h1 to tytuł strony, h2 to nagłówek sekcji ("Wybrane produkty") */}
        <h3 className="font-medium leading-snug">{product.title}</h3>
        <p className="mt-2 text-lg font-semibold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
