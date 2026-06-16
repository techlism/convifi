import { createFileRoute } from '@tanstack/react-router'
import { SITE_URL, SITE_OG_IMAGE } from '@/lib/site'
import ImageCompressor from '@/components/ImageCompressor'
import { Lock, CheckCircle, Lightning, DeviceMobile } from '@phosphor-icons/react'

export const Route = createFileRoute('/compress-images/')({
  component: CompressImagesPage,
  head: () => ({
    meta: [
      { title: 'Compress Images Free — No Upload, Instant Results | Convifi' },
      {
        name: 'description',
        content:
          'Compress JPEG, PNG, WebP and BMP images instantly in your browser. No upload, no server, no account. Reduce photo file size without visible quality loss.',
      },
      {
        name: 'keywords',
        content:
          'compress image online free, image compressor no upload, reduce image file size, compress jpeg online, compress png free, compress photo without losing quality, image size reducer online, bulk image compressor, compress image for web, reduce photo size free',
      },
      { property: 'og:title', content: 'Compress Images Free — No Upload | Convifi' },
      { property: 'og:description', content: 'Compress JPEG, PNG, WebP and BMP images instantly in your browser. No upload, no server, 100% private.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${SITE_URL}/compress-images` },
      { property: 'og:image', content: SITE_OG_IMAGE },
      { property: 'og:image:alt', content: 'Compress Images Free — Convifi' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Compress Images Free — No Upload | Convifi' },
      { name: 'twitter:description', content: 'Compress JPEG, PNG, WebP images instantly in your browser. Nothing uploaded.' },
      { name: 'twitter:image', content: SITE_OG_IMAGE },
      { name: 'robots', content: 'index, follow' },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/compress-images` }],
  }),
})

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Image Compressor — Compress Images Free',
  url: `${SITE_URL}/compress-images`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (browser-based)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Compress JPEG, PNG, WebP and BMP images instantly in your browser. No upload required.',
}

const faqItems = [
  {
    q: 'Does image compression reduce visible quality?',
    a: 'At moderate compression (60–85% quality), the difference is invisible on screen. Only at very high compression does softening appear. For web use, you typically cannot tell the difference.',
  },
  {
    q: 'How much smaller will my image get?',
    a: 'Usually 50–80% size reduction with no visible quality loss. A 4 MB phone photo typically compresses to under 500 KB. PNG files with large solid-colour areas compress more than detailed photographs.',
  },
  {
    q: 'Can I compress multiple images at once?',
    a: 'Yes — you can add multiple images and compress them together. Each is processed independently in your browser.',
  },
  {
    q: 'What formats are supported?',
    a: 'Input: JPEG, PNG, WebP, BMP. Output: JPEG or WebP, both of which achieve significant size reductions.',
  },
  {
    q: 'Is it free? Do my images get uploaded?',
    a: "It's completely free. Your images are never uploaded — everything runs locally in your browser. You can verify this by checking the Network tab in DevTools while compressing.",
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

function CompressImagesPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Compress Images — Free, No Upload</h1>
        <p className="text-muted-foreground text-sm mb-5">
          Runs entirely in your browser. Nothing is sent to any server.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-xs font-medium">
          {[
            { icon: <Lock size={13} />, label: 'No upload, 100% private' },
            { icon: <CheckCircle size={13} />, label: 'Free forever' },
            { icon: <Lightning size={13} />, label: 'Instant, no queue' },
            { icon: <DeviceMobile size={13} />, label: 'Works on any device' },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-muted/50">
              {icon}{label}
            </span>
          ))}
        </div>
      </div>

      <ImageCompressor />

      <section className="mt-12 space-y-10 text-sm text-foreground/80 pb-12">

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">Why compress images</h2>
          <p className="leading-relaxed">
            A photo from a modern phone is 3–6 MB. That's fine in your camera roll but causes real
            problems elsewhere — slow page loads, email rejection, form upload failures, and storage
            costs. Compression brings photos to 200–500 KB with no visible difference on screen,
            making them practical to share, upload, and store.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">Common use cases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Website and blog images', body: 'Large images are the most common cause of slow page loads. Compressing photos before uploading to WordPress, Webflow, or any CMS directly improves Core Web Vitals and Google ranking.' },
              { title: 'Email attachments', body: 'Most email providers cap attachments at 10–25 MB. Compressing a batch of product or event photos keeps emails deliverable and fast to open on mobile.' },
              { title: 'Government and institutional forms', body: 'Online portals for government applications, university admissions, and scholarship submissions often cap uploads at 200–500 KB per document or photo.' },
              { title: 'E-commerce product listings', body: 'Marketplaces like Amazon, Flipkart, and Meesho have maximum image sizes. Smaller images also load faster for buyers on slow connections.' },
            ].map(({ title, body }) => (
              <div key={title} className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">How it works</h2>
          <p className="leading-relaxed">
            The tool uses the browser's native Canvas API to re-encode the image at a lower quality
            setting. For JPEG and WebP output, this reduces file size by encoding only the
            perceptually important parts of the image. PNG compression uses lossless deflate, so
            quality is preserved while reducing redundant data. No external libraries or server
            calls are involved.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-foreground mb-4">Frequently asked questions</h3>
          <div className="space-y-4">
            {faqItems.map(({ q, a }) => (
              <div key={q} className="border border-border rounded-lg p-4">
                <p className="font-semibold text-foreground text-sm mb-1">{q}</p>
                <p className="text-xs leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

      </section>
    </main>
  )
}
