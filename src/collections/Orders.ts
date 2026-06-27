import type { CollectionConfig } from 'payload'

// Zamówienia. Tworzone przez webhook Stripe (server-side, Local API z overrideAccess
// = pomija access control), nigdy ręcznie przez klienta. Klient może je tylko czytać
// (swoje). Admin zarządza wszystkimi w panelu.
export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'email', 'total', 'status', 'createdAt'],
  },

  access: {
    // Odczyt: admin widzi wszystkie; klient tylko swoje (po relacji customer).
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      return { customer: { equals: user.id } }
    },
    // Tworzenie/edycja/usuwanie tylko dla admina (staff). Webhook i tak omija
    // access przez Local API (overrideAccess domyślnie true), więc go nie blokuje.
    create: ({ req: { user } }) => user?.collection === 'users',
    update: ({ req: { user } }) => user?.collection === 'users',
    delete: ({ req: { user } }) => user?.collection === 'users',
  },

  fields: [
    // E-mail kupującego — zawsze (Stripe go zbiera, działa też dla gościa).
    { name: 'email', type: 'email', required: true },

    // Powiązanie z kontem klienta — opcjonalne (zakup gościa nie ma konta).
    { name: 'customer', type: 'relationship', relationTo: 'customers' },

    // Status zamówienia. pending → paid (po webhooku) → shipped (fizyczne).
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Oczekuje na płatność', value: 'pending' },
        { label: 'Opłacone', value: 'paid' },
        { label: 'Wysłane', value: 'shipped' },
        { label: 'Anulowane', value: 'cancelled' },
      ],
    },

    // Suma do zapłaty — w GROSZACH (jak wszędzie, i jak chce Stripe).
    {
      name: 'total',
      type: 'number',
      required: true,
      admin: { description: 'Suma w groszach (1990 = 19,90 zł).' },
    },

    // Pozycje zamówienia — ZRZUT danych z chwili zakupu (title + price + qty),
    // żeby zamówienie pamiętało stan nawet gdy produkt później się zmieni.
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'title', type: 'text', required: true },
        { name: 'price', type: 'number', required: true }, // grosze, snapshot
        { name: 'quantity', type: 'number', required: true, defaultValue: 1 },
      ],
    },

    // ID sesji Stripe — łączy zamówienie z płatnością i chroni przed duplikatami
    // (webhook bywa wysyłany kilka razy → sprawdzamy, czy już mamy ten sessionId).
    {
      name: 'stripeSessionId',
      type: 'text',
      index: true,
      admin: { readOnly: true },
    },

    // Adres wysyłki — tylko dla zamówień z produktem fizycznym (zbiera go Stripe).
    {
      name: 'shippingAddress',
      type: 'group',
      admin: { description: 'Wypełniane tylko dla zamówień z wysyłką.' },
      fields: [
        { name: 'name', type: 'text' },
        { name: 'line1', type: 'text' },
        { name: 'line2', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'country', type: 'text' },
      ],
    },
  ],
}
