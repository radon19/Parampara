import { readFileSync } from 'node:fs'

export default function ArrangementPage() {
  const md = readFileSync('./docs/ARRANGEMENT.md', 'utf8')
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl">The written arrangement</h2>
      <p className="sans mt-2 text-sm" style={{ color: '#5c5348' }}>
        The scored document. Rendered here, judged in <span className="mono">docs/ARRANGEMENT.md</span>.
      </p>
      <pre
        className="mt-6 p-6 rounded-sm border ledger-rule text-sm whitespace-pre-wrap"
        style={{ background: '#faf1e0' }}
      >
        {md}
      </pre>
    </main>
  )
}
