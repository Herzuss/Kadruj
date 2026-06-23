import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { formatPrice } from '@/lib/format'
import './styles.css'

// To jest Server Component (funkcja async). Wykonuje się na serwerze, więc
// może sięgnąć bezpośrednio do bazy przez Local API — bez fetcha, bez HTTP.
export default async function HomePage() {
  const payload = await getPayload({ config: await config })

  // payload.find = "daj rekordy z kolekcji". depth: 1 rozwija relacje
  // (category staje się obiektem, nie samym ID). limit: ile maksymalnie.
  const { docs: products } = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 12,
  })

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">Kadruj</h1>
        <p className="mt-2 text-neutral-500">
          Wydruki, albumy, presety i zdjęcia stockowe.
        </p>
      </header>

      {/* Stan pusty — gdyby ktoś nie dodał jeszcze produktów */}
      {products.length === 0 ? (
        <p className="text-neutral-500">
          Brak produktów. Dodaj je w panelu{' '}
          <a href="/admin" className="underline">
            /admin
          </a>
          .
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              {/* Link Nexta = nawigacja bez przeładowania strony. href budujemy
                  ze sluga produktu → /produkty/wydruk-mgla-... */}
              <Link
                href={`/produkty/${product.slug}`}
                className="block h-full rounded-xl border border-neutral-200 p-5 transition hover:border-neutral-400"
              >
                {/* Plakietka typu — wprost z pola `type`. To wizualnie pokazuje
                    różnicę, którą później wykorzystamy w checkout. */}
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    product.type === 'digital'
                      ? 'bg-violet-100 text-violet-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {product.type === 'digital' ? 'Cyfrowy' : 'Fizyczny'}
                </span>

                <h2 className="mt-3 text-lg font-medium">{product.title}</h2>
                <p className="mt-1 text-xl font-semibold">
                  {formatPrice(product.price)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
