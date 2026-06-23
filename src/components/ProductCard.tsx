import type {Product} from '@/payload-types'
import Link from 'next/link'
import { formatPrice } from '@/lib/format'

export default function ProductCard({product}: {product:Product}) {
  return (
    <Link
      href={`/produkty/${product.slug}`}
      className="flex flex-col bg-neutral-100 h-full rounded-xl border border-neutral-200 px-4 py-4"
      >
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${product.type === "digital" ? "bg-violet-100 text-violet-700" : "bg-emerald-100 text-emerald-700"}`}>
          {product.type === 'digital' ? 'Cyfrowy' : 'Fizyczny'}
        </span>
        <h2  className="text-xl font-semibold text-left">{product.title}</h2>
        <div className="h-50 w-50 bg-neutral-500 text-2xl text-neutral-100 text-left">PLACEHOLDER</div>
        <p className="text-md font-bold text-left">{formatPrice(product.price)}</p>
      </Link>
  )
}