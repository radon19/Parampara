import { revalidatePath } from 'next/cache'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { readFileSync } from 'node:fs'
import { succeed } from '../../src/succeed'
import { resolveCatalogue } from '../../src/read'
import { SucceedForm } from './succeed-form'
import ids from '../../identities.json'

function deniedList(currentPublisher: string) {
  const list = [
    { address: currentPublisher, label: 'the current publisher' },
    { address: ids.payer.address, label: 'the payer' },
  ]
  try {
    const handoff = JSON.parse(readFileSync('./docs/HANDOFF.json', 'utf8'))
    if (handoff.outgoingSigningIdentity)
      list.push({ address: handoff.outgoingSigningIdentity, label: 'a past owner' })
    if (handoff.incomingSigningIdentity && handoff.incomingSigningIdentity !== currentPublisher)
      list.push({ address: handoff.incomingSigningIdentity, label: 'a past owner' })
  } catch {
    // no handoff record yet: current + payer still denied
  }
  return list.filter((d) => !!d.address)
}

function committeeAllows(connected: string): boolean {
  const raw = process.env.COMMITTEE_ADDRESSES ?? ''
  const allow = raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  if (allow.length === 0) return true // allowlist not configured: deny-list only
  return allow.includes(connected.toLowerCase())
}

async function succeedEntry(formData: FormData) {
  'use server'
  const incoming = String(formData.get('incoming') ?? '')
  const outgoing = String(formData.get('outgoing') ?? '')
  const connected = String(formData.get('connected') ?? '')
  const beeUrl = process.env.BEE_URL ?? 'http://localhost:1633'
  const { pointer } = await resolveCatalogue(beeUrl, ids.readerStartsFrom.owner, ids.readerStartsFrom.topic)
  const current = String(pointer.currentPublisher)
  if (!connected) throw new Error('refused: connect a committee wallet first')
  if (deniedList(current).some((d) => connected.toLowerCase() === d.address.toLowerCase()))
    throw new Error('refused: owners and payer cannot propose succession — committee only')
  if (!committeeAllows(connected))
    throw new Error('refused: connected wallet is not on the committee')
  await succeed(incoming, outgoing)
  revalidatePath('/')
  revalidatePath('/handoff')
}

export default async function SucceedPage({
  searchParams,
}: {
  searchParams: Promise<{ incoming?: string }>
}) {
  const q = await searchParams
  let currentPublisher: string = ids.publisher.address
  try {
    const beeUrl = process.env.BEE_URL ?? 'http://localhost:1633'
    const { pointer } = await resolveCatalogue(beeUrl, ids.readerStartsFrom.owner, ids.readerStartsFrom.topic)
    currentPublisher = pointer.currentPublisher
  } catch {
    // fallback to tracked copy when the node is unreachable
  }
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl">Pass the seal</h2>
      <p className="sans mt-2 text-sm" style={{ color: '#5c5348' }}>
        Committee job. Safe owners confirm <span className="mono">setPublisher(incoming)</span>,
        then the pointer feed is rewritten. Owners past and present are refused here — connect
        a committee wallet.
      </p>
      <div className="mt-6">
        <ConnectButton />
      </div>
      <p className="sans mt-4 text-sm" style={{ color: '#5c5348' }}>
        Current publisher: <span className="mono">{currentPublisher}</span>
      </p>
      <SucceedForm
        action={succeedEntry}
        defaultIncoming={q.incoming ?? ''}
        currentPublisher={currentPublisher}
        denied={deniedList(currentPublisher)}
      />
      <p className="sans mt-3 text-sm" style={{ color: '#5c5348' }}>
        Submitting runs the same <span className="mono">succeed()</span> as{' '}
        <span className="mono">npm run succeed -- --incoming 0x… --outgoing 0x…</span> and updates{' '}
        <span className="mono">docs/HANDOFF.json</span>. Accepts <span className="mono">?incoming=0x…</span> too.
        Set <span className="mono">COMMITTEE_ADDRESSES</span> (server env) to restrict proposers
        to named committee wallets.
      </p>
    </main>
  )
}
