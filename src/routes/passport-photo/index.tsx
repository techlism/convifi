import { createFileRoute } from '@tanstack/react-router'
import { SITE_URL, SITE_OG_IMAGE } from '@/lib/site'
import PassportPhotoTool from '@/components/passport-photo/PassportPhotoTool'
import { Lock, CheckCircle, Lightning, DeviceMobile } from '@phosphor-icons/react'

export const Route = createFileRoute('/passport-photo/')({
  component: PassportPhotoPage,
  head: () => ({
    meta: [
      { title: 'Passport Size Photo Maker — Free, Print-Ready, No Upload | Convifi' },
      {
        name: 'description',
        content:
          'Make passport photos at home for free. Crop to exact country dimensions (UK, US, Schengen, India, Canada, UAE and more), adjust brightness and contrast, add borders, tile on A4 at 300 DPI, and download as PNG or PDF — everything runs in your browser, nothing uploaded.',
      },
      {
        name: 'keywords',
        content:
          'passport photo maker online free, make passport photo at home, print passport photos at home, passport size photo online, uk passport photo online, us passport photo free, india passport photo online, schengen visa photo maker, id photo maker, visa photo online free, passport photo a4 print, passport photo pdf download, passport photo no watermark, passport photo without background studio, crop passport photo online',
      },
      { property: 'og:title', content: 'Passport Photo Maker — Free, Print-Ready, No Upload' },
      {
        property: 'og:description',
        content:
          'Crop, adjust, size, and tile passport photos on A4 at 300 DPI. Supports UK, US, Schengen, India, UAE and more. Free, private, nothing uploaded.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${SITE_URL}/passport-photo` },
      { property: 'og:image', content: SITE_OG_IMAGE },
      { property: 'og:image:alt', content: 'Passport Photo Maker — Convifi' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Passport Photo Maker — Free, Print-Ready, No Upload' },
      {
        name: 'twitter:description',
        content:
          'Make print-ready passport photos at home for free. Crop, adjust, pick country size, download PNG or PDF.',
      },
      { name: 'twitter:image', content: SITE_OG_IMAGE },
      { name: 'robots', content: 'index, follow' },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/passport-photo` }],
  }),
})

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Passport Photo Maker — Free, Print-Ready',
  url: `${SITE_URL}/passport-photo`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (browser-based)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'Make passport photos at home for free. Crop to exact country dimensions, adjust brightness and contrast, tile on A4 at 300 DPI, and download as PNG or PDF. Nothing is uploaded.',
}

const faqItems = [
  {
    q: 'Can I make a passport photo at home for free?',
    a: 'Yes — upload a clear photo with a plain background, use the crop tool to frame your head and shoulders, pick your country standard, and download the A4 print sheet. Many chemists and print shops will print an A4 page for under £1.',
  },
  {
    q: 'What size is a UK passport photo?',
    a: 'A UK passport photo must be 35 mm wide × 45 mm tall. The head should fill 70–80% of the frame height. The tool presets this size automatically when you choose "UK / Schengen".',
  },
  {
    q: 'What size is a US passport photo?',
    a: 'A US passport photo must be 2 × 2 inches (50.8 × 50.8 mm), with the head between 1 and 1⅜ inches (25–35 mm) from the bottom of the chin to the top of the head. Select "US Passport" in the preset dropdown.',
  },
  {
    q: 'What size is an Indian passport photo?',
    a: 'An Indian passport photo must be 35 mm × 45 mm with a white background, following the ICAO standard. The India Passport preset is pre-configured to this size.',
  },
  {
    q: 'How many photos fit on an A4 sheet?',
    a: 'At the UK 35 × 45 mm size with a 3 mm gap, 5 photos fit per row and up to 6 rows fit on a single A4 page — 30 photos in total at maximum density. The tool computes and defaults to the maximum that physically fits for your chosen size.',
  },
  {
    q: 'Is the output print-quality?',
    a: 'Yes — the downloaded PNG and PDF are rendered at 300 DPI on a full A4 canvas (2480 × 3508 px). This is the standard resolution expected by photo labs and home printers for sharp, print-ready results.',
  },
  {
    q: 'Does anything get uploaded?',
    a: 'Nothing is uploaded. The entire process — cropping, adjustments, tiling, and PDF generation — runs locally in your browser. You can disconnect from the internet after the page loads and it will still work.',
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

function PassportPhotoPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Passport Photo Maker — Free, No Upload</h1>
        <p className="text-muted-foreground text-sm mb-5">
          Free passport photos you can print at home. No account, no upload, no watermark.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-xs font-medium">
          {[
            { icon: <Lock size={13} />, label: 'No upload, 100% private' },
            { icon: <CheckCircle size={13} />, label: 'Free forever' },
            { icon: <Lightning size={13} />, label: 'Print-ready 300 DPI' },
            { icon: <DeviceMobile size={13} />, label: 'Works on any device' },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-muted/50">
              {icon}{label}
            </span>
          ))}
        </div>
      </div>

      <PassportPhotoTool />

      <section className="mt-12 space-y-10 text-sm text-foreground/80 pb-12">

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-5">How to make a passport photo at home</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Upload your photo', body: 'Use a recent photo against a plain light background. Works with phone camera shots.' },
              { step: '2', title: 'Crop & adjust', body: 'Select your country, frame the shot, and tweak brightness or contrast if needed.' },
              { step: '3', title: 'Download & print', body: 'Get a print-ready A4 sheet at 300 DPI. Print at home or take it to any print shop.' },
            ].map(({ step, title, body }) => (
              <div key={step} className="border border-border rounded-lg p-4 flex flex-col gap-2">
                <span className="text-2xl font-bold text-primary">{step}</span>
                <p className="font-semibold text-foreground text-sm">{title}</p>
                <p className="text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">Passport photo sizes by country</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'UK & Schengen — 35 × 45 mm', body: 'Required for UK passports and all Schengen visa applications. Head must fill 70–80% of the frame height.' },
              { title: 'US Passport — 2″ × 2″ (50.8 × 50.8 mm)', body: 'Required by the State Department. Square format, head between 1 and 1⅜ inches tall, white or off-white background.' },
              { title: 'India Passport — 35 × 45 mm', body: 'White background, face centred, no shadows or glasses. Follows the ICAO standard used by Passport Seva.' },
              { title: 'Canada — 50 × 70 mm', body: 'IRCC requires a larger 50 × 70 mm photo. Select the Canada preset and the crop ratio adjusts automatically.' },
              { title: 'UAE Visa — 35 × 45 mm', body: 'UAE visa and Emirates ID use the standard 35 × 45 mm ICAO format with a white background.' },
              { title: 'China Visa — 33 × 48 mm', body: 'Slightly narrower than the standard. Required for Chinese visa applications at embassies and consulates.' },
            ].map(({ title, body }) => (
              <div key={title} className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
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
