'use client'
import { useRouter } from 'next/navigation'
import { type SyntheticEvent, useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [error, setError] = useState('')

  async function handleLogout(e: SyntheticEvent) {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/customers/logout', {
      method: 'POST',
    })

    if (res.ok) {
      router.push('/logowanie')
      router.refresh()
    } else {
      setError('blad jest')
    }
  }

  return (
    <div>
      <button className="border border-emerald-300 text-xl " onClick={handleLogout}>
        WYLOGUJ SIE
      </button>
    </div>
  )
}
