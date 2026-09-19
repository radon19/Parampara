import { readFileSync } from 'node:fs'

export default function HandoffPage() {
  const j = readFileSync('./docs/HANDOFF.json', 'utf8')
  const h = JSON.parse(j)
  const rows: [string, string][] = [
    ['Old owner', h.outgoingSigningIdentity],
    ['New owner', h.incomingSigningIdentity],
    ['Governance', h.governanceIdentity],
    ['Safe transaction', h.safeTransactionHash ?? 'none — separately keyed governance feed'],
    ['Pointer reference', h.pointerReference],
    ['Previous feed index', h.previousFeedIndex],
    ['Performed at', h.performedAt],
  ]
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl">Record of the hand-off</h2>
      <p className="sans mt-2 text-sm" style={{ color: '#5c5348' }}>
        Evidence of a performed succession: two identities, Safe tx or feed index, incoming also in{' '}
        <span className="mono">identities.json</span>.
      </p>
      <dl className="sans mt-6 border ledger-rule rounded-sm text-sm overflow-hidden">
        {rows.map(([k, v], i) => (
          <div
            key={k}
            className={`px-4 py-3 gap-4 grid md:grid-cols-[180px_1fr] ${i > 0 ? 'border-t ledger-rule' : ''}`}
            style={i === 1 ? { background: '#e7d5b8' } : undefined}
          >
            <dt style={{ color: '#5c5348' }}>{k}</dt>
            <dd className="mono text-xs break-all">{v}</dd>
          </div>
        ))}
      </dl>
      <h3 className="sans mt-8 text-sm" style={{ color: '#5c5348' }}>
        Raw record (<span className="mono">docs/HANDOFF.json</span> — this file is what the checks read)
      </h3>
      <pre
        className="mono mt-2 p-6 rounded-sm border ledger-rule text-xs overflow-x-auto"
        style={{ background: '#122920', color: '#f3e6d4' }}
      >
        {j}
      </pre>
    </main>
  )
}
