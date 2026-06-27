import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { stripe } from '@/lib/stripe'
import type Stripe from 'stripe'

// Webhook = endpoint, który Stripe wywołuje SERWER-DO-SERWERA po zdarzeniach
// (np. udana płatność). To JEDYNE wiarygodne źródło prawdy o płatności —
// dlatego TUTAJ, a nie na stronie sukcesu, tworzymy zamówienie.
// URL: POST /stripe/webhook (poza /api, żeby nie kolidować z Payloadem).
export async function POST(req: Request) {
  // RAW body (tekst, nie JSON!) — potrzebny do weryfikacji podpisu.
  const body = await req.text()
  const signature = (await getHeaders()).get('stripe-signature')

  let event: Stripe.Event
  try {
    // Weryfikacja podpisu — potwierdza, że request NAPRAWDĘ pochodzi od Stripe,
    // a nie od kogoś, kto podszywa się pod webhook. Klucz z .env (STRIPE_WEBHOOK_SECRET).
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    console.error('Webhook: zły podpis', err)
    return new Response('Invalid signature', { status: 400 })
  }

  // Interesuje nas tylko udana płatność.
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const payload = await getPayload({ config: await config })

    // IDEMPOTENCJA — Stripe potrafi wysłać webhook kilka razy. Jeśli zamówienie
    // z tym PaymentIntent już istnieje, nie twórz drugiego.
    const existing = await payload.find({
      collection: 'orders',
      where: { stripePaymentIntentId: { equals: pi.id } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      return new Response('Already processed', { status: 200 })
    }

    // Odtwórz pozycje koszyka z metadanych PaymentIntent.
    const cartItems: { id: number; quantity: number }[] = JSON.parse(
      pi.metadata.items || '[]',
    )
    const ids = cartItems.map((i) => i.id)
    const { docs: products } = await payload.find({
      collection: 'products',
      where: { id: { in: ids } },
      limit: 100,
    })

    // Zrzut pozycji (title + price z chwili zakupu).
    const items = cartItems.map((ci) => {
      const product = products.find((p) => p.id === ci.id)
      return {
        product: ci.id,
        title: product?.title ?? 'Produkt',
        price: product?.price ?? 0,
        quantity: ci.quantity,
      }
    })

    // E-mail kupującego — z konta klienta (jeśli zalogowany) albo z receipt_email.
    let email = pi.receipt_email ?? ''
    const customerId = pi.metadata.customerId
      ? Number(pi.metadata.customerId)
      : undefined
    if (customerId) {
      const customer = await payload
        .findByID({ collection: 'customers', id: customerId })
        .catch(() => null)
      if (customer?.email) email = customer.email
    }

    // Adres wysyłki — jeśli Stripe go zebrał (produkty fizyczne).
    const ship = pi.shipping
    const shippingAddress = ship?.address
      ? {
          name: ship.name ?? '',
          line1: ship.address.line1 ?? '',
          line2: ship.address.line2 ?? '',
          postalCode: ship.address.postal_code ?? '',
          city: ship.address.city ?? '',
          country: ship.address.country ?? '',
        }
      : undefined

    // Utwórz zamówienie (Local API omija access control → webhook może tworzyć).
    await payload.create({
      collection: 'orders',
      data: {
        email: email || 'brak@email.pl',
        customer: customerId,
        status: 'paid',
        total: pi.amount,
        items,
        stripePaymentIntentId: pi.id,
        ...(shippingAddress ? { shippingAddress } : {}),
      },
    })
  }

  // Zawsze odpowiedz 200, żeby Stripe wiedział, że odebrałeś (inaczej będzie ponawiał).
  return new Response('OK', { status: 200 })
}
