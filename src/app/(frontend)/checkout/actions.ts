'use server'

// 'use server' = ten plik zawiera Server Actions — funkcje, które wywołasz
// z klienta, ale wykonują się NA SERWERZE (mają dostęp do secret key, bazy itd.).

import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { stripe } from '@/lib/stripe'

// Klient przekazuje TYLKO id + ilość. Cenę i sumę liczymy z bazy — żeby nikt
// nie podmienił kwoty w przeglądarce (klasyczna luka sklepów).
export async function createPaymentIntent(cartItems: { id: number; quantity: number }[]) {
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Koszyk jest pusty')
  }

  const payload = await getPayload({ config: await config })

  // Pobierz prawdziwe produkty po id z koszyka.
  const ids = cartItems.map((i) => i.id)
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { id: { in: ids } },
    limit: 100,
  })

  // Policz sumę W GROSZACH po stronie serwera (cena z bazy, nie z klienta).
  let total = 0
  for (const item of cartItems) {
    const product = products.find((p) => p.id === item.id)
    if (!product) throw new Error('Produkt nie istnieje: ' + item.id)
    total += product.price * item.quantity
  }

  // Kto kupuje (jeśli zalogowany) — przyda się przy tworzeniu zamówienia.
  const h = await getHeaders()
  const { user } = await payload.auth({ headers: h })
  const customerId = user?.collection === 'customers' ? String(user.id) : ''

  // PaymentIntent = "zamiar płatności" na policzoną kwotę. To Stripe pilnuje,
  // że pobierze DOKŁADNIE tyle — klient nie może tego zmienić.
  const intent = await stripe.paymentIntents.create({
    amount: total,
    currency: 'pln',
    automatic_payment_methods: { enabled: true }, // Stripe sam dobierze metody płatności
    metadata: {
      // surowe dane koszyka — webhook odtworzy z nich zamówienie
      items: JSON.stringify(cartItems),
      customerId,
    },
  })

  // client_secret trafia do przeglądarki i pozwala dokończyć TĘ płatność.
  return { clientSecret: intent.client_secret, total }
}
