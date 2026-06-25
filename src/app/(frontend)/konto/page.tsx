import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import LogoutButton from '@/components/LogoutButton'

export default async function KontoPage() {
  const headers = await getHeaders() // nagłówki żądania (w nich cookie)
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers }) // Payload czyta cookie → kto zalogowany

  if (!user || user.collection !== 'customers') redirect('/logowanie') // niezalogowany? wyrzuć na logowanie

  // tu user to obiekt klienta: user.name, user.email, user.id ...
  return (
    <div>
      <h1 className="text-neutral-900 text-2xl text-left">Moje konto</h1>
      <p className="text-neutral-900 text-lg">{user.name} </p>
      <p className="text-neutral-900 text-lg"> {user.email}</p>
      <LogoutButton />{' '}
    </div>
  )
}
