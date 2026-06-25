import type { CollectionConfig } from 'payload'

// Kolekcja klientów sklepu. auth: true daje email + hasło (hashowane),
// endpointy /login /logout /me i logowanie przez cookie HTTP-only.
// To OSOBNA kolekcja od Users (admin) — klient loguje się na sklepie,
// nie ma dostępu do panelu /admin (bo admin.user w configu = 'users').
export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },

  // === ACCESS CONTROL — serce bezpieczeństwa tej kolekcji ===
  // Funkcje access zwracają: true/false (wszystko/nic) ALBO query-constraint
  // (ograniczenie, które Payload doszywa do zapytania). Dzięki temu klient
  // fizycznie nie pobierze cudzych danych — baza zwróci tylko jego rekord.
  access: {
    // Rejestracja musi być publiczna — ktoś niezalogowany tworzy sobie konto.
    create: () => true,

    // Odczyt: admin (z kolekcji 'users') widzi wszystkich klientów w panelu.
    // Klient widzi WYŁĄCZNIE swój rekord (query-constraint po jego id).
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      return { id: { equals: user.id } }
    },

    // Edycja: identycznie — admin każdego, klient tylko siebie.
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      return { id: { equals: user.id } }
    },

    // Usuwanie kont zostawiamy adminowi (staff).
    delete: ({ req: { user } }) => user?.collection === 'users',
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    // email + password dodaje automatycznie auth: true
  ],
}
