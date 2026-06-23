import { getPayload } from 'payload'
import config from '@/payload.config'
import './styles.css'
import ProductCard from '@/components/ProductCard'

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
            <li key={product.id} >
            <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
