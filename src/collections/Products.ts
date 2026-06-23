import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/slugify'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    // Kolumny widoczne od razu na liście produktów w panelu.
    defaultColumns: ['title', 'type', 'price', 'category'],
  },
  access: {
    // Produkty są publiczne — sklep czyta je bez logowania.
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true, // trafia do URL: /produkt/preset-warm-tones
      admin: {
        description: 'Część adresu URL. Generuje się z tytułu, można nadpisać.',
      },
      hooks: {
        // Ten sam wzorzec co w Categories — auto-slug z tytułu, jeśli pusty.
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            return data?.title ? slugify(data.title) : value
          },
        ],
      },
    },
    {
      // Kluczowe pole: decyduje o flow w checkout (fizyczny vs cyfrowy)
      // i o tym, które pola poniżej są widoczne w panelu.
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'physical',
      options: [
        { label: 'Fizyczny (wysyłka)', value: 'physical' },
        { label: 'Cyfrowy (do pobrania)', value: 'digital' },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      // Cenę trzymamy w groszach jako liczbę całkowitą — NIE w złotówkach z przecinkiem.
      // Powód: liczby zmiennoprzecinkowe (19.99) gubią grosze przy mnożeniu/zaokrąglaniu,
      // a Stripe i tak oczekuje kwoty w najmniejszej jednostce (grosze). 1990 = 19,90 zł.
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Cena w GROSZACH (1990 = 19,90 zł).',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true, // galeria zdjęć produktu
    },

    // --- Pola tylko dla produktów FIZYCZNYCH ---
    {
      name: 'stock',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        // admin.condition decyduje, czy pole pokazać w panelu na podstawie
        // wartości innych pól. Tu: tylko gdy type === 'physical'.
        condition: (data) => data?.type === 'physical',
        description: 'Stan magazynowy (liczba sztuk).',
      },
    },
    {
      name: 'weightGrams',
      type: 'number',
      min: 0,
      admin: {
        condition: (data) => data?.type === 'physical',
        description: 'Waga w gramach — przyda się do liczenia kosztu wysyłki.',
      },
    },

    // --- Pola tylko dla produktów CYFROWYCH ---
    {
      name: 'downloadFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data?.type === 'digital',
        description: 'Plik do pobrania udostępniany po opłaceniu (preset / paczka zdjęć).',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Pokaz na stronie glownej w sekcji "Wybrane produkty".'
      }
    }
  ],
}
