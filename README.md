# Convifi

A free, browser-based file converter. Converts video, audio, images, and documents locally using WebAssembly — no file upload, no server, no account required.

Built with TanStack Start, wasm-vips, FFmpeg.wasm, and Pandoc.wasm. All 148+ conversion routes are statically prerendered at build time for fast load and full SEO.

**Live:** [convifi.com](https://convifi.com) · **Source:** [github.com/techlism/convifi](https://github.com/techlism/convifi)

---

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
node .output/server/index.mjs
```

The build prerenenders all pages (converters, blog, tools) to static HTML. Output goes to `.output/`.

## Deployment

The build output is a self-contained Nitro server. Deploy the `.output/` directory to any Node-compatible host (Render, Fly.io, Railway, your own VPS) and run the server command above.

For platform-specific presets (Vercel, Netlify, Cloudflare, AWS Lambda):

```bash
# example: Cloudflare Pages
NITRO_PRESET=cloudflare-pages npm run build
```

See [nitro.build/deploy](https://nitro.build/deploy) for all available presets.

## Linting & formatting

```bash
npm run lint
npm run format
npm run check
```

Uses [Biome](https://biomejs.dev/).

## Adding UI components

```bash
npx shadcn@latest add <component>
```

## Routing

File-based routing via [TanStack Router](https://tanstack.com/router). Routes live in `src/routes/` using folder-based convention — each route is a folder with an `index.tsx` inside.

Dynamic routes: `/convert/$format` and `/blog/$slug`. Both are prerendered at build time from `lib/conversion-formats.ts` and `lib/blog-posts.ts` respectively via `vite.config.ts`.

`routeTree.gen.ts` is auto-generated — do not edit it manually. It regenerates on dev server start.
