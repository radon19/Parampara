'use client'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { gnosis } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { useState } from 'react'

const config = getDefaultConfig({
  appName: 'steward-succession',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID ?? 'demo',
  chains: [gnosis],
  transports: { [gnosis.id]: http() },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient())
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={qc}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
