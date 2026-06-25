'use client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  // Zwykły onClick (nie form) → nie ma czego blokować, więc bez e.preventDefault().
  async function handleLogout() {
    await fetch('/api/customers/logout', { method: 'POST' })
    router.push('/logowanie')
    router.refresh() // odśwież layout, żeby header wrócił do "Zaloguj"
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
    >
      Wyloguj się
    </button>
  )
}
