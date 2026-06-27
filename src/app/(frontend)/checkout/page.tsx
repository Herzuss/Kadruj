'use client'

import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useCart } from '@/providers/cart-context'
import { formatPrice } from '@/lib/format'
import { CheckoutForm } from '@/components/CheckoutForm'
import { createPaymentIntent } from './actions'

// loadStripe POZA komponentem — Stripe.js ma się załadować RAZ na całą stronę,
// nie przy każdym renderze. Czyta publishable key (NEXT_PUBLIC_, więc dostępny w przeglądarce).
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { items } = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  // Po wczytaniu koszyka → poproś serwer o PaymentIntent i odbierz client_secret.
  useEffect(() => {
    if (items.length === 0) return
    createPaymentIntent(items.map((i) => ({ id: i.id, quantity: i.quantity })))
      .then((res) => {
        setClientSecret(res.clientSecret)
        setTotal(res.total)
      })
      .catch((e) => console.error('Błąd tworzenia płatności:', e))
  }, [items])

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Płatność</h1>
        <p className="mt-4 text-neutral-500">Koszyk jest pusty.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Płatność</h1>

      {clientSecret ? (
        <>
          <p className="mt-2 text-neutral-500">Do zapłaty: {formatPrice(total)}</p>
          <div className="mt-8">
            {/* <Elements> dostarcza kontekst Stripe + client_secret całemu formularzowi */}
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm />
            </Elements>
          </div>
        </>
      ) : (
        <p className="mt-8 text-sm text-neutral-500">Ładowanie płatności…</p>
      )}
    </div>
  )
}
