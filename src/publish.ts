import { Bee, PrivateKey, Topic } from '@ethersphere/bee-js'
import { BEE_URL, PAYER_ADDRESS, CATALOGUE_TOPIC } from './env'
import { getOrCreateBatch } from './stamps'
import { readFileSync } from 'node:fs'

// Current owner writes catalogue JSON, then catalogue feed via uploadReference.
export async function publish() {
  const pkHex = process.env.PUBLISHER_PRIVATE_KEY
  if (!pkHex) throw new Error('PUBLISHER_PRIVATE_KEY missing')
  const govHex = process.env.GOVERNANCE_PRIVATE_KEY ?? ''
  const publisher = new PrivateKey(pkHex)
  const publisherAddr = publisher.publicKey().address().toString()

  if (govHex) {
    const govAddr = new PrivateKey(govHex).publicKey().address().toString()
    if (publisherAddr.toLowerCase() === govAddr.toLowerCase())
      throw new Error('publisher must not equal governance address')
  }
  if (PAYER_ADDRESS && PAYER_ADDRESS.toLowerCase() === publisherAddr.toLowerCase())
    console.warn('warn: PAYER_ADDRESS equals publisher — payer and publisher must be different')

  const bee = new Bee(BEE_URL)
  const batchId = process.env.BATCH_ID ?? (await getOrCreateBatch())
  const raw = readFileSync('./catalogue.json')
  const { reference } = await bee.data.upload(batchId, raw)

  const topic = Topic.fromString(CATALOGUE_TOPIC)
  const writer = bee.feed.makeWriter(topic, publisher)
  try {
    await bee.feed.makeReader(topic, publisher.publicKey().address()).downloadReference()
  } catch {
    // empty feed: first update starts at index 0
  }
  await writer.uploadReference(batchId, reference)
  console.log(JSON.stringify({ publisher: publisherAddr, payer: PAYER_ADDRESS, reference: reference.toString() }))
}

if (import.meta.url === `file://${process.argv[1]}`) {
  publish().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
