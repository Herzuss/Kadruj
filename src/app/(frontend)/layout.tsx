import React from 'react'
import { CartProvider } from '@/providers/cart-context'
import { SiteHeader } from '@/components/SiteHeader'
import './styles.css'

export const metadata = {
  description: 'Sklep z fotografią — wydruki, albumy, presety i zdjęcia stockowe.',
  title: 'Kadruj',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="pl">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        {/* CartProvider udostępnia koszyk wszystkim stronom w środku.
            Jest klientem, ale może opakować Server Components (children). */}
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}
