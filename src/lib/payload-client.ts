import { Payload } from 'payload'

let payload: Payload | null = null

export const getPayload = async () => {
  if (payload) return payload

  const payloadModule = await import('payload')
  payload = payloadModule.getPayloadClient({
    config: await import('./payload.config'),
  })

  return payload
}

export const payload = await getPayload()