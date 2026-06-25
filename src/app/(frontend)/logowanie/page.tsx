'use client'
import { useState, type SyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'

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
    } else {
      setError('Nie udalo sie zalogowac')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Zaloguj się</button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  )
}
