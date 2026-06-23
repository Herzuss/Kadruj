'use client'

// Strona koszyka jest klientem — czyta i zmienia żywy stan z useCart().
import Link from 'next/link'
import { useCart } from '@/providers/cart-context'
import { formatPrice } from '@/lib/format'

export default function CartPage() {
  const { items, removeItem, setQty, clear, totalGrosze } = useCart()

  // Stan pusty — zanim cokolwiek dodasz.
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Koszyk</h1>
        <p className="mt-4 text-neutral-500">
          Koszyk jest pusty.{' '}
          <Link href="/" className="underline">
            Wróć do sklepu
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Koszyk</h1>

      <ul className="mt-8 divide-y divide-neutral-200">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-4">
            <div className="flex-1">
              <Link
                href={`/produkty/${item.slug}`}
                className="font-medium hover:underline"
              >
                {item.title}
              </Link>
              <p className="text-sm text-neutral-500">{formatPrice(item.price)} / szt.</p>
            </div>

            {/* Sterowanie ilością. Produkt cyfrowy zawsze 1 — więc dla niego
                chowamy przyciski +/- (kupujesz go raz). */}
            {item.type === 'digital' ? (
              <span className="text-sm text-neutral-500">1 szt.</span>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQty(item.id, item.quantity - 1)}
                  className="h-7 w-7 rounded border border-neutral-300 hover:bg-neutral-100"
                  aria-label="Zmniejsz ilość"
                >
                  −
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => setQty(item.id, item.quantity + 1)}
                  className="h-7 w-7 rounded border border-neutral-300 hover:bg-neutral-100"
                  aria-label="Zwiększ ilość"
                >
                  +
                </button>
              </div>
            )}

            {/* Cena tej pozycji = cena × ilość */}
            <span className="w-24 text-right font-medium">
              {formatPrice(item.price * item.quantity)}
            </span>

            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-sm text-neutral-400 hover:text-red-600"
              aria-label="Usuń z koszyka"
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-6">
        <button
          type="button"
          onClick={clear}
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          Wyczyść koszyk
        </button>
        <div className="text-right">
          <p className="text-sm text-neutral-500">Razem</p>
          <p className="text-2xl font-semibold">{formatPrice(totalGrosze)}</p>
        </div>
      </div>

      {/* Placeholder — płatność podłączymy w kroku 6 (Stripe). */}
      <button
        type="button"
        className="mt-8 w-full rounded-lg bg-neutral-900 px-5 py-3 font-medium text-white transition hover:bg-neutral-700"
      >
        Przejdź do płatności
      </button>
    </div>
  )
}
