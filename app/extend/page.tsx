import { extendExistingBatch } from '../../src/extend-storage'
import { FundWallet } from './fund'

export const dynamic = 'force-dynamic'

function formatXbzz(plur: string): string {
  try {
    return (Number(BigInt(plur)) / 1e16).toFixed(4)
  } catch {
    return '?'
  }
}

export default async function ExtendPage() {
  const payer = process.env.PAYER_ADDRESS ?? process.env.NEXT_PUBLIC_PAYER_ADDRESS ?? '(node wallet)'
  let balance: string | null = null
  try {
    const beeUrl = process.env.BEE_URL ?? 'http://localhost:1633'
    const w: any = await fetch(`${beeUrl}/wallet`, { cache: 'no-store' }).then((r) => r.json())
    balance = formatXbzz(String(w.bzzBalance ?? '0'))
  } catch {
    balance = null
  }
  const low = balance !== null && Number(balance) < 0.1

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl">Keep the ink from fading</h2>
      <p className="sans mt-2 text-sm" style={{ color: '#5c5348' }}>
        Storage on Swarm is a subscription with an end date. The payer tops up the{' '}
        <em>existing</em> batch — never a fresh buy as the steady path.
      </p>
      <dl className="sans mt-6 border ledger-rule rounded-sm text-sm overflow-hidden">
        <div className="px-4 py-3 flex justify-between gap-4" style={{ background: '#e7d5b8' }}>
          <dt>Payer (node wallet)</dt>
          <dd className="mono">{payer}</dd>
        </div>
        <div className="px-4 py-3 flex justify-between gap-4 border-t ledger-rule">
          <dt>Postage funds (xBZZ)</dt>
          <dd className="mono" style={{ color: low ? '#7c2d12' : undefined }}>
            {balance === null ? 'node unreachable' : `${balance} xBZZ${low ? ' — nearly empty' : ''}`}
          </dd>
        </div>
      </dl>
      {low && (
        <p className="sans mt-3 text-sm" role="alert" style={{ color: '#7c2d12' }}>
          The tank is nearly empty — the next extend will fail with “out of funds.” Fund the
          wallet below, then extend.
        </p>
      )}
      <form
        className="sans mt-6"
        action={async () => {
          'use server'
          await extendExistingBatch(7)
        }}
      >
        <button
          className="px-4 py-2 rounded-sm text-white"
          style={{ background: '#c46a1b' }}
          type="submit"
        >
          Extend 7 days
        </button>
      </form>
      <p className="sans mt-3 text-sm" style={{ color: '#5c5348' }}>
        Runs the same <span className="mono">extendExistingBatch</span> as{' '}
        <span className="mono">npm run extend</span>. Prints remaining TTL from{' '}
        <span className="mono">stamp.getAll()</span>.
      </p>
      <div className="mt-8">
        <FundWallet nodeWallet={payer} />
      </div>
    </main>
  )
}
