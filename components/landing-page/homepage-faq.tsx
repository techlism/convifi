import { motion } from "framer-motion"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

const faqs = [
  {
    q: 'Is Convifi actually free?',
    a: 'Yes — no account, no trial period, no payment. Every tool on the site is free to use.',
  },
  {
    q: 'Are my files safe? Does anything get uploaded?',
    a: 'Nothing is uploaded. Convifi runs entirely in your browser using WebAssembly. Your files are processed in memory on your own device and never sent anywhere. You can verify this yourself by watching the Network tab in DevTools during a conversion — no file data leaves your browser.',
  },
  {
    q: 'What formats are supported?',
    a: 'Over 100 format pairs across video (MP4, MKV, AVI, MOV, WebM), audio (MP3, WAV, FLAC, OGG, AAC, M4A), image (JPEG, PNG, WebP, SVG, BMP, TIFF), and documents (Markdown, DOCX, HTML, EPUB, LaTeX, and more).',
  },
  {
    q: 'Does it work on iPhone or iPad?',
    a: 'Yes. Convifi works in Safari on iPhone and iPad — no app download needed. Open the site, pick your file from Photos or Files, and convert. Works the same as on desktop.',
  },
  {
    q: 'How long does conversion take?',
    a: "For images and audio it's usually a few seconds. For video, WebAssembly runs at roughly 10-20% of native speed — a 500 MB video might take 3–5 minutes depending on your device. Large files are faster on a laptop or desktop than on a phone.",
  },
]

export function HomepageFAQ() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Common questions
          </motion.h2>
          <motion.p
            className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need to know before you convert.
          </motion.p>
        </div>

        <motion.div
          className="bg-card shadow-sm rounded-xl border border-border/50 px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`item-${i}`}>
                <AccordionTrigger className="text-base font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
