import ids from '../identities.json'
import staticCatalogue from '../catalogue.json'
import { resolveCatalogue } from '../src/read'

export const dynamic = 'force-dynamic'

type Entry = {
  library: string
  work: string
  condition: string
  photographed: boolean
  missing: boolean
  notes?: string
}

const KEYS = ['content-addressed', 'postage-as-subscription', 'feeds', 'stable-pointer', 'succession', 'three-keys', 'gnosis-safe']

export default async function Home() {
  // Live first: pointer feed → current publisher → catalogue feed → JSON.
  // Falls back to the tracked copies when the node is unreachable.
  let live = false
  let publisher: string = ids.publisher.address
  let entries: Entry[] = (staticCatalogue as { entries: Entry[] }).entries
  try {
    const beeUrl = process.env.BEE_URL ?? 'http://localhost:1633'
    const { pointer, catalogue } = await resolveCatalogue(
      beeUrl,
      ids.readerStartsFrom.owner,
      ids.readerStartsFrom.topic,
    )
    publisher = pointer.currentPublisher
    if (catalogue?.entries) entries = catalogue.entries
    live = true
  } catch {
    live = false
  }

  return (
    <main>
      {/* Edition hero */}
      <section style={{ background: '#1b3a2f', color: '#f3e6d4' }}>
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-14">
          <p className="sans text-sm tracking-widest uppercase" style={{ color: '#c4a36a' }}>
            Parampara · The Succession Edition
          </p>
          <h2
            className="mt-4"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', lineHeight: 1.02, letterSpacing: '-0.03em', maxWidth: '16ch' }}
          >
            The catalogue survives the owner.
          </h2>
          <p className="sans mt-5 text-base max-w-2xl" style={{ color: '#e7d5b8' }}>
            Ngawang stops answering email. The catalogue stays reachable, paid for, and
            correctable — through one reader address that never changes, and three keys that
            never meet in one hand.
          </p>
          <div className="sans mt-8 flex flex-wrap gap-3 text-sm">
            <a
              href="#read"
              className="px-5 py-2.5 rounded-full"
              style={{ background: '#c46a1b', color: '#fff8ea' }}
            >
              Read the catalogue
            </a>
            <a
              href="/arrangement"
              className="px-5 py-2.5 rounded-full"
              style={{ border: '1px solid #c4a36a', color: '#f3e6d4' }}
            >
              Read the arrangement
            </a>
          </div>
          <p className="mono mt-8 text-xs leading-relaxed" style={{ color: '#c4a36a' }}>
            reader starts from {ids.readerStartsFrom.safe} + {ids.readerStartsFrom.topic}
            <br />
            current owner {publisher} · {live ? 'LIVE from Swarm' : 'cached copy — node unreachable'}
          </p>
        </div>
      </section>

      {/* Three keys, ledger strip */}
      <section id="read" className="max-w-5xl mx-auto px-6 pt-14">
        <h3 className="text-3xl" style={{ letterSpacing: '-0.02em' }}>
          Paying ≠ publishing ≠ deciding
        </h3>
        <ol className="sans mt-6 border ledger-rule rounded-sm overflow-hidden text-sm">
          <li className="px-4 py-3 flex justify-between gap-4" style={{ background: '#e7d5b8' }}>
            <span>
              <strong>Payer</strong> — node wallet keeps the postage alive
            </span>
            <span className="mono">{ids.payer.address.slice(0, 10)}…</span>
          </li>
          <li
            className="px-4 py-3 flex justify-between gap-4 text-white"
            style={{ background: '#c46a1b' }}
          >
            <span>
              <strong>Publisher</strong> — current owner writes rows{live ? ' (live)' : ''}
            </span>
            <span className="mono">{publisher.slice(0, 10)}…</span>
          </li>
          <li className="px-4 py-3 flex justify-between gap-4 text-white" style={{ background: '#1b3a2f' }}>
            <span>
              <strong>Governance</strong> — Safe names the next writer
            </span>
            <span className="mono">{ids.governance.safe.slice(0, 10)}…</span>
          </li>
        </ol>
        <p className="sans mt-3 text-sm" style={{ color: '#5c5348' }}>
          Resolution: pointer feed → current publisher → catalogue feed → Swarm JSON. After
          succession only the pointer’s content changes — never your link.
        </p>
      </section>

      {/* Catalogue */}
      <section className="max-w-5xl mx-auto px-6 pt-14">
        <h3 className="text-3xl" style={{ letterSpacing: '-0.02em' }}>
          The shelves
        </h3>
        <p className="sans mt-2 text-sm" style={{ color: '#5c5348' }}>
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          {live ? ' · live from Swarm' : ' · cached copy'} · topic{' '}
          <span className="mono">{ids.topics.catalogue}</span>
        </p>
        <table className="sans mt-4 w-full text-sm border ledger-rule" style={{ background: '#faf1e0' }}>
          <thead>
            <tr className="text-left text-white" style={{ background: '#1b3a2f' }}>
              <th className="px-3 py-2 font-medium">Library</th>
              <th className="px-3 py-2 font-medium">Work</th>
              <th className="px-3 py-2 font-medium">Condition</th>
              <th className="px-3 py-2 font-medium">Photo</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={i} className="border-t ledger-rule">
                <td className="px-3 py-2">{e.library}</td>
                <td className="px-3 py-2">{e.work}</td>
                <td className="px-3 py-2">{e.condition}</td>
                <td className="px-3 py-2">{e.photographed ? 'Yes' : e.missing ? 'Missing' : 'No'}</td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr className="border-t ledger-rule">
                <td className="px-3 py-6 text-center" colSpan={4} style={{ color: '#5c5348' }}>
                  {live
                    ? 'The new owner has not published yet — the pointer moved, the shelf awaits its first row.'
                    : 'Empty shelf — the first publish writes index 0.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Succession band */}
      <section className="mt-16" style={{ background: '#122920', color: '#f3e6d4' }}>
        <div className="max-w-5xl mx-auto px-6 py-14">
          <p className="sans text-sm tracking-widest uppercase" style={{ color: '#c4a36a' }}>
            Succession
          </p>
          <h3 className="mt-3 text-3xl max-w-xl" style={{ letterSpacing: '-0.02em' }}>
            Thirty days of silence, a signed stand-down, or four of seven votes — then the seal
            moves.
          </h3>
          <p className="sans mt-4 text-sm max-w-2xl" style={{ color: '#e7d5b8' }}>
            Safe owners confirm <span className="mono">setPublisher(incoming)</span>, the pointer
            feed is rewritten, and <span className="mono">HANDOFF.json</span> records both
            identities plus the transaction. Ngawang’s key alone is refused.
          </p>
          <div className="sans mt-6 flex flex-wrap gap-3 text-sm">
            <a href="/extend" className="px-5 py-2.5 rounded-full" style={{ background: '#c46a1b', color: '#fff8ea' }}>
              Extend storage
            </a>
            <a href="/succeed" className="px-5 py-2.5 rounded-full" style={{ border: '1px solid #c4a36a', color: '#f3e6d4' }}>
              Pass the seal
            </a>
          </div>
        </div>
      </section>

      {/* Brand board */}
      <section className="max-w-5xl mx-auto px-6 pt-16">
        <p className="sans text-sm tracking-widest uppercase" style={{ color: '#c46a1b' }}>
          The mark
        </p>
        <h3 className="mt-3 text-3xl max-w-xl" style={{ letterSpacing: '-0.02em' }}>
          A pine folio, an unbroken thread.
        </h3>
        <div className="mt-6 flex flex-col md:flex-row gap-8 items-start">
          <img
            src="/diagram.svg"
            alt="Parampara brand board — pine folio with an unbroken thread. The catalogue survives the steward."
            className="rounded-sm border ledger-rule w-full md:w-80"
          />
          <div>
            <blockquote className="text-xl italic max-w-md" style={{ color: '#2a2724' }}>
              “The manuscripts lasted eight centuries in a room with no electricity. The scans
              nearly died in six years.”
            </blockquote>
            <div className="sans mt-6 flex flex-wrap gap-2">
              {[
                ['Parchment', '#f3e6d4', '#2a2724'],
                ['Pine', '#1b3a2f', '#f3e6d4'],
                ['Ember', '#c46a1b', '#fff8ea'],
                ['Gold', '#c4a36a', '#2a2724'],
                ['Ink', '#2a2724', '#f3e6d4'],
              ].map(([name, fill, fg]) => (
                <span
                  key={name}
                  className="mono text-xs px-3 py-1.5 rounded-full border ledger-rule"
                  style={{ background: fill, color: fg }}
                >
                  {name} {fill}
                </span>
              ))}
            </div>
            <p className="sans mt-6 text-sm" style={{ color: '#5c5348' }}>
              Every fill on this page is sampled from the board. Nothing else was invited in.
            </p>
          </div>
        </div>
      </section>

      {/* Keywords */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-4">
        <div className="sans flex flex-wrap gap-2">
          {KEYS.map((k) => (
            <span key={k} className="mono text-xs px-3 py-1.5 rounded-full border ledger-rule" style={{ color: '#5c5348' }}>
              {k}
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}
