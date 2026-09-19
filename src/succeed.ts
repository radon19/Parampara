import { Bee, PrivateKey, Topic } from '@ethersphere/bee-js'
import { BEE_URL, POINTER_TOPIC } from './env'
import { writeFileSync } from 'node:fs'

// Governance-only succession. Incoming MUST come from outside source.
// Ngawang cannot move the reader address with his own key.
export async function succeed(incoming: string, outgoing: string) {
  if (!incoming) throw new Error('missing --incoming 0x... (or INCOMING_STEWARD)')
  const govHex = process.env.GOVERNANCE_PRIVATE_KEY
  if (!govHex) throw new Error('GOVERNANCE_PRIVATE_KEY missing')
  if (process.env.PUBLISHER_PRIVATE_KEY === govHex)
    throw new Error('governance key must differ from publisher key')

  const bee = new Bee(BEE_URL)
  const gov = new PrivateKey(govHex)
  const batchId = process.env.BATCH_ID ?? (await bee.stamp.getAll().then((b: any) => b[0]?.batchID))
  const payload = JSON.stringify({
    format: 'catalogue-publisher-pointer',
    version: '1.0.0',
    currentPublisher: incoming,
    catalogueTopic: 'ladakh-spiti-shared-catalogue',
    updatedAt: new Date().toISOString(),
    reason: 'succession',
  })
  const { reference } = await bee.data.upload(batchId, new TextEncoder().encode(payload))
  const writer = bee.feed.makeWriter(Topic.fromString(POINTER_TOPIC), gov)
  let prevIndex = '0'
  try {
    const cur: any = await bee.feed.makeReader(Topic.fromString(POINTER_TOPIC), gov.publicKey().address()).downloadReference()
    prevIndex = String(cur.feedIndex ?? cur.feed?.index ?? 0)
  } catch {
    // first pointer write
  }
  await writer.uploadReference(batchId, reference)

  const safeAddress = process.env.SAFE_ADDRESS ?? null
  const handoff = {
    performed: true,
    performedAt: new Date().toISOString(),
    outgoingSigningIdentity: outgoing,
    incomingSigningIdentity: incoming,
    governanceIdentity: '0x' + gov.publicKey().address().toString().replace(/^0x/, ''),
    safeAddress,
    safeTransactionHash: process.env.SAFE_TX_HASH ?? null,
    pointerTopic: POINTER_TOPIC,
    pointerReference: reference.toString(),
    previousFeedIndex: prevIndex,
    evidence: 'two distinct signing identities; incoming also in identities.json and ARRANGEMENT.md; feed index and/or Safe tx hash',
  }
  writeFileSync('./docs/HANDOFF.json', JSON.stringify(handoff, null, 2))
  console.log(JSON.stringify(handoff, null, 2))
}

function arg(n: string) {
  const i = process.argv.indexOf(n)
  return i > -1 ? process.argv[i + 1] : undefined
}
if (import.meta.url === `file://${process.argv[1]}`) {
  succeed(arg('--incoming') ?? process.env.INCOMING_STEWARD ?? '', arg('--outgoing') ?? '').catch(
    (e) => {
      console.error(e)
      process.exit(1)
    },
  )
}
