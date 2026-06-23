import { getPayload } from 'payload'
import Link from 'next/link'
import config from '@/payload.config'
import ProductCard from '@/components/ProductCard'
import './styles.css'

// Server Component — pobiera dane na serwerze przez Local API.
export default async function HomePage() {
  const payload = await getPayload({ config: await config })

  // Na home pokazujemy tylko KILKA produktów (limit: 6) jako "wybrane".
  // Pełna lista jest na /produkty — zasada UX: nie przytłaczaj na wejściu.
  const { docs: products } = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 3,
    where: { featured: { equals: true } }
  })

  return (
    <>
      {/* === HERO ===
          4 elementy w pionie: nadlinia → nagłówek → podtekst → JEDEN główny CTA.
          Dużo białej przestrzeni (py-24/32) + wyśrodkowanie = styl galerii. */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
          Sklep z fotografią
        </p>
        <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Dobre kadry zasługują na więcej niż ekran.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-600">
          Wydruki i albumy fine-art, presety do Lightrooma i pakiety zdjęć
          stockowych — wszystko w jednym miejscu.
        </p>
        <div className="mt-8 flex items-center justify-center gap-5">
          {/* Główny CTA — jeden, mocny, kontrastowy. */}
          <Link
            href="/produkty"
            className="rounded-full bg-neutral-900 px-7 py-3 font-medium text-white transition hover:bg-neutral-700"
          >
            Zobacz produkty
          </Link>
          {/* Drugorzędny — cichy link, nie konkuruje z głównym CTA. */}
          <Link
            href="#produkty"
            className="text-sm font-medium text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline"
          >
            Co sprzedajemy?
          </Link>
        </div>
      </section>

      {/* === WYBRANE PRODUKTY === */}
      <section id="produkty" className="mx-auto max-w-5xl px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Wybrane produkty</h2>
          <Link href="/produkty" className="text-sm text-neutral-500 hover:text-neutral-900">
            Zobacz wszystkie →
          </Link>
        </div>

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
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* === NEWSLETTER ===
          Ciemna sekcja kontrastuje z resztą = przyciąga wzrok. Łapanie maili
          za rabat to standard e-commerce. (Formularz na razie wizualny —
          podłączymy wysyłkę później.) */}
      <section className="mt-20 bg-neutral-900 text-white">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-16 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold">Zapisz się i odbierz −10%</h2>
            <p className="mt-2 text-neutral-300">
              Rabat na pierwsze zamówienie. Bez spamu — obiecujemy.
            </p>
          </div>
          <form className="space-y-3">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Twój e-mail"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-400 focus:border-white focus:outline-none"
              />
              <button
                type="button"
                className="shrink-0 rounded-lg bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
              >
                Zapisz się
              </button>
            </div>
            {/* Zgoda RODO — wymagana przy zapisie na newsletter w PL/UE. */}
            <label className="flex gap-2 text-xs text-neutral-400">
              <input type="checkbox" className="mt-0.5" />
              <span>
                Zgadzam się na przetwarzanie moich danych w celu otrzymywania
                newslettera (RODO).
              </span>
            </label>
          </form>
        </div>
      </section>
    </>
  )
}
