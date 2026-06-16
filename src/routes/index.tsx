import { createFileRoute } from '@tanstack/react-router'
import { FloatingCards } from '@/components/landing-page/floating-cards'
import { FeatureSection } from '@/components/landing-page/feature-section'
import { TestimonialSection } from '@/components/landing-page/testimonial-section'
import { StatsSection } from '@/components/landing-page/stats-section'
import { motion } from 'framer-motion'
import { FileConversion } from '@/components/landing-page/file-conversion'
import { HomepageFAQ } from '@/components/landing-page/homepage-faq'
import { conversions } from '@/lib/conversion-formats'
import CTA from '@/components/landing-page/cta'
import { useMemo } from 'react'

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [
      { title: 'Convifi — Free File Converter, No Upload Required' },
      {
        name: 'description',
        content:
          'Convert video, audio, image, and document files free in your browser — no upload, no account, 100% private. MKV to MP4, FLAC to MP3, PNG to PDF, and 100+ more formats.',
      },
      { name: 'keywords', content: 'free file converter no upload, mkv to mp4 free, convert flac to mp3, png to pdf free, mov to mp4, avi to mp4, browser based file converter, no upload converter' },
      { property: 'og:title', content: 'Convifi — Free File Converter, No Upload Required' },
      {
        property: 'og:description',
        content: 'Convert video, audio, image, and document files free in your browser — no upload, no account, 100% private.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://convifi.com' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Convifi — Free File Converter, No Upload Required' },
      { name: 'twitter:description', content: 'Convert files free in your browser — no upload, no account, 100% private.' },
      { property: 'og:image', content: 'https://convifi.com/opengraph.png' },
      { property: 'og:image:alt', content: 'Convifi — Free File Converter, No Upload Required' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:image', content: 'https://convifi.com/opengraph.png' },
      { name: 'twitter:image:alt', content: 'Convifi — Free File Converter, No Upload Required' },
      { name: 'robots', content: 'index, follow' },
    ],
    links: [{ rel: 'canonical', href: 'https://convifi.com' }],
  }),
})

const PARTICLES = [
  { id: 0, width: 27, height: 31, left: 5,  top: 11, duration: 12, xOffset: -10 },
  { id: 1, width: 34, height: 20, left: 22, top: 64, duration: 23, xOffset: 15 },
  { id: 2, width: 41, height: 28, left: 47, top: 33, duration: 17, xOffset: -5 },
  { id: 3, width: 25, height: 45, left: 68, top: 78, duration: 28, xOffset: 20 },
  { id: 4, width: 38, height: 22, left: 81, top: 19, duration: 14, xOffset: -20 },
  { id: 5, width: 30, height: 37, left: 93, top: 52, duration: 21, xOffset: 8 },
]

function HomepageSchema() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Convifi',
      url: 'https://convifi.com',
      description: 'Free browser-based file converter — no upload, no account required.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://convifi.com/convert/{format}',
        'query-input': 'required name=format',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Convifi',
      url: 'https://convifi.com',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any (browser-based)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description:
        'Convert video, audio, image, and document files free in your browser. No upload, no account. Supports MKV to MP4, FLAC to MP3, PNG to PDF, and 100+ format pairs.',
      featureList: [
        'No file upload — 100% local processing',
        'Supports 100+ format pairs',
        'Video conversion: MKV, AVI, MOV, WebM, MP4',
        'Audio conversion: FLAC, MP3, WAV, OGG, AAC',
        'Image conversion: PNG, JPEG, WebP, SVG, PDF',
        'Document conversion: Markdown, DOCX, HTML, EPUB',
        'Free, no account required',
        'Works on iPhone, Mac, Windows, Android',
      ],
    },
  ]

  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

function Home() {
  const particles = useMemo(() => PARTICLES, [])

  return (
    <main className="max-w-7xl w-full mx-auto my-auto">
      <HomepageSchema />

      <section className="relative py-10 md:py-20 overflow-hidden">
        <motion.div
          className="relative h-100 mb-6 mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <FloatingCards />
        </motion.div>

        <motion.div
          className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl z-0"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-[10%] w-72 h-72 rounded-full bg-accent/5 blur-3xl z-0"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        <div className="absolute inset-0 overflow-hidden z-0">
          {particles.map((p) => (
            <motion.div
              key={`float-${p.id}`}
              className="absolute rounded-full bg-primary/10"
              style={{ width: `${p.width}px`, height: `${p.height}px`, left: `${p.left}%`, top: `${p.top}%` }}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: [0, 0.5, 0], y: [100, -100], x: [0, p.xOffset] }}
              transition={{ duration: p.duration, repeat: Number.POSITIVE_INFINITY, delay: p.id * 2, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="relative px-4 md:px-6 z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16 md:mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary border border-primary/20 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Fast. Secure. Local.
            </motion.div>
            <motion.h1
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-6xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Convert, Compress and <span className="text-primary">Chill.</span>
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Convert and compress your files instantly, all done securely on your device with no uploads or data sharing.
            </motion.p>
            <CTA />
          </motion.div>
        </div>
      </section>

      <FileConversion conversions={conversions} />
      <FeatureSection />
      <HomepageFAQ />
      <TestimonialSection />
      <StatsSection />
    </main>
  )
}
