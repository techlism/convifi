import { Lock, CheckCircle, DeviceMobile, Lightning, ArrowRight } from "@phosphor-icons/react"
import { Link } from "@tanstack/react-router"

// ── Use-case copy ─────────────────────────────────────────────────────────────

const USE_CASE_MAP: Record<string, string> = {
  'mkv-to-mp4': "MKV files are popular for storing movies and TV shows with multiple subtitle tracks, but most devices can't play them directly. Converting to MP4 makes your video compatible with iPhones, Smart TVs, WhatsApp, and virtually every media player.",
  'avi-to-mp4': "AVI is a legacy Windows format from the 1990s, often found in old camcorder recordings and CCTV footage. MP4 is universally compatible and up to 50% smaller — ideal for sharing, uploading, or archiving those old videos.",
  'mov-to-mp4': "MOV is the native format on iPhones and Macs — great for recording, but it won't play on Windows or Android without extra software. Converting to MP4 makes your video shareable on any device or platform.",
  'webm-to-mp4': "WebM is a browser-native format used by YouTube downloads and screen recordings. It won't play on iPhones or most TVs. Converting to MP4 gives you a universally compatible file that plays everywhere.",
  'flv-to-mp4': "FLV is a dead Flash-era format that browsers no longer support. If you have old Flash videos you want to preserve, converting them to MP4 is the best way to ensure they'll play for years to come.",
  'mp4-to-wav': "Extracting audio from an MP4 as a WAV file gives you lossless, uncompressed audio — ideal for podcast editing, music production, or professional voice-over work. WAV preserves every detail of the original recording.",
  'mov-to-mp3': "If you recorded a song, speech, meeting, or event on your iPhone, converting the MOV video to MP3 gives you a lightweight audio file you can share, upload to Spotify, or keep in your music library.",
  'mp4-to-mp3': "Stripping the audio from an MP4 video as an MP3 is the fastest way to get the soundtrack, podcast recording, or speech out of a video file. MP3 plays everywhere and takes up a fraction of the space.",
  'mkv-to-mp3': "MKV files are often movies or TV shows — converting to MP3 lets you extract the soundtrack or dialogue track for later. Perfect for grabbing a film score or archiving audio.",
  'webm-to-mp3': "WebM is a common format for downloaded web videos and screen recordings. Extracting the audio as MP3 is useful for saving a talk, lecture, or podcast published as a video.",
  'png-to-pdf': "Converting a PNG image to PDF is the standard way to share a document, scan, screenshot, or infographic in a format anyone can open — from a phone to a government office computer.",
  'svg-to-png': "SVG files are vector graphics that look sharp at any size, but most apps, social networks, and messaging platforms don't support them. Converting to PNG gives you a raster image that works everywhere.",
  'png-to-webp': "WebP is Google's modern image format — up to 30% smaller than PNG with the same visual quality. Web developers use it to pass Core Web Vitals and speed up page loads significantly.",
  'webp-to-png': "WebP images often show up when you download images from modern websites. Converting to PNG gives you a format supported by every image editor, from Photoshop to Preview on Mac.",
  'flac-to-mp3': "FLAC files are lossless audio — audiophile quality, but enormous (often 300MB+). Converting to MP3 at 192 or 320 kbps reduces the file to under 10MB while keeping quality indistinguishable to most ears.",
  'markdown-to-docx': "Developers and technical writers love Markdown, but clients, managers, and publishers work in Word. Converting Markdown to DOCX preserves headings, bold, lists, and links in a format your stakeholders can open without extra tools.",
  'jpeg-to-pdf': "Sending an image as a PDF looks more professional and ensures the recipient sees it at the right size — perfect for resumes, scanned forms, and photos you want to share as documents.",
  'jpg-to-pdf': "Sending an image as a PDF looks more professional and ensures the recipient sees it at the right size — perfect for resumes, scanned forms, and photos you want to share as documents.",
  'mp4-to-gif': "GIF files loop automatically and embed in emails, Slack messages, and websites without a play button. Convert a short MP4 clip to GIF to make a reaction, tutorial snippet, or product demo.",
  'gif-to-mp4': "GIF files are surprisingly large — a 2MB GIF often becomes a 100KB MP4 with better quality. MP4 also plays smoothly at higher resolutions and is accepted by Twitter, Instagram, and most platforms.",
  'tiff-to-jpg': "TIFF files from professional cameras and scanners can be 20–100 MB each — too large to email, upload, or share. Converting to JPG brings them down to 1–5 MB with no visible quality difference for screen viewing, while keeping the original TIFF as your archive copy.",
  'tiff-to-jpeg': "TIFF files from professional cameras and scanners can be 20–100 MB each — too large to email, upload, or share. Converting to JPEG brings them down to 1–5 MB with no visible quality difference for screen viewing.",
  'tiff-to-png': "TIFF to PNG conversion keeps your image lossless but in a format that every browser, app, and platform understands. Useful when you need transparency support or want a universally compatible lossless file.",
  'tiff-to-webp': "WebP is 25–35% smaller than JPEG at the same visual quality. Converting TIFF scanner files or RAW exports to WebP is the fastest way to make professional images web-ready without visible quality loss.",
  'jpg-to-tiff': "TIFF is the archival standard for photographers and print workflows. Converting JPG to TIFF gives you a lossless file suitable for high-quality printing, professional editing, or long-term storage.",
  'jpeg-to-tiff': "TIFF is the archival standard for photographers and print workflows. Converting JPEG to TIFF gives you a lossless file suitable for high-quality printing, professional editing, or long-term storage.",
  'png-to-tiff': "TIFF is required by many professional print and publishing workflows. Converting PNG to TIFF makes your image compatible with prepress software, high-DPI printing, and desktop publishing tools.",
  'mkv-to-avi': "AVI is needed for older Windows software, DVD authoring tools, and some legacy media players that pre-date MKV support. Converting from MKV preserves your video while making it compatible with those older systems.",
  'avi-to-mkv': "MKV supports multiple audio tracks, subtitles, and chapters in a single file — useful for archiving old AVI recordings with added subtitle or language tracks. It's also better supported on modern media servers like Plex.",
  'mkv-to-mov': "MOV is the format Apple's editing tools expect. Converting MKV to MOV makes your video ready for iMovie, Final Cut Pro, and other Mac-based editing workflows without compatibility issues.",
  'avi-to-mp3': "AVI files from old camcorders, VHS captures, and home recordings often contain audio you want to preserve separately — a family interview, a live performance, a speech. Converting to MP3 extracts that audio as a small, shareable file.",
  'mkv-to-wav': "Extracting audio from an MKV file as WAV gives you lossless, uncompressed audio — ideal when you need the original sound quality for professional editing, mixing, or archiving a film's dialogue or score.",
}

