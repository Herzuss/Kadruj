// Tailwind v4 działa jako wtyczka PostCSS. Ten plik mówi Next.js:
// "przepuszczaj CSS przez Tailwind". Wtyczka rusza tylko te pliki, które
// zawierają @import "tailwindcss" — czyli panel /admin (osobny CSS) zostaje nietknięty.
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
