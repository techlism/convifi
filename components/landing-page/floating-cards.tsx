import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { FileText, FileImage, FileVideo, FileAudio, FileZip, File } from "@phosphor-icons/react"

const cardTypes = [
  {
    id: "images",
    title: "Images",
    description: "JPG, PNG, WEBP, SVG",
    icon: FileImage,
    color: "bg-primary/10",
    textColor: "text-primary",
    borderColor: "border-primary/20",
    initialPosition: { x: -100, y: -50, rotate: -5 },
  },
  {
    id: "videos",
    title: "Videos",
    description: "MP4, MOV, AVI, WEBM",
    icon: FileVideo,
    color: "bg-blue-500/10",
    textColor: "text-blue-500-foreground",
    borderColor: "border-blue-500/20",
    initialPosition: { x: 100, y: -120, rotate: 5 },
  },
  {
    id: "audio",
    title: "Audio",
    description: "MP3, WAV, M4A, AAC",
    icon: FileAudio,
    color: "bg-secondary/10",
    textColor: "text-secondary-foreground",
    borderColor: "border-secondary/20",
    initialPosition: { x: -150, y: 100, rotate: 8 },
  },
  {
    id: "documents",
    title: "Documents",
    description: "MARKDOWN, DOCX, CSV",
    icon: File,
    color: "bg-green-500/10",
    textColor: "text-green-500",
    borderColor: "border-green-500/20",
    initialPosition: { x: 180, y: 50, rotate: -8 },
  },
  {
    id: "archives",
    title: "Compress",
    description: "JPEG, JPG, PNG",
    icon: FileZip,
    color: "bg-purple-500/30",
    textColor: "text-purple-500-foreground",
    borderColor: "border-purple-500/40",
    initialPosition: { x: 0, y: 150, rotate: -3 },
  },
]

// Stable pre-computed particle positions to avoid SSR hydration mismatch
const PARTICLES = [
  { ix: -120, iy: 80,   ax: 90,   ay: -150, dur: 12 },
  { ix: 200,  iy: -60,  ax: -180, ay: 120,  dur: 24 },
  { ix: -80,  iy: -200, ax: 150,  ay: 180,  dur: 18 },
  { ix: 180,  iy: 180,  ax: -90,  ay: -100, dur: 30 },
  { ix: -240, iy: 40,   ax: 200,  ay: -80,  dur: 15 },
  { ix: 120,  iy: 220,  ax: -150, ay: 60,   dur: 22 },
  { ix: -160, iy: -120, ax: 100,  ay: 200,  dur: 19 },
  { ix: 240,  iy: -180, ax: -200, ay: -40,  dur: 27 },
  { ix: -200, iy: 160,  ax: 180,  ay: -220, dur: 13 },
  { ix: 60,   iy: -240, ax: -120, ay: 160,  dur: 25 },
  { ix: -100, iy: 240,  ax: 80,   ay: -180, dur: 20 },
  { ix: 220,  iy: 100,  ax: -160, ay: 120,  dur: 16 },
  { ix: -180, iy: -80,  ax: 140,  ay: -200, dur: 28 },
  { ix: 140,  iy: -140, ax: -100, ay: 180,  dur: 11 },
  { ix: -60,  iy: 200,  ax: 200,  ay: -120, dur: 23 },
]

const FloatingCard = ({
  card,
  mousePosition,
  index,
}: {
  card: typeof cardTypes[number]
  mousePosition: { x: number; y: number }
  index: number
}) => {
  const xOffset = useMotionValue(0)
  const yOffset = useMotionValue(0)
  const rotateValue = useMotionValue(card.initialPosition.rotate)

  const x = useSpring(xOffset, { damping: 20, stiffness: 100 })
  const y = useSpring(yOffset, { damping: 20, stiffness: 100 })
  const rotate = useSpring(rotateValue, { damping: 20, stiffness: 100 })

  useEffect(() => {
    const parallaxFactor = 0.02
    const xTarget = card.initialPosition.x - mousePosition.x * parallaxFactor * (index % 2 === 0 ? 1 : -1)
    const yTarget = card.initialPosition.y - mousePosition.y * parallaxFactor * (index % 2 === 0 ? 1 : -1)
    xOffset.set(xTarget)
    yOffset.set(yTarget)
  }, [mousePosition, card.initialPosition.x, card.initialPosition.y, index, xOffset, yOffset])

  return (
    <motion.div
      className={`absolute w-64 p-4 rounded-xl ${card.color} backdrop-blur-sm border ${card.borderColor} shadow-lg`}
      initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
      animate={{
        opacity: 1,
        x: card.initialPosition.x,
        y: card.initialPosition.y,
        rotate: card.initialPosition.rotate,
        transition: { delay: index * 0.2, duration: 0.8, ease: "easeOut" },
      }}
      style={{ x, y, rotate }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${card.color} ${card.textColor}`}>
          <card.icon size={24} />
        </div>
        <div>
          <h3 className={`font-medium ${card.textColor}`}>{card.title}</h3>
          <p className="text-sm text-muted-foreground">{card.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function FloatingCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center perspective"
    >
      <div className="absolute w-[clamp(120px,20vw,160px)] h-[clamp(120px,20vw,160px)] rounded-full bg-primary/5 flex items-center justify-center z-10">
        <div className="absolute w-full h-full rounded-full bg-primary/10 animate-pulse" />
        <div className="relative w-[clamp(80px,15vw,96px)] h-[clamp(80px,15vw,96px)] rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-sm">
          <FileText size={40} className="text-primary" />
        </div>
      </div>

      <div className="absolute max-w-[90vw] max-h-[90vw] w-100 h-87.5 rounded-full border border-border/20 animate-[spin_60s_linear_infinite]" />
      <div className="absolute max-w-[70vw] max-h-[70vw] w-75 h-62.5 rounded-full border border-border/30 animate-[spin_40s_linear_infinite_reverse]" />

      {cardTypes.map((card, index) => (
        <FloatingCard key={card.id} card={card} index={index} mousePosition={mousePosition} />
      ))}

      {PARTICLES.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/40"
          initial={{ opacity: 0, x: p.ix, y: p.iy }}
          animate={{
            opacity: [0, 0.8, 0],
            x: p.ax,
            y: p.ay,
            transition: { duration: p.dur, repeat: Number.POSITIVE_INFINITY, delay: i * 0.5 },
          }}
        />
      ))}
    </div>
  )
}