function getUseCaseCopy(from: string, to: string): string {
  const key = `${from.toLowerCase()}-to-${to.toLowerCase()}`
  return (
    USE_CASE_MAP[key] ??
    `${from.toUpperCase()} and ${to.toUpperCase()} are both widely used formats. Converting between them in your browser is instant, free, and private — no account needed, and your file never leaves your device.`
  )
}

// ── Format descriptions (what is X?) ─────────────────────────────────────────

const FORMAT_DESC: Record<string, string> = {
  mp4: "MP4 (MPEG-4) is the most widely supported video format in the world. It plays natively on every phone, TV, browser, and media player.",
  mkv: "MKV (Matroska) is a container that can hold multiple audio tracks, subtitles, and chapters. Popular for high-quality movie and TV rips.",
  avi: "AVI (Audio Video Interleave) is a legacy Microsoft format from 1992. Still common in old home videos and CCTV recordings.",
  mov: "MOV is Apple's QuickTime format, the default for iPhone and Mac recordings. Excellent quality, but limited compatibility on non-Apple devices.",
  webm: "WebM is Google's open-source video format, designed for web browsers. Common in screen recordings and downloaded web videos.",
  flv: "FLV (Flash Video) was the dominant streaming format before HTML5. Flash is now dead, so FLV files need conversion to play on modern devices.",
  mp3: "MP3 is the universal audio format — small file size, compatible with every device and app on the planet.",
  wav: "WAV (Waveform Audio) is uncompressed, lossless audio used by audio engineers, podcasters, and music producers who need maximum quality.",
  flac: "FLAC (Free Lossless Audio Codec) is lossless audio with smaller files than WAV. Popular with audiophiles and music archivists.",
  aac: "AAC (Advanced Audio Coding) is the standard audio format for Apple devices and streaming. Higher quality than MP3 at the same bitrate.",
  ogg: "OGG/Vorbis is an open-source audio format popular in game development and Linux environments.",
  m4a: "M4A is Apple's audio container using AAC encoding. The default format for iTunes purchases and Apple Music downloads.",
  png: "PNG (Portable Network Graphics) is a lossless image format that supports transparency. Ideal for logos, screenshots, and graphics.",
  jpeg: "JPEG is the most common photo format — small file sizes with adjustable quality. Used by cameras, phones, and the web.",
  jpg: "JPG/JPEG is the most common photo format — small file sizes with adjustable quality. Used by cameras, phones, and the web.",
  webp: "WebP is Google's modern image format, offering 25-35% smaller files than JPEG or PNG with comparable quality.",
  svg: "SVG (Scalable Vector Graphics) is a vector format that stays sharp at any size. Used for logos, icons, and illustrations.",
  gif: "GIF is an animated image format that loops automatically. Widely used for reactions, memes, and short UI demos.",
  bmp: "BMP (Bitmap) is an uncompressed Windows image format. Very large files, mostly used in legacy Windows applications.",
  tiff: "TIFF (Tagged Image File Format) is a lossless format used by professional photographers, scanners, and print workflows.",
  avif: "AVIF is a next-generation image format with significantly better compression than WebP or JPEG.",
  pdf: "PDF (Portable Document Format) is the universal document standard — looks identical on every device and is accepted everywhere.",
  markdown: "Markdown is a lightweight text markup language used by developers and writers. Plain text that renders as formatted HTML.",
  html: "HTML (HyperText Markup Language) is the language of the web — every webpage is HTML at its core.",
  docx: "DOCX is Microsoft Word's format — the most widely used document format in offices and academia worldwide.",
  epub: "EPUB is the standard e-book format, supported by Kindle, Apple Books, Kobo, and most e-readers.",
  latex: "LaTeX is a typesetting system used in academia and research for precise control over document formatting.",
  rst: "reStructuredText (RST) is a markup language used heavily in Python documentation and technical writing.",
  odt: "ODT is OpenDocument Text — the format used by LibreOffice and Google Docs. A fully open alternative to DOCX.",
  rtf: "RTF (Rich Text Format) is a portable document format readable by almost every word processor ever made.",
  ipynb: "IPYNB is Jupyter Notebook format, used by data scientists to combine code, output, and markdown documentation.",
}

