import Stripe from 'stripe'

// Jeden, współdzielony klient Stripe dla całego serwera. Czyta secret key z .env.
// Rzucamy jasny błąd, gdy brak klucza — łatwiej diagnozować niż tajemnicze "undefined".
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Brak STRIPE_SECRET_KEY w .env')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
