![Parampara logo](public/diagram.svg)

# Parampara

### The catalogue survives the owner — one reader address across every succession

**Stable Swarm pointer. Three keys that never meet. A performed hand-off, on record.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) [![Swarm](https://img.shields.io/badge/Swarm-bee--js_13-F16822?style=flat-square)](https://www.ethswarm.org/) [![Gnosis](https://img.shields.io/badge/Gnosis-100-04795B?style=flat-square)](https://www.gnosis.io/) [![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square)](https://tailwindcss.com/)

---

Parampara keeps one shared catalogue — seven monastery libraries across Ladakh and
Spiti: holdings, folio condition, damage, missing and photographed — reachable,
paid for, and correctable after its keeper stops answering. Ngawang maintained it
for nine years with one key; the arrangement under which it survives him is this
repo: a stable pointer feed, three separated jobs, and a hand-off that was
actually performed, not described.

Built for **Road To Devcon - V · Problem 3: The succession nobody wrote down**
(`steward-succession`).

---

## Core Value Proposition

Problem | Parampara Solution
---|---
One man, one key, one card on file | Pointer feed maps to whoever the current owner is — rotate the person, keep the address
Scans nearly died in six years | Storage as a subscription: payer extends the *existing* batch on schedule, TTL shown honestly
Nobody knows who may do what | Paying ≠ publishing ≠ deciding — three keys, enforced in code and UI
Succession is a promise | Succession is a transaction: pointer rewrite + `HANDOFF.json` with two identities and feed evidence
Shared node, murky custody | Stated plainly: every batch belongs to the node wallet; what splits is signing authority

## Architecture

```
reader (no wallet) → / → pointer feed [governance + catalogue-publisher-pointer]
  → { currentPublisher, catalogueTopic }
  → catalogue feed [owner + ladakh-spiti-shared-catalogue]
  → catalogue JSON on Swarm
```

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 15 App Router, React 19, Tailwind 4 | Reader, publish, extend, succession as real routes + server actions |
| **Language** | TypeScript 5 | End-to-end typing, `tsc --noEmit` clean |
| **Wallet** | RainbowKit + wagmi 2 + viem 2 | Publisher vs governance as different connected accounts, Gnosis only |
| **Storage** | `@ethersphere/bee-js` 13, Swarm Desktop | `data.upload`, `stamp.getAll/topUp`, `storage.extendDuration`, `feed.*` namespaces |
| **Chain** | Gnosis (100) | Postage, chequebook, Safe live here |
| **Succession** | Safe on Gnosis (documented destination) | Committee owns naming the next writer; rows never touch it |
| **Design** | Pine/parchment/ember, Zilla Slab display | Fills sampled 1:1 from `public/diagram.svg` brand board |

Live record today: pointer ref `06fae57b…` at feed index 4, current owner
`0x13b991900a7570bdde9b1e8bf466796bb7b11ffe`.

## Feature Set

### Read — no wallet, no permission

- **One address forever** — governance owner + pointer topic; homepage resolves it live, falls back to tracked copies with an honest label when the node is down.
- **LIVE from Swarm badge** — every render says whether you see chain state or cache.

### Publish — current owner only

- **Row form** — library, work, condition, photographed → appended and published via the same `publish()` as the CLI.
- **Refused otherwise** — form locks unless the connected wallet equals the live current owner; server re-checks and fails closed.

### Extend — payer's subscription

- **One button, existing batch** — `extendDuration` with `topUp` fallback, TTL printed from `stamp.getAll()`.
- **Live xBZZ balance card** — warns before the tank runs dry; anyone can refill with their own xBZZ (real ERC20 transfer, signed in-browser).

### Succeed — committee only

- **New owner typed, old owner fixed** — incoming arrives as parameter (`--incoming`, form field, `?incoming=`); outgoing prefills from the live pointer, read-only.
- **Deny-list + allowlist** — current/past owners and payer refused client- and server-side; `COMMITTEE_ADDRESSES` restricts proposers further.

### Rules & Record

- **`/arrangement`** renders the scored `docs/ARRANGEMENT.md`: named new owner + address, three triggers, three jobs, honest custody.
- **`/handoff`** shows the performed hand-off: human summary card plus the raw `HANDOFF.json` the checks read.

## Tech Stack

See Architecture table. Full operational guide: [`docs/DOCS.md`](docs/DOCS.md).

## Measured, Not Estimated

Produced from this repo against a funded light node:

Check | Result
---|---
`npx tsc --noEmit` | clean
`npm run build` | green, 9 routes
`npm run publish` | reference `64e9897f…`
`npm run extend -- --days 1` | `extended via bee.storage.extendDuration`, TTL `84901s`
`npm run read -- --bee … --owner 0x4d6c… --topic catalogue-publisher-pointer` | pointer JSON + owner resolved
`npm run succeed` | pointer ref `06fae57b…`, previous index `4`, `performed:true`
Secrets scan (`src app docs` + configs) | zero hits

Reproduce: fill `.env`, then the ceremony is `publish` → `extend` → `succeed` → `read`.

## Project Structure

```
.
├── app/                    # reader, publish, extend, succeed, arrangement, handoff
├── src/                    # CLI twins the UI imports: env, stamps, publish,
│                           # read, extend-storage, succeed, status
├── docs/                   # ARRANGEMENT.md, HANDOFF.md/.json, DOCS.md
├── public/diagram.svg      # brand board: logo, palette source, hero art
├── identities.json         # payer / owner / governance + readerStartsFrom
└── catalogue.json          # tracked copy of the catalogue
```

## Getting Started

### Prerequisites

- **Node** 20.12+ · **Swarm Desktop** with funded light-mode node (`http://localhost:1633`)
- A postage batch (mutable), three distinct Gnosis addresses, a sip of xDAI if deploying the Safe

### Installation

```bash
git clone <repository-url>
cd steward-succession
npm install
```

### Environment Configuration

```bash
cp .env.example .env
```

`BEE_URL` · `BATCH_ID` · `PAYER_ADDRESS` · `PUBLISHER_PRIVATE_KEY` ·
`GOVERNANCE_PRIVATE_KEY` · optional `SAFE_ADDRESS`, `COMMITTEE_ADDRESSES`.

### Development

```bash
npm run dev        # app on :3000
npm run publish    # owner writes
npm run extend -- --days 1
npm run read -- --bee http://localhost:1633 --owner 0xGOV --topic catalogue-publisher-pointer
npm run succeed -- --incoming 0xNEW --outgoing 0xOLD
```

### Verification

```bash
npx tsc --noEmit
npm run build
npm run status
```

## Security Model

- Owner key writes rows; it cannot retarget readers — enforced by key separation plus UI/server refusal.
- Governance key rewrites the pointer; it never equals the publisher key — enforced by throw-checks.
- Payer funds postage; it signs nothing — shown side-by-side with the publisher everywhere.
- No keys, mnemonics, gift codes, or authed URLs in tracked files — env only.
- The Safe (2-of-3, Gnosis) is the documented destination for governance custody; until deployed, the separately keyed pointer feed carries the same invariant with one key instead of a vote. Stated, not faked.

## Roadmap

- **Safe deploy** — 2-of-3 on Gnosis, owner list becomes `COMMITTEE_ADDRESSES`, tx hash into `HANDOFF.json`
- **Owner publishes** — first catalogue row signed by the incoming key
- **Scheduled renewal** — payer cron/reminder so TTL never nears zero
- **Timelock** — public delay in front of succession after the Safe lands

---

**Paper states, pointer proves.**
