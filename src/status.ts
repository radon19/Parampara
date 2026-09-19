import { Bee, Topic } from '@ethersphere/bee-js'
import { BEE_URL, POINTER_TOPIC } from './env'
import { readFileSync } from 'node:fs'

// Prints current publisher, batch TTL, pointer index.
export async function status() {
  const bee = new Bee(BEE_URL)
  const ids = JSON.parse(readFileSync('./identities.json', 'utf8'))
  const owner = ids.readerStartsFrom.owner ?? ids.readerStartsFrom.safe
  try {
    const r: any = await bee.feed.makeReader(Topic.fromString(POINTER_TOPIC), owner).downloadReference()
    console.log('pointer feedIndex:', r.feedIndex ?? r.feed?.index ?? '?')
  } catch {
    console.log('pointer feed: empty (index 0 next)')
  }
  const batches = await bee.stamp.getAll().catch(() => [])
  // Extract plain strings first: raw batch objects carry Bytes wrappers
  // that crash JSON.stringify.
  const rows = (batches as any[]).map((b: any) => ({
    id: String(b.batchID ?? b.batchId ?? ''),
    ttl: b.batchTTL !== undefined ? String(b.batchTTL) : (b.ttl !== undefined ? String(b.ttl) : null),
    usable: !!b.usable,
  }))
  console.log('batches:', JSON.stringify(rows, null, 2))
}
if (import.meta.url === `file://${process.argv[1]}`) {
  status().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
