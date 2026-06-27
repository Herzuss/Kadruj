'use client'

import { useState, type SyntheticEvent } from 'react'
import { PaymentElement, AddressElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Sam formularz płatności. Renderowany WEWNĄTRZ <Elements> (patrz checkout/page.tsx),
// dzięki czemu useStripe()/useElements() mają dostęp do kontekstu Stripe.
export function CheckoutForm({ hasPhysical }: { hasPhysical: boolean }) {
  const stripe = useStripe() // instancja Stripe.js (null dopóki się ładuje)
  const elements = useElements() // kontener pól Stripe (PaymentElement)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

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
        receipt_email: email,
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
      <input
        type="email"
        required
        placeholder="Twój e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none transition focus:border-neutral-900"
      />
      {hasPhysical && <AddressElement options={{ mode: 'shipping' }} />}
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
