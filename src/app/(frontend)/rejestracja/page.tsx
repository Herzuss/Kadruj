'use client'

import { useState, type SyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const inputClass =
  'w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none transition focus:border-neutral-900'

export default function RejestracjaPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    if (res.ok) {
      router.push('/logowanie')
    } else {
      setError('Nie udało się utworzyć konta. Może e-mail już istnieje?')
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Załóż konto</h1>
      <p className="mt-2 text-sm text-neutral-500">Rejestracja zajmie chwilę.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          type="text"
          placeholder="Imię i nazwisko"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
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
          Zarejestruj się
        </button>
      </form>

      <p className="mt-6 text-sm text-neutral-500">
        Masz już konto?{' '}
        <Link
          href="/logowanie"
          className="font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
        >
          Zaloguj się
        </Link>
      </p>
    </div>
  )
}
