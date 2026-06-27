'use client'

import { useState, type SyntheticEvent } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Sam formularz płatności. Renderowany WEWNĄTRZ <Elements> (patrz checkout/page.tsx),
// dzięki czemu useStripe()/useElements() mają dostęp do kontekstu Stripe.
export function CheckoutForm() {
  const stripe = useStripe() // instancja Stripe.js (null dopóki się ładuje)
  const elements = useElements() // kontener pól Stripe (PaymentElement)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()
    if (!stripe || !elements) return // Stripe.js jeszcze nie gotowy — nic nie rób

    setLoading(true)
    setError(null)

    // confirmPayment finalizuje płatność. Przy sukcesie Stripe PRZEKIERUJE
    // na return_url. Do kodu poniżej docieramy tylko przy błędzie.
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/zamowienie/sukces`,
      },
    })

    if (error) {
      setError(error.message ?? 'Coś poszło nie tak z płatnością.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* PaymentElement = gotowe, bezpieczne pole karty (i innych metod) od Stripe */}
      <PaymentElement />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-lg bg-neutral-900 px-5 py-3 font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50"
      >
        {loading ? 'Przetwarzanie…' : 'Zapłać'}
      </button>
    </form>
  )
}
