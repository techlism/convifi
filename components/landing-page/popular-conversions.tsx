import { Link } from '@tanstack/react-router'
import { VideoCamera, SpeakerHigh, Image, FileText } from '@phosphor-icons/react'

const GROUPS = [
  {
    label: 'Video',
    icon: <VideoCamera size={16} />,
    pairs: [
      { from: 'mkv', to: 'mp4', label: 'MKV to MP4' },
      { from: 'avi', to: 'mp4', label: 'AVI to MP4' },
      { from: 'mov', to: 'mp4', label: 'MOV to MP4' },
      { from: 'webm', to: 'mp4', label: 'WebM to MP4' },
      { from: 'mp4', to: 'mp3', label: 'MP4 to MP3' },
      { from: 'mov', to: 'mp3', label: 'MOV to MP3' },
      { from: 'mp4', to: 'wav', label: 'MP4 to WAV' },
      { from: 'mkv', to: 'mp3', label: 'MKV to MP3' },
    ],
  },
  {
    label: 'Audio',
    icon: <SpeakerHigh size={16} />,
    pairs: [
      { from: 'flac', to: 'mp3', label: 'FLAC to MP3' },
      { from: 'wav', to: 'mp3', label: 'WAV to MP3' },
      { from: 'ogg', to: 'mp3', label: 'OGG to MP3' },
      { from: 'mp3', to: 'wav', label: 'MP3 to WAV' },
      { from: 'aac', to: 'mp3', label: 'AAC to MP3' },
      { from: 'm4a', to: 'mp3', label: 'M4A to MP3' },
    ],
  },
  {
    label: 'Image',
    icon: <Image size={16} />,
    pairs: [
      { from: 'png', to: 'pdf', label: 'PNG to PDF' },
      { from: 'jpeg', to: 'pdf', label: 'JPEG to PDF' },
      { from: 'png', to: 'webp', label: 'PNG to WebP' },
      { from: 'svg', to: 'png', label: 'SVG to PNG' },
      { from: 'webp', to: 'png', label: 'WebP to PNG' },
      { from: 'jpeg', to: 'png', label: 'JPEG to PNG' },
    ],
  },
  {
    label: 'Document',
    icon: <FileText size={16} />,
    pairs: [
      { from: 'markdown', to: 'docx', label: 'Markdown to DOCX' },
      { from: 'html', to: 'markdown', label: 'HTML to Markdown' },
      { from: 'docx', to: 'markdown', label: 'DOCX to Markdown' },
      { from: 'markdown', to: 'html', label: 'Markdown to HTML' },
      { from: 'epub', to: 'html', label: 'EPUB to HTML' },
      { from: 'latex', to: 'html', label: 'LaTeX to HTML' },
    ],
  },
]

export function PopularConversions() {
  return (
    <section className="py-16 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2">Popular conversions</h2>
          <p className="text-muted-foreground text-sm">
            All free, all local — pick a format pair and go.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {GROUPS.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-2 mb-4 text-foreground">
                <span className="text-muted-foreground">{group.icon}</span>
                <span className="text-sm font-semibold">{group.label}</span>
              </div>
              <ul className="space-y-2">
                {group.pairs.map((p) => (
                  <li key={`${p.from}-${p.to}`}>
                    <Link
                      to="/convert/$format"
                      params={{ format: `${p.from}-to-${p.to}` }}
                      className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors"
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
