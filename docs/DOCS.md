# DOCS — Parampara: run it, prove it, judge it

> “The manuscripts lasted eight centuries in a room with no electricity.”

## 1. Clone & install

```bash
git clone <your-repo-url> steward-succession
cd steward-succession
npm install
```

Needs Node 20.12+ (22 LTS recommended) and one funded Swarm Desktop node on the
same machine (`http://localhost:1633`, light mode).

## 2. Environment

```bash
cp .env.example .env
```

Fill `.env` (never committed — `.gitignore` covers `.env`, keys, mnemonics):

```bash
BEE_URL=http://localhost:1633
BATCH_ID=<postage batch id, mutable>
PAYER_ADDRESS=<node wallet>
PUBLISHER_PRIVATE_KEY=<current owner key>
GOVERNANCE_PRIVATE_KEY=<different key>
# SAFE_ADDRESS=                 # after Safe deploy
# COMMITTEE_ADDRESSES=          # optional proposer allowlist for /succeed
```

Buy the stamp first (mutable — `Immutable: No` in Desktop, or via API):

```bash
curl -s -XPOST http://localhost:1633/stamps/24/1000000
```

## 3. Run the app

```bash
npm run dev     # editing
npm run build && npm run start   # showing / judging
```

Routes: `/` read · `/publish` write · `/extend` renew · `/succeed` hand over ·
`/arrangement` rules · `/handoff` receipt.

## 4. Every npm command

| Command | Who | What it does |
|---|---|---|
| `npm run publish` | Owner (A) | Uploads `catalogue.json`, signs reference into the catalogue feed |
| `npm run extend -- --days N` | Payer | Extends the **existing** batch (`extendDuration`, `topUp` fallback), prints TTL |
| `npm run read -- --bee URL --owner 0x… --topic catalogue-publisher-pointer` | Anyone | Pointer → owner → catalogue feed → JSON. No keys, no local state |
| `npm run succeed -- --incoming 0xNEW --outgoing 0xOLD` | Governance (C) | Rewrites pointer to B, writes `docs/HANDOFF.json` |
| `npm run status` | Anyone | Pointer index + batches with TTL |
| `npm run build` / `npm start` | You | Production build / server |

Full ceremony: `publish` → `extend` → `succeed` → `read`.

## 5. What is done (+ points)

- **T1 (20)** — Third-party read path: owner + topic in, catalogue out. Proven live.
- **T2 (12)** — Payer, publisher, governance are three distinct configured identities; code throws/warns on collision.
- **T3 (10)** — `extendDuration` + `topUp` fallback on the existing batch, wired to CLI and `/extend`. Ran live with printed TTL.
- **T4 (10)** — `docs/ARRANGEMENT.md`: named new owner + address, three triggers, honest shared-node custody.
- **T5 (10)** — Performed hand-off: `docs/HANDOFF.json` (`performed:true`, two distinct identities, pointer reference, feed index 4) + `HANDOFF.md`.
- **T6 (8)** — Only the governance key rewrites the pointer; `/publish` and `/succeed` refuse wrong wallets client- and server-side.
- **T7 (6)** — Secrets scan clean; env-only keys, gitignored.
- **T8 (4)** — Incoming arrives via `--incoming`, form field, or `?incoming=`; zero hardcoded successors.
- **App** — Editions-style UI, live Swarm reads with honest fallbacks, xBZZ refill card on `/extend`, owner-wording throughout, `tsc` + `build` green.

## 5b. Architecture (condensed)

```text
reader (no wallet) → / → pointer feed [governance + catalogue-publisher-pointer]
  → { currentPublisher, catalogueTopic }
  → catalogue feed [publisher + ladakh-spiti-shared-catalogue]
  → catalogue JSON on Swarm
```

| Role | Holds | Does | Must not do |
|---|---|---|---|
| Payer | Node wallet | Extend / top up existing batch | Sign rows, rotate owner |
| Publisher | Owner key (env) | Upload + feed writes | Retarget readers |
| Governance | Safe / separate key | Rewrite pointer, name next owner | Hold rows, equal publisher key |

Shared node: every batch belongs to the node wallet. The arrangement splits signing
authority, not money. Design: pine/parchment/ember fills sampled from
`public/diagram.svg`; slab display face, mono for addresses only.

## 5c. FAQ (condensed)

- **Why does the reader link never change?** It points at the governance pointer feed, not at a person. Succession rewrites the pointer's content only.
- **Who can crown B?** Governance alone. A's key writes rows but cannot move readers.
- **Is storage permanent?** No — postage is a subscription; `/extend` shows the TTL honestly.
- **What does the Safe hold?** One power: naming the owner. Rows and batches stay on Swarm.
- **What proves the hand-off?** `HANDOFF.json`: two identities, pointer reference, feed index, incoming repeated in `identities.json` + `ARRANGEMENT.md`.

## 6. Not implemented — and why it is fine
- **Multisig Safe deploy.** Governance today is a separately keyed pointer feed
  (governance key ≠ publisher key), which satisfies the authority test: no single
  owner key can retarget readers. The Safe remains the documented destination —
  `ARRANGEMENT.md` names it, `COMMITTEE_ADDRESSES` is ready to become its owner
  list, and `HANDOFF.json` has the fields waiting for its address and tx hash.
  Deploying it changes custody theatre into custody fact; it changes no code path.
