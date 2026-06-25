'use client'
import { useState, type SyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Wspólny styl inputa — trzymany w stałej, żeby nie powtarzać długiej klasy
// przy każdym polu (DRY w obrębie pliku). Ten sam styl jest w rejestracji.
const inputClass =
  'w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none transition focus:border-neutral-900'

export default function LogowaniePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/customers/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      router.push('/konto')
      router.refresh()
    } else {
      setError('Nie udało się zalogować. Sprawdź e-mail i hasło.')
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Zaloguj się</h1>
      <p className="mt-2 text-sm text-neutral-500">Dobrze Cię znów widzieć.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-neutral-900 px-5 py-2.5 font-medium text-white transition hover:bg-neutral-700"
        >
          Zaloguj się
        </button>
      </form>

      <p className="mt-6 text-sm text-neutral-500">
        Nie masz konta?{' '}
        <Link
          href="/rejestracja"
          className="font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
        >
          Zarejestruj się
        </Link>
      </p>
    </div>
  )
}
