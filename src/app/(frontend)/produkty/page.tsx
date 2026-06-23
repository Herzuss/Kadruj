import {getPayload} from "payload"
import config from "@/payload.config";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

export default async function ProduktyPage (){

  const payload = await getPayload({config: await config})

  const {docs: products} = await payload.find({
    collection:"products",
    depth:1 
  })



  return(
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1>Wszystkie produkty {products.length}</h1>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p>Brak produktów, dodaj je w panelu admina</p>
        ) : (
          products.map((product) => (
            <li key={product.id}>
              <Link href={`/produkty/${product.slug}`} className="flex flex-col  bg-neutral-100 h-full rounded-xl border border-neutral-200 px-4 py-4">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium justify-left w-fit ${product.type === "digital" ? "bg-violet-100 text-violet-700" : "bg-emerald-100 text-emerald-700"}`}>
                  {product.type === 'digital' ? 'Cyfrowy' : 'Fizyczny'}
                </span>
                <h2  className="text-xl font-semibold text-left">{product.title}</h2>
                <div className="h-50 w-50 bg-neutral-500 text-2xl text-neutral-100 text-left">PLACEHOLDER</div>
                <p className="text-md font-bold text-left">{formatPrice(product.price)}</p>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}