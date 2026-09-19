import 'dotenv/config'
import { Bee } from '@ethersphere/bee-js'

export const BEE_URL = process.env.BEE_URL ?? 'http://localhost:1633'
export const PAYER_ADDRESS = process.env.PAYER_ADDRESS ?? ''
export const BATCH_ID = process.env.BATCH_ID ?? ''
export const SAFE_ADDRESS = process.env.SAFE_ADDRESS ?? ''

export function bee() {
  return new Bee(BEE_URL)
}

export const POINTER_TOPIC = 'catalogue-publisher-pointer'
export const CATALOGUE_TOPIC = 'ladakh-spiti-shared-catalogue'
