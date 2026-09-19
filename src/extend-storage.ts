import { Bee, Duration } from '@ethersphere/bee-js'
import { BEE_URL, PAYER_ADDRESS } from './env'
import { getOrCreateBatch } from './stamps'

// Payer job: extend existing batch, never buy-only.
export async function extendExistingBatch(days = 7) {
  const bee = new Bee(BEE_URL)
  const batchId = process.env.BATCH_ID ?? (await getOrCreateBatch())
  console.log(`payer ${PAYER_ADDRESS} extending batch ${batchId} by ${days}d`)
  try {
    await bee.storage.extendDuration(batchId, Duration.fromDays(days))
    console.log('extended via bee.storage.extendDuration')
  } catch (e: any) {
    console.log(`extendDuration failed (${e?.message ?? e}), trying bee.stamp.topUp fallback`)
    await bee.stamp.topUp(batchId, '1000000')
    console.log('extended via bee.stamp.topUp fallback')
  }
  const batches = await bee.stamp.getAll()
  const b: any = batches.find((x: any) => (x.batchID ?? x.batchId) === batchId) ?? batches[0]
  console.log('remaining:', JSON.stringify({ duration: b?.duration, batchTTL: b?.batchTTL ?? b?.ttl ?? null }))
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const i = process.argv.indexOf('--days')
  extendExistingBatch(i > -1 ? Number(process.argv[i + 1]) : 7).catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
