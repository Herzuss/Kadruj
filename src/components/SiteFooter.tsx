import Link from 'next/link'

// Stopka widoczna na każdej stronie. Zasada UX: na dole user szuka
// "informacji o sklepie" — kontakt, regulamin, polityka prywatności.
// To buduje zaufanie (trust signals), kluczowe w e-commerce.
export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight">Kadruj</p>
          <p className="mt-2 max-w-xs text-sm text-neutral-500">
            Sklep z fotografią — wydruki, albumy, presety i zdjęcia stockowe.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Sklep</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-500">
            <li>
              <Link href="/produkty" className="hover:text-neutral-900">
                Produkty
              </Link>
            </li>
            <li>
              <Link href="/koszyk" className="hover:text-neutral-900">
                Koszyk
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Informacje</p>
          {/* href="#" = placeholdery; te podstrony zrobimy później */}
          <ul className="mt-3 space-y-2 text-sm text-neutral-500">
            <li>
              <Link href="#" className="hover:text-neutral-900">
                Kontakt
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-neutral-900">
                Regulamin
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-neutral-900">
                Polityka prywatności
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-200">
        <p className="mx-auto max-w-5xl px-6 py-6 text-xs text-neutral-400">
          © 2026 Kadruj. Projekt edukacyjny.
        </p>
      </div>
    </footer>
  )
}
