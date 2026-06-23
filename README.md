# Kadruj

A fictional e-commerce store for a photography brand — a portfolio project demonstrating a full modern e-commerce stack: from the admin panel, through payments, to handling physical and digital products within a single checkout flow.

> Educational project / case study. The brand, products, and content are fictional.

## About the project

Kadruj is a store selling photography-related products, combining two different order-fulfilment models in one system:

- **Physical products** — photo prints, albums (require a shipping address and shipping cost)
- **Digital products** — Lightroom presets, stock photo packs (instant delivery, no address needed)

The goal was to practice a situation most online stores actually face: different product types require different logic in the cart, at checkout, and after the order is placed.

## Tech Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript | Page rendering, routing |
| Styling | Tailwind CSS | Visual system |
| CMS / Admin panel | Payload CMS | Managing products, categories, orders; authentication |
| Database | Supabase (PostgreSQL) | Data storage |
| Payments | Stripe | Checkout, webhooks |
| File uploads | Uploadthing | Product images |

## Architecture — key decisions

- **Payload CMS as the backend layer** — instead of combining a separate ORM (Prisma) with a separate auth system (Auth.js), Payload provides both out of the box, reducing the number of dependencies and points of failure.
- **Product distinction at the data level** — the product type (physical/digital) drives the checkout logic; it is not handled at the UI level.
- **Database connection through a connection pooler** — instead of a direct connection, for stable connections in a serverless/deployment environment.

## Project status

🚧 In progress — current progress and roadmap in [issues](../../issues) / [projects](../../projects).

## Running locally

```bash
git clone https://github.com/Herzuss/kadruj.git
cd kadruj
pnpm install
cp .env.example .env   # fill in your own values
pnpm dev
```

The admin panel is available at `/admin` once the environment variables are configured.

## Author

Filip Herzog — [HerzogWeb](https://herzogweb.pl)
