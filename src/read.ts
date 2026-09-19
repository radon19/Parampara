import 'dotenv/config'
import { Bee, Topic } from '@ethersphere/bee-js'
import { readFileSync } from 'node:fs'

// bee-js v13 data.download returns a Bytes wrapper (indexed access reads empty):
// the real payload comes from toUtf8().
function toText(b: any): string {
  return typeof b?.toUtf8 === 'function' ? b.toUtf8() : Buffer.from(b as Uint8Array).toString()
}

export type ResolvedCatalogue = {
  pointer: any
  catalogue: any | null
}

// Same resolution as readFromPointer, but returns data for the UI.
// Throws only when the pointer feed itself is unreachable; an empty
// catalogue feed resolves to { pointer, catalogue: null }.
export async function resolveCatalogue(
  beeUrl: string,
  ownerHex: string,
  pointerTopic: string,
): Promise<ResolvedCatalogue> {
  const bee = new Bee(beeUrl)
  const reader = bee.feed.makeReader(Topic.fromString(pointerTopic), ownerHex as any)
  const pointerRef: any = await reader.downloadReference()
  const ref = pointerRef.reference?.toString() ?? pointerRef.toString()
  const pointer = JSON.parse(toText(await bee.data.download(ref)))
  const catalogueReader = bee.feed.makeReader(
    Topic.fromString(pointer.catalogueTopic),
    pointer.currentPublisher as any,
  )
  try {
    const catRef: any = await catalogueReader.downloadReference()
    const catalogue = JSON.parse(toText(await bee.data.download(catRef.reference.toString())))
    return { pointer, catalogue }
  } catch {
    return { pointer, catalogue: null }
  }
}

// Third-party read path: only Bee URL + governance owner + pointer topic.
// Never takes publisher key or local db.
export async function readFromPointer(beeUrl: string, ownerHex: string, pointerTopic: string) {
  const bee = new Bee(beeUrl)
  const reader = bee.feed.makeReader(Topic.fromString(pointerTopic), ownerHex as any)
  let pointerRef: any
  try {
    pointerRef = await reader.downloadReference()
  } catch {
    console.log('empty pointer feed: no publisher yet (index 0)')
    return
  }
  const ref = pointerRef.reference?.toString() ?? pointerRef.toString()
  const pointer = JSON.parse(toText(await bee.data.download(ref)))
  console.log('pointer:', JSON.stringify(pointer))
  const catalogueReader = bee.feed.makeReader(
    Topic.fromString(pointer.catalogueTopic),
    pointer.currentPublisher as any,
  )
  let catRef: any
  try {
    catRef = await catalogueReader.downloadReference()
  } catch {
    console.log('empty catalogue feed: index 0')
    return
  }
  const catalogue = JSON.parse(toText(await bee.data.download(catRef.reference.toString())))
  console.log('catalogue:', JSON.stringify(catalogue, null, 2))
}

function arg(name: string) {
  const i = process.argv.indexOf(name)
  return i > -1 ? process.argv[i + 1] : undefined
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const beeUrl = arg('--bee') ?? process.env.BEE_URL ?? 'http://localhost:1633'
  const owner =
    arg('--owner') ??
    (JSON.parse(readFileSync('./identities.json', 'utf8')) as any).readerStartsFrom.owner
  const topic = arg('--topic') ?? 'catalogue-publisher-pointer'
  readFromPointer(beeUrl, owner, topic).catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
