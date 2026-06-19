import { Link } from "@tanstack/react-router"
import { GithubLogo, CaretRight, VideoCamera, SpeakerHigh, Image, FileText, Wrench } from "@phosphor-icons/react"
import DarkModeSwitch from "@/components/DarkModeSwitch"
import { conversions, type Conversion } from "@/lib/conversion-formats"
import { Separator } from "@/components/ui/separator"

const DOC_DISPLAY: Record<string, string> = {
  markdown: "Markdown", html: "HTML", docx: "DOCX", odt: "ODT", epub: "EPUB",
  latex: "LaTeX", rtf: "RTF", rst: "RST", mediawiki: "MediaWiki",
  org: "Org Mode", textile: "Textile", ipynb: "Jupyter Notebook",
}

function displayName(c: Conversion) {
  if (c.type === "document") {
    return {
      from: DOC_DISPLAY[c.from] ?? c.from,
      to:   DOC_DISPLAY[c.to]   ?? c.to,
    }
  }
  return { from: c.from, to: c.to }
}

const POPULAR_VIDEO = [
  ["MKV", "MP4"], ["AVI", "MP4"], ["MOV", "MP4"], ["WEBM", "MP4"],
  ["FLV", "MP4"], ["MP4", "MKV"], ["MP4", "AVI"], ["MP4", "WEBM"],
  ["MP4", "MOV"], ["MKV", "AVI"], ["AVI", "MKV"], ["MKV", "MOV"],
  ["MP4", "MP3"], ["MOV", "MP3"], ["MKV", "MP3"], ["WEBM", "MP3"],
  ["AVI", "MP3"], ["MP4", "WAV"], ["MKV", "WAV"], ["MP4", "GIF"],
]

const POPULAR_AUDIO = [
  ["MP3", "WAV"], ["WAV", "MP3"], ["MP3", "AAC"], ["AAC", "MP3"],
  ["FLAC", "MP3"], ["MP3", "FLAC"], ["OGG", "MP3"], ["MP3", "OGG"],
  ["WAV", "FLAC"], ["FLAC", "WAV"], ["WAV", "OGG"], ["M4A", "MP3"],
]

const POPULAR_IMAGE = [
  ["TIFF", "JPG"], ["TIFF", "PNG"], ["TIFF", "WEBP"],
  ["JPEG", "PNG"], ["PNG", "JPEG"], ["PNG", "WEBP"], ["WEBP", "PNG"],
  ["JPG", "PDF"], ["SVG", "PNG"], ["WEBP", "JPG"], ["BMP", "PNG"],
  ["JPEG", "WEBP"], ["WEBP", "JPEG"], ["JPEG", "PDF"], ["PNG", "PDF"],
]

const POPULAR_DOC = [
  ["markdown", "html"], ["html", "markdown"], ["docx", "markdown"],
  ["docx", "html"], ["markdown", "docx"], ["html", "docx"],
  ["epub", "html"], ["latex", "html"], ["rst", "html"],
  ["odt", "docx"], ["ipynb", "html"], ["epub", "markdown"],
]

function pairKey(from: string, to: string) {
  return `${from.toLowerCase()}::${to.toLowerCase()}`
}

const conversionMap = new Map(
  conversions.map(c => [pairKey(c.from, c.to), c])
)

function ConversionLink({ c }: { c: Conversion }) {
  const { from, to } = displayName(c)
  return (
    <div className="flex items-center gap-1.5">
      <CaretRight size={12} className="text-muted-foreground shrink-0" />
      <Link
        className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors"
        to="/convert/$format"
        params={{ format: `${c.from.toLowerCase()}-to-${c.to.toLowerCase()}` }}
      >
        {from} to {to}
      </Link>
    </div>
  )
}

interface CategorySectionProps {
  icon: React.ReactNode
  label: string
  pairs: string[][]
}

function CategorySection({ icon, label, pairs }: CategorySectionProps) {
  const links = pairs
    .map(([f, t]) => conversionMap.get(pairKey(f, t)))
    .filter((c): c is Conversion => c !== undefined)

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {links.map(c => (
          <ConversionLink key={`${c.from}-${c.to}`} c={c} />
        ))}
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-border bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Brand + category columns */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10 lg:gap-12">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img src="/convifi.svg" alt="Convifi logo" height={32} width={32} className="dark:invert" />
              <span className="text-lg font-semibold">Convifi</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-50">
              Convert, compress, and transform your files locally — no upload, no server.
            </p>
            <a
              href="https://github.com/techlism/convifi"
              className="inline-flex items-center gap-1.5 mt-4 text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              <GithubLogo size={18} />
              <span className="text-xs">GitHub</span>
            </a>
          </div>

          {/* Video */}
          <CategorySection
            icon={<VideoCamera size={15} />}
            label="Video"
            pairs={POPULAR_VIDEO}
          />

          {/* Audio */}
          <CategorySection
            icon={<SpeakerHigh size={15} />}
            label="Audio"
            pairs={POPULAR_AUDIO}
          />

          {/* Image */}
          <CategorySection
            icon={<Image size={15} />}
            label="Image"
            pairs={POPULAR_IMAGE}
          />

          {/* Document */}
          <CategorySection
            icon={<FileText size={15} />}
            label="Document"
            pairs={POPULAR_DOC}
          />

          {/* Tools */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-muted-foreground"><Wrench size={15} /></span>
              <h3 className="text-sm font-semibold text-foreground">Tools</h3>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { to: "/compress-images", label: "Compress Images" },
                { to: "/reduce-image-in-kb", label: "Reduce Image to KB" },
                { to: "/remove-bg", label: "Remove Background" },
                { to: "/passport-photo", label: "Passport Photo" },
                { to: "/blog", label: "Blog & Guides" },
              ].map(({ to, label }) => (
                <div key={to} className="flex items-center gap-1.5">
                  <CaretRight size={12} className="text-muted-foreground shrink-0" />
                  <Link
                    to={to}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors"
                  >
                    {label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy;{new Date().getFullYear()} Convifi. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms &amp; Conditions
            </Link>
            <DarkModeSwitch />
          </div>
        </div>

      </div>
    </footer>
  )
}
