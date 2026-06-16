import { createFileRoute } from '@tanstack/react-router'
import { SITE_URL } from '@/lib/site'

export const Route = createFileRoute('/about/')({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: 'About Convifi — Browser-Based File Conversion' },
      {
        name: 'description',
        content:
          'Learn how Convifi converts, compresses, and transforms files entirely in your browser using WebAssembly — no upload, no server, no account.',
      },
      { name: 'robots', content: 'index, follow' },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/about` }],
  }),
})

function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-3">About Convifi</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          A browser-based tool for converting, compressing, and transforming files — without
          uploading them anywhere.
        </p>
      </header>

      <article className="space-y-8 text-foreground/80 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">What I built and why</h2>
          <p>
            I got tired of uploading files to random websites just to convert them. You pick a
            file, it goes to their server, you wait, you download — and somewhere in that
            process your file is sitting on infrastructure you know nothing about. For a quick
            MP4 to MP3 that's annoying. For a meeting recording or a financial document, it's
            worse.
          </p>
          <p className="mt-3">
            So I built Convifi. Pick a file, it converts in your browser, you download the
            result. Nothing leaves your device. No account, no waitlist, no file size nag
            screens.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">How it works</h2>
          <p>
            The whole thing runs on WebAssembly — a format that lets compiled native code run
            inside a browser at near-native speed. I'm not shipping JS ports of these tools;
            I'm shipping the actual tools compiled to WASM so they run on your hardware
            directly.
          </p>
          <p className="mt-3">The main engines I'm using:</p>
          <ul className="mt-3 space-y-2 pl-5 list-disc">
            <li>
              <strong>FFmpeg WASM</strong> — the same FFmpeg that professional video pipelines
              run everywhere, compiled for the browser. Handles every video and audio
              conversion on the site.
            </li>
            <li>
              <strong>wasm-vips (libvips)</strong> — a professional image processing library,
              faster than ImageMagick for most tasks. Handles all image conversions and
              compression.
            </li>
            <li>
              <strong>Pandoc WASM</strong> — the universal document converter. Powers
              Markdown, HTML, DOCX, EPUB, LaTeX, and a dozen other document formats.
            </li>
            <li>
              <strong>@imgly/background-removal</strong> — an AI segmentation model that runs
              locally to remove image backgrounds without sending your photo anywhere.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">The privacy part</h2>
          <p>
            Most online converters are upload-and-process services. You send your file, their
            server converts it, you get the result back. Your file sits on their infrastructure
            the whole time — subject to their retention policy, their security practices, and
            whatever their privacy policy actually says in the small print.
          </p>
          <p className="mt-3">
            I didn't want to build that. Every conversion on Convifi runs inside your
            browser's sandboxed environment. If you open DevTools and watch the Network tab
            during a conversion, you'll see the WASM engine load once (then it caches), and
            then nothing — no upload, no POST request with your file, no server involved at
            any point. The output is generated in your browser's memory and downloaded straight
            to you.
          </p>
          <p className="mt-3">
            This matters most for meeting recordings, medical documents, personal photos, ID
            scans, and financial files — things that shouldn't be sitting on a stranger's
            server even temporarily.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Honest tradeoffs</h2>
          <p>
            Running heavy software in the browser has real limits, and I'd rather be straight
            about them:
          </p>
          <ul className="mt-3 space-y-2 pl-5 list-disc">
            <li>
              <strong>Speed:</strong> WebAssembly runs at roughly 10-20% of native CLI speed.
              Video re-encoding is the most noticeable — a 1 GB MKV might take 5–10 minutes
              where FFmpeg on the command line would take 2–3. For small files the difference
              is hard to notice.
            </li>
            <li>
              <strong>Memory:</strong> Very large files (5 GB+) can exhaust browser memory on
              some systems. For those, HandBrake or the FFmpeg CLI is a better choice.
            </li>
            <li>
              <strong>First load:</strong> The WASM engines are big — FFmpeg is ~30 MB,
              libvips is ~16 MB. They download once and cache, so after the first time
              everything starts immediately. But there's a short wait the very first time you
              use each tool.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">About me</h2>
          <p>
            I'm{' '}
            <a
              href="https://github.com/techlism"
              className="underline underline-offset-4 hover:text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              Kundan
            </a>
            . I built this as a personal project — partly to scratch my own itch, partly to
            see how far WebAssembly can actually go for real-world file manipulation. It's
            free, no ads, and I don't touch your files.
          </p>
          <p className="mt-3">
            If something's broken or a format you need isn't supported, find me on{' '}
            <a
              href="https://github.com/techlism/convifi"
              className="underline underline-offset-4 hover:text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </section>

      </article>
    </main>
  )
}
