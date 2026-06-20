# Kadruj

Fikcyjny sklep e-commerce dla marki fotograficznej — projekt portfolio demonstrujący pełny stack nowoczesnego e-commerce: od panelu admina, przez płatności, po rozróżnienie produktów fizycznych i cyfrowych w jednym checkout flow.

> Projekt edukacyjny / case study. Marka, produkty i treści są fikcyjne.

## Czego dotyczy projekt

Kadruj to sklep sprzedający produkty związane z fotografią, łączący dwa różne modele realizacji zamówienia w jednym systemie:

- **Produkty fizyczne** — wydruki fotograficzne, albumy (wymagają adresu dostawy, kosztu wysyłki)
- **Produkty cyfrowe** — presety do Lightrooma, pakiety zdjęć stockowych (dostawa natychmiastowa, brak adresu)

Celem projektu było przećwiczenie sytuacji, z jaką realnie spotyka się większość sklepów internetowych: różne typy produktów wymagają różnej logiki w koszyku, checkout i po finalizacji zamówienia.

## Stack technologiczny

| Warstwa | Technologia | Rola |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript | Renderowanie stron, routing |
| Styling | Tailwind CSS | System wizualny |
| CMS / Panel admina | Payload CMS | Zarządzanie produktami, kategoriami, zamówieniami, autentykacja |
| Baza danych | Supabase (PostgreSQL) | Przechowywanie danych |
| Płatności | Stripe | Checkout, webhooks |
| Upload plików | Uploadthing | Zdjęcia produktów |

## Architektura — kluczowe decyzje

- **Payload CMS jako warstwa backendowa** — zamiast łączyć osobny ORM (Prisma) z osobnym systemem autentykacji (Auth.js), Payload dostarcza obie funkcje wbudowane, redukując liczbę zależności i punktów awarii.
- **Rozróżnienie produktów na poziomie danych** — typ produktu (fizyczny/cyfrowy) determinuje logikę checkout, nie jest to rozwiązane na poziomie UI.
- **Połączenie z bazą przez connection pooler** — zamiast direct connection, dla stabilności połączeń w środowisku serverless/deployment.

## Status projektu

🚧 W budowie — aktualny postęp i plan rozwoju w [issues](../../issues) / [projects](../../projects).

## Uruchomienie lokalne

```bash
git clone https://github.com/Herzuss/kadruj.git
cd kadruj
pnpm install
cp .env.example .env   # uzupełnij własne wartości
pnpm dev
```

Panel admina dostępny pod `/admin` po skonfigurowaniu zmiennych środowiskowych.

## Autor

Filip Herzog — [HerzogWeb](https://herzogweb.pl)
