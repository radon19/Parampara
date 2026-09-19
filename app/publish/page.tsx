import { revalidatePath } from 'next/cache'
import { readFileSync, writeFileSync } from 'node:fs'
import { publish } from '../../src/publish'
import { resolveCatalogue } from '../../src/read'
import { ConnectWallet, EntryForm } from './connect'
import ids from '../../identities.json'

async function publishEntry(formData: FormData) {
  'use server'
  const connected = String(formData.get('connected') ?? '')
  // Refuse unless the connected wallet is the live current publisher.
  // Fail closed: if the pointer is unreachable, nobody publishes.
  const beeUrl = process.env.BEE_URL ?? 'http://localhost:1633'
  const { pointer } = await resolveCatalogue(beeUrl, ids.readerStartsFrom.owner, ids.readerStartsFrom.topic)
  if (!connected || connected.toLowerCase() !== String(pointer.currentPublisher).toLowerCase()) {
    throw new Error('refused: connected wallet is not the current publisher')
  }
  const raw = readFileSync('./catalogue.json', 'utf8')
  const catalogue = JSON.parse(raw)
  catalogue.entries.push({
    library: String(formData.get('library') ?? ''),
    work: String(formData.get('work') ?? ''),
    condition: String(formData.get('condition') ?? ''),
    photographed: formData.get('photographed') === 'on',
    missing: false,
    notes: '',
  })
  catalogue.updatedAt = new Date().toISOString()
  writeFileSync('./catalogue.json', JSON.stringify(catalogue, null, 2))
  await publish()
  revalidatePath('/')
}

export default async function PublishPage() {
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
      <h2 className="text-3xl">Write as the current owner</h2>
      <p className="sans mt-2 text-sm" style={{ color: '#5c5348' }}>
        Publisher key writes rows only. It can never retarget readers — that seal belongs to
        governance. Current publisher: <span className="mono">{currentPublisher}</span>
      </p>
      <div className="mt-6">
        <ConnectWallet />
      </div>
      <EntryForm action={publishEntry} currentPublisher={currentPublisher} />
      <p className="sans mt-3 text-sm" style={{ color: '#5c5348' }}>
        Submitting runs the same <span className="mono">publish()</span> as{' '}
        <span className="mono">npm run publish</span>. The new row appears on the reader page.
      </p>
    </main>
  )
}
