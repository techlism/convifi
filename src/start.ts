import { createMiddleware, createStart } from '@tanstack/react-start'
import { setResponseHeaders } from '@tanstack/react-start/server'

const coopCoep = createMiddleware().server(async ({ next }) => {
  setResponseHeaders({
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
  })
  return next()
})

export const startInstance = createStart(() => ({
  requestMiddleware: [coopCoep],
}))
