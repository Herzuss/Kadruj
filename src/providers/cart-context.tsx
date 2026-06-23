'use client'

// 'use client' = ten plik działa w PRZEGLĄDARCE (a nie na serwerze).
// Koszyk musi reagować na kliknięcia i czytać localStorage — to robota klienta.

import { createContext, useContext, useEffect, useReducer, useRef } from 'react'

// --- Kształt danych ---

// Jedna pozycja w koszyku. Trzymamy minimum potrzebne do wyświetlenia i
// policzenia sumy — nie cały produkt z bazy.
export type CartItem = {
  id: number
  slug: string
  title: string
  price: number // w GROSZACH, jak w bazie
  type: 'physical' | 'digital'
  quantity: number
}

// To, co przyjmuje "dodaj do koszyka" — pozycja BEZ ilości (ilość dokłada reducer).
type CartProduct = Omit<CartItem, 'quantity'>

type State = { items: CartItem[] }

// Wszystkie możliwe "zdarzenia", które zmieniają koszyk. reducer poniżej
// decyduje, jak każde z nich przekształca stan. To jest wzorzec reducera:
// stary stan + akcja → nowy stan.
type Action =
  | { type: 'HYDRATE'; items: CartItem[] } // wczytanie z localStorage przy starcie
  | { type: 'ADD'; product: CartProduct }
  | { type: 'REMOVE'; id: number }
  | { type: 'SET_QTY'; id: number; quantity: number }
  | { type: 'CLEAR' }

// --- Reducer: czysta funkcja, jedyne miejsce gdzie zmienia się stan ---

function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return { items: action.items }

    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.product.id)
      // Produkt cyfrowy kupujesz raz — nie ma sensu mieć go 2× w koszyku.
      if (existing) {
        if (existing.type === 'digital') return state // już jest, nie zwiększaj
        return {
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        }
      }
      return { items: [...state.items, { ...action.product, quantity: 1 }] }
    }

    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.id) }

    case 'SET_QTY':
      return {
        items: state.items.map((i) =>
          i.id === action.id
            ? { ...i, quantity: Math.max(1, action.quantity) } // nigdy poniżej 1
            : i,
        ),
      }

    case 'CLEAR':
      return { items: [] }

    default:
      return state
  }
}

// --- Context: "kanał", przez który dowolny komponent dosięga koszyka ---

type CartContextValue = {
  items: CartItem[]
  addItem: (product: CartProduct) => void
  removeItem: (id: number) => void
  setQty: (id: number, quantity: number) => void
  clear: () => void
  count: number // łączna liczba sztuk (na licznik w nagłówku)
  totalGrosze: number // suma do zapłaty, w groszach
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'kadruj-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Flaga: czy już wczytaliśmy koszyk z localStorage. Bez niej pierwszy
  // useEffect zapisałby pusty koszyk i nadpisał to, co było zapisane.
  const hydrated = useRef(false)

  // 1) Przy pierwszym renderze (w przeglądarce) wczytaj zapisany koszyk.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        dispatch({ type: 'HYDRATE', items: JSON.parse(saved) })
      } catch {
        // uszkodzony JSON — ignorujemy, zostaje pusty koszyk
      }
    }
    hydrated.current = true
  }, [])

  // 2) Po każdej zmianie koszyka zapisz go (ale dopiero PO wczytaniu).
  useEffect(() => {
    if (!hydrated.current) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  // Wartości pochodne — liczone z items, więc zawsze aktualne.
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalGrosze = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const value: CartContextValue = {
    items: state.items,
    addItem: (product) => dispatch({ type: 'ADD', product }),
    removeItem: (id) => dispatch({ type: 'REMOVE', id }),
    setQty: (id, quantity) => dispatch({ type: 'SET_QTY', id, quantity }),
    clear: () => dispatch({ type: 'CLEAR' }),
    count,
    totalGrosze,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Własny hook — zamiast pisać useContext(CartContext) wszędzie, wołasz useCart().
// Rzuca błąd, jeśli użyjesz go poza <CartProvider> — łapie pomyłkę od razu.
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart musi być użyty wewnątrz <CartProvider>')
  return ctx
}
