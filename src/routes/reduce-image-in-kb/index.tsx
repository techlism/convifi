import { createFileRoute } from '@tanstack/react-router'
import { SITE_URL, SITE_OG_IMAGE } from '@/lib/site'
import ReduceImageInKB from '@/components/ReduceImageInKB'
import { Lock, CheckCircle, Lightning, DeviceMobile } from '@phosphor-icons/react'

export const Route = createFileRoute('/reduce-image-in-kb/')({
  component: ReduceImageInKBPage,
  head: () => ({
    meta: [
      { title: 'Reduce Image Size to KB — Free, No Upload | Convifi' },
      {
        name: 'description',
        content:
          'Reduce your image to an exact size in KB — 50 KB, 100 KB, 200 KB, or any target. Works in your browser, nothing uploaded. Perfect for government websites, job portals, and online forms.',
      },
      {
        name: 'keywords',
        content:
          'reduce image size in kb, compress image to 100kb, compress image to 200kb, resize image to kb online free, compress photo for government website, image size reducer kb, compress image under 50kb, reduce photo size online free no upload, image kb reducer, compress image for job application',
      },
      { property: 'og:title', content: 'Reduce Image Size to KB — Free, No Upload | Convifi' },
      { property: 'og:description', content: 'Set a target size in KB and get as close as possible — instantly, in your browser. No upload, no account.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${SITE_URL}/reduce-image-in-kb` },
      { property: 'og:image', content: SITE_OG_IMAGE },
      { property: 'og:image:alt', content: 'Reduce Image to KB — Convifi' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Reduce Image Size to KB — Free, No Upload' },
      { name: 'twitter:description', content: 'Compress any image to an exact KB target in your browser. Nothing uploaded.' },
      { name: 'twitter:image', content: SITE_OG_IMAGE },
      { name: 'robots', content: 'index, follow' },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/reduce-image-in-kb` }],
  }),
})

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Image Size Reducer — Reduce to KB',
  url: `${SITE_URL}/reduce-image-in-kb`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (browser-based)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Reduce any image to an exact target size in KB. Works locally in your browser — no file upload required.',
}

const faqItems = [
  {
    q: 'How do I reduce an image to 100 KB?',
    a: 'Upload your image, type 100 in the target KB field, and click compress. The tool adjusts quality automatically until the output is at or under 100 KB.',
  },
  {
    q: 'Can I compress an image to exactly 20 KB for a signature upload?',
    a: 'Yes — set the target to 20 and upload your signature image. Very small targets may affect sharpness, but the output will meet the size requirement.',
  },
  {
    q: 'What formats are supported?',
    a: 'Input: JPEG, PNG, WebP, BMP. Output is JPEG, which gives the best compression ratios for photographs and scanned documents.',
  },
  {
    q: 'Will quality be affected?',
    a: 'At targets above 50 KB, most photos compress with no visible quality difference. Below 20 KB, some softening is unavoidable — this is a physical limit of JPEG compression.',
  },
  {
    q: "Is it free? Does anything get uploaded?",
    a: "It's completely free. Nothing is uploaded — the image is processed entirely in your browser memory. You can disconnect from the internet after the page loads and it will still work.",
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

function ReduceImageInKBPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Reduce Image Size to KB — Free, No Upload</h1>
        <p className="text-muted-foreground text-sm mb-5">
          Set a target in KB — 50, 100, 200, or any value. Runs entirely in your browser.
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

      <ReduceImageInKB />

      <section className="mt-12 space-y-10 text-sm text-foreground/80 pb-12">

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">When you need an exact file size</h2>
          <p className="leading-relaxed">
            Most image tools let you pick a quality level, but that doesn't guarantee a specific
            file size. This tool works differently — you enter the KB limit you need, and it
            compresses until it gets there. Useful when a form says "file must be under 100 KB"
            and guessing quality percentages wastes time.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">Common use cases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Government portals', body: 'Passport, Aadhaar, voter ID, PAN, and most government job portals require photos under 50 KB and signatures under 20 KB. The form rejects anything larger with no guidance on how to fix it.' },
              { title: 'Job applications and HR portals', body: 'Naukri, Shine, and many corporate application systems have a profile photo limit of 100–200 KB. Uploading a phone camera photo (3–5 MB) directly will fail.' },
              { title: 'Email attachments', body: 'Sending multiple product photos or scanned documents by email is faster when each image is under 200 KB. Reduces email size from MBs to KBs without visible quality loss.' },
              { title: 'Online forms with upload limits', body: 'University admissions, scholarship portals, and bank KYC forms commonly cap document scans at 100–500 KB per file.' },
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
            The tool uses a binary search on JPEG quality — it tries quality 85, checks the
            resulting file size, then adjusts up or down until it lands within a few KB of your
            target. All done in your browser using the Canvas API and Blob compression, with no
            external requests at any point.
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
