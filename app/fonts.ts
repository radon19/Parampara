import { Zilla_Slab } from 'next/font/google'

// Slab serif with typewriter bones — the voice of account books and
// monastic ledgers, which is exactly what this surface is.
export const display = Zilla_Slab({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
})
