'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/providers/cart-context'

// Nagłówek widoczny na każdej stronie. Pokazuje licznik koszyka (useCart)
// i — na mobile — rozwijane menu (useState). Dlatego jest klientem.
export function SiteHeader({ customerName }: { customerName: string | null }) {
  const { count } = useCart()
  const [open, setOpen] = useState(false) // czy menu mobilne jest rozwinięte

  // Linki nawigacji w JEDNYM miejscu — używane i w desktopie (rząd), i w mobile
  // (kolumna). onClick zamyka menu po kliknięciu (na mobile; na desktopie nieszkodliwe).
  const navLinks = (
    <>
      <Link href="/produkty" className="hover:text-neutral-900" onClick={() => setOpen(false)}>
        Produkty
      </Link>
      <Link href="#" className="hover:text-neutral-900" onClick={() => setOpen(false)}>
        Kontakt
      </Link>
      {customerName ? (
        <Link href="/konto" className="hover:text-neutral-900" onClick={() => setOpen(false)}>
          Konto
        </Link>
      ) : (
        <Link href="/logowanie" className="hover:text-neutral-900" onClick={() => setOpen(false)}>
          Zaloguj
        </Link>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
          Kadruj
        </Link>

        {/* Desktop nav — widoczne od sm w górę (hidden + sm:flex) */}
        <nav className="hidden gap-8 text-sm font-medium text-neutral-600 sm:flex">{navLinks}</nav>

        <div className="flex items-center gap-4">
          <Link href="/koszyk" className="relative text-sm font-medium hover:text-neutral-600">
            Koszyk
            {count > 0 && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1.5 text-xs text-white">
                {count}
              </span>
            )}
          </Link>

          {/* Hamburger — TYLKO na mobile (sm:hidden). Przełącza `open`. */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="text-neutral-700 sm:hidden"
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                // ikona X gdy otwarte
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                // trzy kreski gdy zamknięte
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Panel mobilny — renderowany tylko gdy `open`, i tylko na mobile (sm:hidden) */}
      {open && (
        <nav className="flex flex-col gap-3 border-t border-neutral-200 px-6 py-4 text-sm font-medium text-neutral-600 sm:hidden">
          {navLinks}
        </nav>
      )}
    </header>
  )
}