function getFormatDesc(fmt: string): string | null {
  return FORMAT_DESC[fmt.toLowerCase()] ?? null
}

// ── Related conversions ───────────────────────────────────────────────────────

const RELATED: Record<string, [string, string][]> = {
  'mkv-to-mp4':       [['AVI', 'MP4'], ['MKV', 'AVI'], ['MP4', 'MKV']],
  'avi-to-mp4':       [['MKV', 'MP4'], ['AVI', 'MKV'], ['WEBM', 'MP4']],
  'mov-to-mp4':       [['MP4', 'MOV'], ['MKV', 'MP4'], ['WEBM', 'MP4']],
  'webm-to-mp4':      [['MKV', 'MP4'], ['AVI', 'MP4'], ['MP4', 'WEBM']],
  'flv-to-mp4':       [['MKV', 'MP4'], ['AVI', 'MP4'], ['WEBM', 'MP4']],
  'mp4-to-wav':       [['MP4', 'MP3'], ['MOV', 'MP3'], ['WEBM', 'MP3']],
  'mov-to-mp3':       [['MP4', 'MP3'], ['MOV', 'MP4'], ['MKV', 'MP3']],
  'mp4-to-mp3':       [['MP4', 'WAV'], ['MOV', 'MP3'], ['WEBM', 'MP3']],
  'mkv-to-mp3':       [['MP4', 'MP3'], ['MKV', 'MP4'], ['WEBM', 'MP3']],
  'png-to-pdf':       [['JPEG', 'PDF'], ['SVG', 'PNG'], ['PNG', 'WEBP']],
  'svg-to-png':       [['PNG', 'WEBP'], ['WEBP', 'PNG'], ['JPEG', 'PNG']],
  'png-to-webp':      [['WEBP', 'PNG'], ['JPEG', 'WEBP'], ['PNG', 'JPEG']],
  'webp-to-png':      [['PNG', 'WEBP'], ['JPEG', 'PNG'], ['WEBP', 'JPEG']],
  'flac-to-mp3':      [['WAV', 'MP3'], ['OGG', 'MP3'], ['MP3', 'FLAC']],
  'markdown-to-docx': [['HTML', 'MARKDOWN'], ['DOCX', 'MARKDOWN'], ['MARKDOWN', 'HTML']],
  'jpeg-to-pdf':      [['PNG', 'PDF'], ['JPEG', 'PNG'], ['JPEG', 'WEBP']],
  'jpg-to-pdf':       [['PNG', 'PDF'], ['JPEG', 'PNG'], ['JPEG', 'WEBP']],
  'mp4-to-gif':       [['GIF', 'MP4'], ['MP4', 'WEBM'], ['MP4', 'MP3']],
  'gif-to-mp4':       [['MP4', 'GIF'], ['MP4', 'WEBM'], ['WEBM', 'MP4']],
}

