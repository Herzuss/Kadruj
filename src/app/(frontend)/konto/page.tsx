import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import LogoutButton from '@/components/LogoutButton'

export default async function KontoPage() {
  const headers = await getHeaders() // nagłówki żądania (w nich cookie)
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers }) // Payload czyta cookie → kto zalogowany

  // Niezalogowany albo to nie klient (np. admin) → na logowanie.
  if (!user || user.collection !== 'customers') redirect('/logowanie')

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Moje konto</h1>

      <div className="mt-8 rounded-xl border border-neutral-200 p-6">
        <p className="text-xs uppercase tracking-wide text-neutral-400">Imię i nazwisko</p>
        <p className="mt-1 text-lg">{user.name}</p>

        <p className="mt-5 text-xs uppercase tracking-wide text-neutral-400">E-mail</p>
        <p className="mt-1 text-lg">{user.email}</p>
      </div>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  )
}
