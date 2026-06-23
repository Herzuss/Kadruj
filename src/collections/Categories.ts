import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/slugify'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    // Co Payload pokazuje jako tytuł rekordu na listach i w relacjach.
    useAsTitle: 'name',
  },
  access: {
    // Kategorie są publiczne — frontend sklepu musi je czytać bez logowania.
    // Zapis zostawiamy domyślny (tylko zalogowany admin).
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true, // slug trafi do URL-a (/kategoria/wydruki), więc musi być unikalny
      admin: {
        description: 'Część adresu URL, np. "wydruki". Generuje się z nazwy, można nadpisać.',
      },
      hooks: {
        // beforeValidate odpala się przed zapisem. Jeśli slug jest pusty,
        // robimy go z nazwy: małe litery, spacje -> myślniki, bez znaków specjalnych.
        // Dzięki temu nie trzeba wpisywać sluga ręcznie i jest spójny.
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            return data?.name ? slugify(data.name) : value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      // Opcjonalny — może się przydać jako tekst nad listą produktów w kategorii.
    },
  ],
}
