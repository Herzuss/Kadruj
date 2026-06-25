'use client'

import { useState, type SyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'

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
      setError('Nie udalo sie utworzyc konta. Moze email juz istnieje?')
    }
  }

  return (
    <div>
      <h1>Rejestracja</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Imię i nazwisko"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Zarejestruj się</button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  )
}
