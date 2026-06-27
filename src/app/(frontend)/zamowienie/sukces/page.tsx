'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/providers/cart-context'

// Strona, na którą Stripe przekierowuje po udanej płatności (return_url).
// UWAGA: to NIE tutaj tworzymy zamówienie — robi to webhook (źródło prawdy).
// Tu tylko dziękujemy i czyścimy koszyk.
export default function SukcesPage() {
  const { clear } = useCart()

  // Po udanej płatności opróżnij koszyk (raz, po wejściu na stronę).
  useEffect(() => {
    clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Dziękujemy! 🎉</h1>
      <p className="mt-4 text-neutral-500">
        Płatność przyjęta. Zamówienie jest w realizacji — potwierdzenie wyślemy na e-mail.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-neutral-900 px-6 py-3 font-medium text-white transition hover:bg-neutral-700"
      >
        Wróć do sklepu
      </Link>
    </div>
  )
}
