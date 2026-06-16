import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE_URL } from '@/lib/site'

export const Route = createFileRoute('/terms/')({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: 'Terms & Conditions — Convifi' },
      {
        name: 'description',
        content:
          'Terms of use for Convifi. Free to use, no account required — your files are processed locally and never uploaded.',
      },
      { name: 'robots', content: 'index, follow' },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/terms` }],
  }),
})

function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Terms &amp; Conditions</h1>
        <p className="text-sm text-muted-foreground">Last updated: June 2026</p>
      </header>

      <article className="space-y-8 text-foreground/80 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Using Convifi</h2>
          <p>
            Convifi is a free, browser-based file conversion tool. By using the site you agree
            to these terms. There's no account, no registration, and no fee — just convert
            your files and go.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Your files</h2>
          <p>
            All file processing happens locally in your browser. No file data is transmitted
            to any Convifi server. You retain full ownership of your files and any output you
            generate. Convifi makes no claim over the content of files you process on this
            site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Acceptable use</h2>
          <p>
            You agree to use Convifi only with files you have the right to process. Specifically:
          </p>
          <ul className="mt-3 space-y-1.5 pl-5 list-disc">
            <li>Don't use Convifi to process or redistribute copyrighted content you don't have a licence for.</li>
            <li>Don't use Convifi to generate content that is illegal in your jurisdiction.</li>
            <li>Don't attempt to abuse, scrape, or disrupt the service in ways that affect other users.</li>
          </ul>
          <p className="mt-3">
            Since all processing is local, Convifi has no visibility into what files you
            convert — but we ask you to use the tool responsibly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">No warranty</h2>
          <p>
            Convifi is provided as-is, free of charge. We make no guarantees about the
            accuracy, reliability, or fitness for any particular purpose of the conversion
            output. Always keep a copy of your original files before converting — particularly
            for important documents or irreplaceable media.
          </p>
          <p className="mt-3">
            Some conversions involve lossy compression. Check the output quality before
            deleting source files.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, Convifi and its creator shall not be
            liable for any loss of data, loss of quality, or any other damages arising from
            the use of this service. Use Convifi at your own risk for critical files.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Third-party software</h2>
          <p>
            Convifi uses open-source libraries including FFmpeg, libvips, and Pandoc, all
            compiled to WebAssembly. These are distributed under their respective open-source
            licences. The background removal model is provided by IMG.LY under its respective
            licence.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Changes to these terms</h2>
          <p>
            We may update these terms occasionally. Continued use of Convifi after any update
            constitutes acceptance of the revised terms. The date at the top of this page
            reflects when the terms were last changed.
          </p>
        </section>

      </article>

      <div className="mt-10 pt-8 border-t border-border">
        <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">
          Read our Privacy Policy →
        </Link>
      </div>
    </main>
  )
}
