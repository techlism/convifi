import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { conversions } from './lib/conversion-formats'
import { blogPosts } from './lib/blog-posts'

const staticPages = [
  { path: '/' },
  { path: '/compress-images' },
  { path: '/remove-bg' },
  { path: '/reduce-image-in-kb' },
  { path: '/about' },
  { path: '/privacy' },
  { path: '/terms' },
  { path: '/blog' },
]

const converterPages = conversions.map((c) => ({
  path: `/convert/${c.from.toLowerCase()}-to-${c.to.toLowerCase()}`,
}))

const blogPages = blogPosts.map((p) => ({
  path: `/blog/${p.slug}`,
}))

const allPages = [...staticPages, ...converterPages, ...blogPages]

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  optimizeDeps: {
    include: ['lamejs'],
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: false,
        autoStaticPathsDiscovery: true,
      },
      pages: allPages,
    }),
    viteReact(),
  ],
})

export default config