function getRelated(from: string, to: string): [string, string][] {
  const key = `${from.toLowerCase()}-to-${to.toLowerCase()}`
  return RELATED[key] ?? []
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

function getFAQ(from: string, to: string) {
  const FROM = from.toUpperCase()
  const TO = to.toUpperCase()
  return [
    {
      q: `Is this ${FROM} to ${TO} converter really free?`,
      a: `Yes, completely free. No account, no credit card, no watermark, no file size limit imposed by a paywall. Convifi is free to use forever.`,
    },
    {
      q: `Is my file safe when I convert ${FROM} to ${TO}?`,
      a: `Your file never leaves your device. All conversion happens locally in your browser using WebAssembly. There is no upload to any server — not even Convifi's.`,
    },
    {
      q: `Does this work on iPhone, Mac, and Windows?`,
      a: `Yes. Because it runs in the browser, it works on any device — iPhone, Android, Mac, Windows, or Linux — as long as you have a modern browser like Chrome, Safari, Firefox, or Edge.`,
    },
    {
      q: `How long does ${FROM} to ${TO} conversion take?`,
      a: `Conversion time depends on your file size and device. Most files convert in under 30 seconds. Longer videos or high-resolution images may take a minute or two. Nothing is being sent over the network, so your connection speed has no effect.`,
    },
  ]
}

// ── Structured data ───────────────────────────────────────────────────────────

function StructuredData({ from, to }: { from: string; to: string }) {
  const FROM = from.toUpperCase()
  const TO = to.toUpperCase()

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to convert ${FROM} to ${TO} free online`,
    step: [
      { '@type': 'HowToStep', position: 1, text: `Click "Select File" or drag and drop your ${FROM} file onto the converter.` },
      { '@type': 'HowToStep', position: 2, text: 'The file is processed entirely in your browser — no upload, instant results.' },
      { '@type': 'HowToStep', position: 3, text: `Click Download to save your converted ${TO} file.` },
    ],
  }

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: getFAQ(from, to).map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  )
}

// ── Header (above tool) ───────────────────────────────────────────────────────

export default function ConverterInfoSection({
  format,
  primaryFormat,
}: {
  format: string
  primaryFormat: string
}) {
  const FROM = primaryFormat.toUpperCase()
  const TO = format.toUpperCase()

  return (
    <>
      <StructuredData from={primaryFormat} to={format} />
      <div className="mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Convert {FROM} to {TO} — Free, No Upload
        </h1>
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
    </>
  )
}

// ── Rich section (below tool) ─────────────────────────────────────────────────

export function ConverterRichSection({
  format,
  primaryFormat,
}: {
  format: string
  primaryFormat: string
}) {
  const from = primaryFormat.toLowerCase()
  const to = format.toLowerCase()
  const FROM = from.toUpperCase()
  const TO = to.toUpperCase()
  const useCaseCopy = getUseCaseCopy(from, to)
  const related = getRelated(from, to)
  const fromDesc = getFormatDesc(from)
  const toDesc = getFormatDesc(to)
  const faq = getFAQ(from, to)

  return (
    <section className="mt-12 space-y-10 text-sm text-foreground/80 pb-12">

      {/* Use case */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Why convert {FROM} to {TO}?
        </h2>
        <p className="leading-relaxed">{useCaseCopy}</p>
      </div>

      {/* Format descriptions */}
      {(fromDesc || toDesc) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fromDesc && (
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-1">What is {FROM}?</h3>
              <p className="text-xs leading-relaxed">{fromDesc}</p>
            </div>
          )}
          {toDesc && (
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-1">What is {TO}?</h3>
              <p className="text-xs leading-relaxed">{toDesc}</p>
            </div>
          )}
        </div>
      )}

      {/* Related conversions */}
      {related.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-foreground mb-3">Related converters</h3>
          <div className="flex flex-wrap gap-2">
            {related.map(([f, t]) => {
              const slug = `${f.toLowerCase()}-to-${t.toLowerCase()}`
              return (
                <Link
                  key={slug}
                  to="/convert/$format"
                  params={{ format: slug }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs font-medium hover:bg-muted transition-colors"
                >
                  {f} to {t} <ArrowRight size={11} />
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4">
          Frequently asked questions
        </h3>
        <div className="space-y-4">
          {faq.map(({ q, a }) => (
            <div key={q} className="border border-border rounded-lg p-4">
              <p className="font-semibold text-foreground text-sm mb-1">{q}</p>
              <p className="text-xs leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
