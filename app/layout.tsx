import { Providers } from './providers'
import { Logo } from './logo'
import { display } from './fonts'
import './globals.css'

const QUOTE = 'The manuscripts lasted eight centuries in a room with no electricity.'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={display.variable}>
        {/* THESIS: the catalogue outlives every owner; this edition page proves one reader address survives succession. Refuses the generic dashboard. OWN-WORLD: parchment ground, pine bands, ember accent, gold rules — every fill sampled from public/diagram.svg, the brand board. STORY: a stranger reads with no wallet, then sees who pays, who writes, who decides, and the seal passing on. FIRST VIEWPORT: pine edition hero (eyebrow, giant title, tagline, CTAs, three-key strip), sticky pill nav below. FORM: edition showcase after Shopify Editions Winter 26 (pinned inspiration); direction contract kept, challengers declined. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance */}
        <Providers>
          <header className="sticky top-0 z-10" style={{ background: '#1b3a2f', color: '#f3e6d4' }}>
            <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-3">
              <a href="/" className="flex items-center gap-3 shrink-0" aria-label="Parampara home">
                <Logo size={34} />
                <span>
                  <span className="sans block text-[10px] tracking-widest uppercase" style={{ color: '#c4a36a' }}>
                    The Succession Edition
                  </span>
                  <span className="block text-xl leading-tight" style={{ letterSpacing: '0.08em' }}>
                    PARAMPARA
                  </span>
                </span>
              </a>
              <nav className="sans flex gap-2 overflow-x-auto text-sm ml-auto">
                {[
                  ['Read', '/'],
                  ['Publish', '/publish'],
                  ['Extend', '/extend'],
                  ['Succeed', '/succeed'],
                  ['Rules', '/arrangement'],
                  ['Record', '/handoff'],
                ].map(([label, href]) => (
                  <a
                    key={href + label}
                    href={href}
                    className="px-4 py-1.5 rounded-full whitespace-nowrap"
                    style={{ border: '1px solid #c4a36a', color: '#f3e6d4' }}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </header>
          {children}
          <footer style={{ background: '#1b3a2f', color: '#f3e6d4' }} className="mt-20">
            <p className="sans max-w-5xl mx-auto px-6 py-8 text-sm" style={{ color: '#c4a36a' }}>
              “{QUOTE}” On a shared Swarm Desktop node every batch belongs to that node’s
              wallet. This arrangement does not split the money. It splits signing authority.
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
