import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { formatPrice } from '@/lib/format'
import { AddToCartButton } from '@/components/AddToCartButton'
import '../../styles.css'

// Pomocnik: pobiera JEDEN produkt po slugu. Używamy go i w metadanych,
// i w samej stronie — więc wyciągamy do osobnej funkcji, żeby nie pisać dwa razy.
async function getProductBySlug(slug: string) {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } }, // filtr: slug === ten z URL-a
    depth: 1, // rozwiń relację category do obiektu
    limit: 1,
  })
  return docs[0] ?? null // find zwraca tablicę; bierzemy pierwszy albo null
}

// W Next 15/16 `params` jest PROMISEM — trzeba go awaitować.
type Props = { params: Promise<{ slug: string }> }

// generateMetadata = dynamiczny <title>/<meta> per produkt. Dobre dla SEO:
// każda strona produktu ma własny tytuł zamiast wspólnego "Kadruj".
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Nie znaleziono — Kadruj' }
  return {
    title: `${product.title} — Kadruj`,
    description: `Kup ${product.title} w sklepie Kadruj.`,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  // Brak produktu o tym slugu → 404. notFound() przerywa render i pokazuje
  // stronę "nie znaleziono" Nexta. Zawsze warto obsłużyć zły URL.
  if (!product) notFound()

  // Przy depth:1 `category` jest obiektem, ale typ TS dopuszcza też samo ID
  // (number) — dlatego sprawdzamy, czy to obiekt, zanim sięgniemy po .name.
  const categoryName =
    typeof product.category === 'object' && product.category
      ? product.category.name
      : null

  const isDigital = product.type === 'digital'

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← Wróć do sklepu
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isDigital ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {isDigital ? 'Cyfrowy' : 'Fizyczny'}
        </span>
        {categoryName && (
          <span className="text-sm text-neutral-500">{categoryName}</span>
        )}
      </div>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{product.title}</h1>
      <p className="mt-2 text-2xl font-semibold">{formatPrice(product.price)}</p>

      {/* Opis z edytora lexical. RichText zamienia JSON z bazy na HTML.
          Renderujemy tylko gdy opis istnieje. */}
      {product.description && (
        <div className="mt-6 leading-relaxed text-neutral-700">
          <RichText data={product.description} />
        </div>
      )}

      {/* Tu widać CAŁY sens pola `type`: ta sama strona, dwa różne komunikaty.
          To samo rozgałęzienie wróci w checkout (krok 6). */}
      <div className="mt-6 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-600">
        {isDigital ? (
          <p>📥 Produkt cyfrowy — link do pobrania dostaniesz po zakupie. Bez wysyłki.</p>
        ) : (
          <p>
            📦 Wysyłka kurierem.{' '}
            {typeof product.stock === 'number' && product.stock > 0
              ? `Dostępny (${product.stock} szt.)`
              : 'Chwilowo niedostępny'}
          </p>
        )}
      </div>

      {/* Server Component przekazuje dane produktu do klienckiego przycisku,
          który dokłada je do koszyka. */}
      <AddToCartButton
        product={{
          id: product.id,
          slug: product.slug,
          title: product.title,
          price: product.price,
          type: product.type,
        }}
      />
    </div>
  )
}
