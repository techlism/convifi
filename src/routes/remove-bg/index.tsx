import { createFileRoute } from '@tanstack/react-router'
import BackgroundRemover from '@/components/BackgroundRemover'
import { Lock, CheckCircle, Lightning, DeviceMobile } from '@phosphor-icons/react'

export const Route = createFileRoute('/remove-bg/')({
  component: RemoveBgPage,
  head: () => ({
    meta: [
      { title: 'Remove Background from Image Free — No Upload | Convifi' },
      {
        name: 'description',
        content:
          'Remove image background instantly in your browser using AI. No upload, no account, 100% private. Works for product photos, profile pictures, ID photos, and more.',
      },
      {
        name: 'keywords',
        content:
          'remove background from image free, background remover no upload, remove image background online, transparent background maker, remove bg free, product photo background remover, ai background remover browser, remove white background from image, background eraser free online, passport photo background remover',
      },
      { property: 'og:title', content: 'Remove Background from Image Free — No Upload | Convifi' },
      { property: 'og:description', content: 'AI background removal that runs entirely in your browser. No upload, no account, no waiting.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://convifi.com/remove-bg' },
      { property: 'og:image', content: 'https://convifi.com/opengraph.png' },
      { property: 'og:image:alt', content: 'Remove Image Background Free — Convifi' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Remove Background from Image Free — No Upload' },
      { name: 'twitter:description', content: 'AI background removal in your browser. No upload, no account, instant results.' },
      { name: 'twitter:image', content: 'https://convifi.com/opengraph.png' },
      { name: 'robots', content: 'index, follow' },
    ],
    links: [{ rel: 'canonical', href: 'https://convifi.com/remove-bg' }],
  }),
})

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Background Remover — Remove Image Background Free',
  url: 'https://convifi.com/remove-bg',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (browser-based)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Remove image backgrounds instantly using AI that runs entirely in your browser. No upload required.',
}

const faqItems = [
  {
    q: 'Does the image get uploaded to remove the background?',
    a: 'No. The AI model is downloaded to your browser once and runs locally. Your image never leaves your device.',
  },
  {
    q: 'What types of images work best?',
    a: 'Product photos on plain backgrounds, portraits, and objects with clear edges work best. Complex scenes where the subject and background have similar colours are harder.',
  },
  {
    q: 'Why is it slow on my phone?',
    a: 'Running AI inference is CPU-intensive. High-end phones work but take 15–30 seconds. Older or low-RAM devices may fail. A laptop gives the best experience.',
  },
  {
    q: 'What format does the output come in?',
    a: 'PNG with a transparent background. You can place it on any colour in Canva, Figma, PowerPoint, or any design tool that supports transparency.',
  },
  {
    q: "Is it free? How is it different from remove.bg?",
    a: "It's completely free with no usage limits. Remove.bg and similar services are free for a limited number of images, charge above that, and send your images to their servers. This tool is unlimited and entirely local.",
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

function RemoveBgPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Remove Image Background — Free, No Upload</h1>
        <p className="text-muted-foreground text-sm mb-5">
          AI runs in your browser. Nothing is sent to any server.
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

      <p className="text-yellow-600 dark:text-yellow-400 font-semibold text-xs text-center mb-6">
        Due to resource constraints, this may not work on mobile phones.
      </p>

      <BackgroundRemover />

      <section className="mt-12 space-y-10 text-sm text-foreground/80 pb-12">

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">Why local AI background removal</h2>
          <p className="leading-relaxed">
            Most background removers — remove.bg, Canva, Adobe Express — send your image to a
            server to process it. For product photos you haven't launched yet, ID photos, or
            anything sensitive, local processing is the safer default. Convifi downloads the AI
            model once and runs it entirely on your device.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">What it's used for</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Product photography', body: 'E-commerce listings on Amazon, Flipkart, Etsy, and Shopify require product images on white or transparent backgrounds. Removing the background from a phone photo saves a studio shoot.' },
              { title: 'Profile pictures', body: 'LinkedIn, company directories, and conference badges look cleaner with a plain or branded background. Remove the background and drop the subject onto any colour.' },
              { title: 'ID and passport photos', body: 'Many official photo requirements specify a plain white background. If your photo was taken outdoors or in front of a wall, this removes the background so you can place it on white.' },
              { title: 'Presentations and design', body: 'Cut objects out of photos to use in slide decks, banners, thumbnails, or social media graphics without needing Photoshop or Figma access.' },
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
            The tool uses a lightweight segmentation model compiled to WebAssembly and run in your
            browser via ONNX Runtime Web. The model identifies the foreground subject using learned
            visual features, masks out the background pixels, and exports the result as a PNG with
            transparency. The first use downloads the model — subsequent uses are instant since
            it's cached in your browser.
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
