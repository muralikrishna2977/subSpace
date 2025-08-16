import { nhost } from './nhost'
import { createClient, type Client, type ClientOptions } from 'graphql-ws'

export async function gqlFetch<T>(query: string, variables?: Record<string, any>) {
  const url = nhost.graphql.getUrl()
  const token = await nhost.auth.getAccessToken()
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables })
  })
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)
  return json.data as T
}

let wsClient: Client | null = null
export function getWsClient(): Client {
  if (wsClient) return wsClient
  const http = nhost.graphql.getUrl()
  const ws = http.replace(/^http/, 'ws')
  const options: ClientOptions = {
    url: ws,
    connectionParams: async () => {
      const token = await nhost.auth.getAccessToken()
      return { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    },
    lazy: true,
    retryAttempts: 5
  }
  wsClient = createClient(options)
  return wsClient
}
