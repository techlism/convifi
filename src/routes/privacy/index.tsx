import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy/')({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: 'Privacy Policy — Convifi' },
      {
        name: 'description',
        content:
          'Convifi processes all files locally in your browser. No file data is ever uploaded to any server.',
      },
      { name: 'robots', content: 'index, follow' },
    ],
    links: [{ rel: 'canonical', href: 'https://convifi.com/privacy' }],
  }),
})

function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: June 2026</p>
      </header>

      <article className="space-y-8 text-foreground/80 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">The short version</h2>
          <p>
            Your files never leave your device. Convifi processes everything locally in your
            browser using WebAssembly. No file data is transmitted to any server at any point
            during conversion, compression, or any other operation on this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">File processing</h2>
          <p>
            Every file you open on Convifi is processed entirely within your browser's
            sandboxed environment. The conversion engines (FFmpeg, libvips, Pandoc, and the
            background removal AI) are downloaded to your browser once and run locally on your
            hardware. Your file data is held in browser memory, processed there, and the
            output is generated locally — no part of this involves a network request containing
            your file content.
          </p>
          <p className="mt-3">
            You can verify this yourself: open your browser's DevTools (F12), go to the
            Network tab, and watch a conversion run. You'll see the WASM engine files load,
            and then no further network activity involving your file.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">What we do collect</h2>
          <p>
            We use standard web analytics to understand which pages and tools are used most.
            This includes anonymised data like page views, country, browser type, and referrer.
            No personally identifiable information is collected, and no file content is ever
            included in analytics data.
          </p>
          <p className="mt-3">
            We do not use cookies for tracking, do not run advertising networks, and do not
            sell or share any data with third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Third-party services</h2>
          <p>
            Convifi is hosted on a standard web host that serves the HTML, JavaScript, and
            WASM files to your browser. The host may log standard server access logs (IP
            address, timestamp, URL requested) as is normal for any web server. These logs do
            not contain your file content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Children's privacy</h2>
          <p>
            Convifi does not knowingly collect any information from children under 13. The
            service has no registration, no accounts, and no data collection beyond basic
            analytics.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Changes to this policy</h2>
          <p>
            If we ever make material changes to this policy, the updated date at the top of
            this page will change. Given the nature of the service (no file uploads, no
            accounts), we don't anticipate significant changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Questions</h2>
          <p>
            If you have any questions about how Convifi handles data, open an issue on{' '}
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

      <div className="mt-10 pt-8 border-t border-border">
        <Link to={"/terms" as any} className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">
          Read our Terms &amp; Conditions →
        </Link>
      </div>
    </main>
  )
}
