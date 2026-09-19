'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useMounted } from '../use-mounted'

export function ConnectWallet() {
  const { address } = useAccount()
  const mounted = useMounted()
  const shown = mounted ? (address ?? 'not connected') : 'not connected'
  const payer =
    process.env.NEXT_PUBLIC_PAYER_ADDRESS ?? '(node wallet — set NEXT_PUBLIC_PAYER_ADDRESS)'
  return (
    <div>
      <ConnectButton />
      <dl className="sans mt-6 border ledger-rule rounded-sm text-sm overflow-hidden">
        <div className="px-4 py-3 flex justify-between gap-4" style={{ background: '#e7d5b8' }}>
          <dt>Publisher (connected wallet)</dt>
          <dd className="mono">{shown}</dd>
        </div>
        <div className="px-4 py-3 flex justify-between gap-4 border-t ledger-rule">
          <dt>Payer (node wallet)</dt>
          <dd className="mono">{payer}</dd>
        </div>
      </dl>
      <p className="sans mt-3 text-sm" style={{ color: '#5c5348' }}>
        The two addresses above must be different. The form below submits only when the
        connected wallet is the current publisher from the live pointer.
      </p>
    </div>
  )
}

export function EntryForm({
  action,
  currentPublisher,
}: {
  action: (formData: FormData) => void
  currentPublisher: string
}) {
  const { address } = useAccount()
  const mounted = useMounted()
  const match =
    mounted && !!address && !!currentPublisher && address.toLowerCase() === currentPublisher.toLowerCase()

  return (
    <form action={action} className="sans mt-8 border ledger-rule rounded-sm p-5 text-sm" style={{ background: '#faf1e0' }}>
      <input type="hidden" name="connected" value={mounted ? (address ?? '') : ''} />
      <h3 className="text-base mb-4">Add a catalogue row</h3>
      {!mounted && (
        <p className="mb-4 text-sm" style={{ color: '#5c5348' }}>
          Checking wallet connection…
        </p>
      )}
      {mounted && !address && (
        <p className="mb-4 text-sm" style={{ color: '#7c2d12' }}>
          Connect the current publisher’s wallet above to unlock this form.
        </p>
      )}
      {mounted && address && !match && (
        <p className="mb-4 text-sm" role="alert" style={{ color: '#7c2d12' }}>
          Connected wallet <span className="mono">{address}</span> is not the current publisher{' '}
          (<span className="mono">{currentPublisher.slice(0, 10)}…</span>). Rows from anyone else
          are refused.
        </p>
      )}
      <div className="grid gap-3">
        <label className="grid gap-1">
          Library
          <input name="library" required placeholder="Tabo" disabled={!match} className="border ledger-rule rounded-sm px-3 py-2" style={{ background: '#fff', opacity: match ? 1 : 0.5 }} />
        </label>
        <label className="grid gap-1">
          Work
          <input name="work" required placeholder="Medical compendium" disabled={!match} className="border ledger-rule rounded-sm px-3 py-2" style={{ background: '#fff', opacity: match ? 1 : 0.5 }} />
        </label>
        <label className="grid gap-1">
          Condition
          <input name="condition" required placeholder="stable, dry" disabled={!match} className="border ledger-rule rounded-sm px-3 py-2" style={{ background: '#fff', opacity: match ? 1 : 0.5 }} />
        </label>
        <label className="flex items-center gap-2">
          <input name="photographed" type="checkbox" disabled={!match} />
          Photographed
        </label>
        <button className="mt-2 px-4 py-2 rounded-sm text-white w-fit" style={{ background: '#c46a1b', opacity: match ? 1 : 0.5 }} type="submit" disabled={!match}>
          {match ? 'Publish row to Swarm' : 'Refused — publisher not connected'}
        </button>
      </div>
    </form>
  )
}
