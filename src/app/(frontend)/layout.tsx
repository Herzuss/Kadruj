import React from 'react'
import { Fraunces } from 'next/font/google'
import { CartProvider } from '@/providers/cart-context'
import { SiteHeader } from '@/components/SiteHeader'
import { PromoBar } from '@/components/PromoBar'
import { SiteFooter } from '@/components/SiteFooter'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import './styles.css'

// next/font pobiera czcionkę Fraunces (elegancki serif — pasuje do marki
// fotograficznej, "edytorial/galeria"). Hostuje ją lokalnie (bez requestu do
// Google = szybciej i bez problemów RODO). latin-ext = polskie znaki (ą,ł,ż...).
// variable: udostępnia ją jako zmienną CSS, której używa @theme w styles.css.
const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-fraunces',
})

export const metadata = {
  description: 'Sklep z fotografią — wydruki, albumy, presety i zdjęcia stockowe.',
  title: 'Kadruj',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const h = await getHeaders()
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers: h })
  const customerName = user?.collection === 'customers' ? user.name : null
  return (
    // className z fraunces.variable "włącza" zmienną --font-fraunces na całej stronie.
    <html lang="pl" className={fraunces.variable}>
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        {/* CartProvider udostępnia koszyk wszystkim stronom w środku.
            Jest klientem, ale może opakować Server Components (children). */}
        <CartProvider>
          <PromoBar />
          <SiteHeader customerName={customerName} />
          <main>{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  )
}
