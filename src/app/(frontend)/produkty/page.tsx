import {getPayload} from "payload"
import config from "@/payload.config";
import ProductCard from "@/components/ProductCard";

export default async function ProduktyPage (){

  const payload = await getPayload({config: await config})

  const {docs: products} = await payload.find({
    collection:"products",
    depth:1 
  })



  return(
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Produkty</h1>
        <p className="mt-2 text-neutral-500">Wszystko, co mamy — {products.length} szt.</p>
      </header>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p>Brak produktów, dodaj je w panelu admina</p>
        ) : (
          products.map((product) => (
            <li key={product.id} >
                        <ProductCard product={product} />
                        </li>
          ))
        )}
      </ul>
    </div>
  )
}