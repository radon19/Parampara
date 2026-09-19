import { bee, BATCH_ID } from './env'

// First-run helper: return existing BATCH_ID or buy a new batch.
// Extend path never relies on buy alone — see extend-storage.ts.
export async function getOrCreateBatch(depth = 20, amount = '10000000') {
  if (BATCH_ID) return BATCH_ID
  const b = bee()
  const batches = await b.stamp.getAll()
  const usable = batches.find((x: any) => x.usable)
  if (usable) return usable.batchID
  // ponytail: buy-only fallback for first run, extend is the steady path
  const batchId: any = await (b.storage as any).buy(depth, amount)
  return typeof batchId === 'string' ? batchId : (batchId as any).batchID
}
