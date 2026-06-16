import { createFileRoute } from '@tanstack/react-router'
import { SITE_URL, SITE_OG_IMAGE } from '@/lib/site'
import { conversions } from '@/lib/conversion-formats'
import type { Conversion } from '@/lib/conversion-formats'

import ConverterInfoSection, { ConverterRichSection } from '@/components/ConverterInfoSection'
import VideoProperties from '@/components/VideoConverterwithProperties'
import VideoToAudioConverter from '@/components/VideoToAudioConverter'
import AudioConverterWithProperties from '@/components/AudioConverterwithProperties'
import ImageConverter from '@/components/ImageConverter'
import UnsupportedFormat from '@/components/UnsuportedFormat'
import PandocConverter from '@/components/DocumentConverter'
import DocumentConverterInfoSection from '@/components/DocumentConverterInfoSection'

const VIDEO_TO_AUDIO_TARGETS = new Set(['mp3', 'wav'])

export const Route = createFileRoute('/convert/$format')({
  component: ConvertPage,
  head: ({ params }) => {
    const format = params.format
    const [from, to] = format.toLowerCase().split('-to-')
    const conversion = conversions.find(
      (c) => c.from.toLowerCase() === from && c.to.toLowerCase() === to
    )
    if (!conversion) return { meta: [] }
    const m = conversion.metadata
    return {
      meta: [
        { title: m.title },
        { name: 'description', content: m.description },
        { name: 'keywords', content: m.keywords },
        { property: 'og:title', content: m.openGraph?.title },
        { property: 'og:description', content: m.openGraph?.description },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: m.twitter?.title },
        { name: 'twitter:description', content: m.twitter?.description },
        { property: 'og:image', content: SITE_OG_IMAGE },
        { property: 'og:image:alt', content: m.openGraph?.title ?? 'Convifi File Converter' },
        { name: 'twitter:image', content: SITE_OG_IMAGE },
        { name: 'twitter:image:alt', content: m.twitter?.title ?? 'Convifi File Converter' },
        { name: 'robots', content: 'index, follow' },
      ].filter((tag) => Object.values(tag).every((v) => v)),
      links: [{ rel: 'canonical', href: `${SITE_URL}/convert/${format}` }],
    }
  },
})

function RenderConverter({ to, from, type }: { to: string; from: string; type: Conversion['type'] }) {
  switch (type) {
    case 'audio':
      return (
        <div className="w-full">
          <ConverterInfoSection format={to} primaryFormat={from} />
          <AudioConverterWithProperties format={to} primaryFormat={from} />
          <ConverterRichSection format={to} primaryFormat={from} />
        </div>
      )
    case 'video':
      if (VIDEO_TO_AUDIO_TARGETS.has(to)) {
        return (
          <div className="w-full">
            <VideoToAudioConverter from={from} to={to} />
            <ConverterRichSection format={to} primaryFormat={from} />
          </div>
        )
      }
      return (
        <div className="w-full">
          <ConverterInfoSection format={to} primaryFormat={from} />
          <VideoProperties format={to} primaryFormat={from} />
          <ConverterRichSection format={to} primaryFormat={from} />
        </div>
      )
    case 'image':
      return (
        <div className="w-full">
          <ConverterInfoSection format={to} primaryFormat={from} />
          <ImageConverter format={to} primaryFormat={from} />
          <ConverterRichSection format={to} primaryFormat={from} />
        </div>
      )
    case 'document':
      return (
        <div className="w-full">
          <DocumentConverterInfoSection
            defaultSourceFormat={from}
            defaultTargetFormat={to}
          />
          <PandocConverter
            defaultSourceFormat={from as Parameters<typeof PandocConverter>[0]['defaultSourceFormat']}
            defaultTargetFormat={to as Parameters<typeof PandocConverter>[0]['defaultTargetFormat']}
          />
          <ConverterRichSection format={to} primaryFormat={from} />
        </div>
      )
    default:
      return <UnsupportedFormat />
  }
}

function ConvertPage() {
  const { format } = Route.useParams()

  const pattern = /^[a-z0-9]+-to-[a-z0-9]+$/i
  if (!pattern.test(format)) return <UnsupportedFormat />

  const [from, to] = format.toLowerCase().split('-to-')
  const conversion = conversions.find(
    (c) => c.from.toLowerCase() === from && c.to.toLowerCase() === to
  )

  if (!conversion) return <UnsupportedFormat />

  return (
    <main className="w-full max-w-3xl mx-auto px-4 py-10">
      <RenderConverter
        key={format}
        to={conversion.to.toLowerCase()}
        from={conversion.from.toLowerCase()}
        type={conversion.type}
      />
    </main>
  )
}
