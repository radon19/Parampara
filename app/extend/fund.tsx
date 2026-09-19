'use client'
import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { gnosis } from 'wagmi/chains'
import { useMounted } from '../use-mounted'

// xBZZ on Gnosis (16 decimals) — postage is paid in this token, not native xDAI.
const XBZZ = '0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da' as const
const ERC20_TRANSFER = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

export function FundWallet({ nodeWallet }: { nodeWallet: string }) {
  const { address, chainId } = useAccount()
  const mounted = useMounted()
  const wallet = mounted ? address : undefined
  const [amount, setAmount] = useState('0.5')
  const { data: hash, error, isPending, writeContract } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash })

  const wrongChain = !!wallet && chainId !== gnosis.id

  return (
    <div className="sans mt-4 border rounded-sm p-5 text-sm" style={{ borderColor: '#c46a1b', background: '#faf1e0' }}>
      <h3 className="text-base">No funds in the node wallet? Pay with your own.</h3>
      <p className="mt-1" style={{ color: '#5c5348' }}>
        Send <strong>xBZZ on Gnosis</strong> (the postage token — not xDAI) to the node wallet.
        Your wallet signs the transfer; the next <span className="mono">extend</span> spends it.
      </p>
      <p className="mono mt-3 text-xs break-all" style={{ color: '#5c5348' }}>
        node wallet: {nodeWallet}
      </p>
      <div className="mt-4">
        <ConnectButton />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          Amount (xBZZ)
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            className="border ledger-rule rounded-sm px-3 py-2 w-28 mono"
            style={{ background: '#fff' }}
          />
        </label>
        <button
          className="px-4 py-2 rounded-sm text-white"
          style={{ background: '#1b3a2f', opacity: !wallet || wrongChain || isPending ? 0.5 : 1 }}
          disabled={!wallet || wrongChain || isPending}
          onClick={() =>
            writeContract({
              address: XBZZ,
              abi: ERC20_TRANSFER,
              functionName: 'transfer',
              args: [nodeWallet as `0x${string}`, parseUnits(amount || '0', 16)],
              chainId: gnosis.id,
            })
          }
        >
          {isPending ? 'Signing…' : 'Sign xBZZ transfer'}
        </button>
      </div>
      {mounted && !wallet && <p className="mt-2" style={{ color: '#7c2d12' }}>Connect a Gnosis wallet above first.</p>}
      {mounted && wrongChain && <p className="mt-2" style={{ color: '#7c2d12' }}>Switch to Gnosis (chain 100) — xBZZ lives there.</p>}
      {error && <p className="mt-2 mono text-xs" style={{ color: '#7c2d12' }}>Failed: {error.message.slice(0, 140)}</p>}
      {hash && <p className="mt-2 mono text-xs" style={{ color: '#5c5348' }}>tx: {hash}{isSuccess ? ' — confirmed. Now hit Extend.' : ' — waiting…'}</p>}
    </div>
  )
}
