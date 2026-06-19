import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  MinusIcon,
  ImageIcon,
  FilePdfIcon,
  PrinterIcon,
  SpinnerGapIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { createA4Canvas, canvasToA4Pdf, maxPhotosInfo } from "@/lib/passport-utils";
import type { LayoutConfig } from "@/lib/passport-utils";

interface LayoutStepProps {
  photoCanvas: HTMLCanvasElement | null;
  config: LayoutConfig;
  onConfigChange: (c: LayoutConfig) => void;
}

function Counter({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <MinusIcon size={13} />
        </Button>
        <span className="text-lg font-semibold w-6 text-center tabular-nums">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <PlusIcon size={13} />
        </Button>
      </div>
    </div>
  );
}

type DlState = "idle" | "generating" | "done";

export default function LayoutStep({ photoCanvas, config, onConfigChange }: LayoutStepProps) {
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [rendering, setRendering] = useState(false);
  const [pngState, setPngState] = useState<DlState>("idle");
  const [pdfState, setPdfState] = useState<DlState>("idle");

  const { maxPerRow, maxRows } = maxPhotosInfo(config);
  const totalPhotos = config.photosPerRow * config.rows;

  useEffect(() => {
    if (!photoCanvas || !previewRef.current) return;
    setRendering(true);
    requestAnimationFrame(() => {
      try {
        const a4 = createA4Canvas(photoCanvas, config, 0.25);
        const el = previewRef.current!;
        el.width = a4.width;
        el.height = a4.height;
        el.getContext("2d")!.drawImage(a4, 0, 0);
      } finally {
        setRendering(false);
      }
    });
  }, [photoCanvas, config]);

  const set = <K extends keyof LayoutConfig>(key: K) =>
    (v: LayoutConfig[K]) => onConfigChange({ ...config, [key]: v });

  const handleDownloadPng = async () => {
    if (!photoCanvas || pngState === "generating") return;
    setPngState("generating");
    try {
      await new Promise((r) => requestAnimationFrame(r));
      const a4 = createA4Canvas(photoCanvas, config, 1);
      a4.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "passport-photos.png";
        a.click();
        URL.revokeObjectURL(url);
        setPngState("done");
        setTimeout(() => setPngState("idle"), 3000);
      }, "image/png");
    } catch {
      setPngState("idle");
    }
  };

  const handlePrint = async () => {
    if (!photoCanvas) return;
    await new Promise((r) => requestAnimationFrame(r));
    const a4 = createA4Canvas(photoCanvas, config, 1);
    const dataUrl = a4.toDataURL("image/jpeg", 0.95);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.documentElement.innerHTML = `<head>
<style>
  @page { size: A4; margin: 0; }
  body { margin: 0; background: white; }
  img { width: 210mm; height: 297mm; display: block; }
</style>
</head>
<body>
<img src="${dataUrl}" />
<script>window.onload=function(){window.print();window.close();}<\/script>
</body>`;
  };

  const handleDownloadPdf = async () => {
    if (!photoCanvas || pdfState === "generating") return;
    setPdfState("generating");
    try {
      await new Promise((r) => requestAnimationFrame(r));
      const a4 = createA4Canvas(photoCanvas, config, 1);
      const bytes = await canvasToA4Pdf(a4);
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "passport-photos.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setPdfState("done");
      setTimeout(() => setPdfState("idle"), 3000);
    } catch {
      setPdfState("idle");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-1">Sheet layout</h2>
        <p className="text-sm text-muted-foreground">
          {totalPhotos} photo{totalPhotos !== 1 ? "s" : ""} · A4 · 300 DPI
        </p>
      </div>

      {/* A4 preview */}
      <div className="flex justify-center">
        <div className="relative">
          <canvas
            ref={previewRef}
            className="rounded-lg shadow-lg ring-1 ring-border bg-white"
            style={{
              height: "clamp(220px, 45vw, 340px)",
              width: "auto",
              opacity: rendering ? 0.5 : 1,
              transition: "opacity 0.15s",
            }}
          />
          {rendering && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Grid controls */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <Counter label="Photos per row" value={config.photosPerRow} min={1} max={maxPerRow} onChange={set("photosPerRow")} />
        <Counter label="Rows" value={config.rows} min={1} max={maxRows} onChange={set("rows")} />
      </div>

      {/* Gap */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label>Gap between photos</Label>
          <span className="text-xs tabular-nums text-muted-foreground">{config.gapMm} mm</span>
        </div>
        <Slider min={0} max={8} step={0.5} value={[config.gapMm]} onValueChange={([v]) => set("gapMm")(v)} />
      </div>

      <p className="text-xs text-muted-foreground">
        Max {maxPerRow} × {maxRows} for this size · output is full A4 at 300 DPI
      </p>

      {/* Download */}
      <div className="flex flex-col gap-3 pt-4 border-t border-border">
        <div className="flex gap-3">
          <Button
            size="default"
            className="flex-1 gap-2"
            onClick={handleDownloadPng}
            disabled={!photoCanvas || pngState === "generating"}
          >
            {pngState === "generating" ? (
              <SpinnerGapIcon size={15} className="animate-spin" />
            ) : pngState === "done" ? (
              <CheckIcon size={15} weight="bold" />
            ) : (
              <ImageIcon size={15} />
            )}
            {pngState === "generating" ? "Generating…" : pngState === "done" ? "Downloaded!" : "Download PNG"}
          </Button>

          <Button
            size="default"
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleDownloadPdf}
            disabled={!photoCanvas || pdfState === "generating"}
          >
            {pdfState === "generating" ? (
              <SpinnerGapIcon size={15} className="animate-spin" />
            ) : pdfState === "done" ? (
              <CheckIcon size={15} weight="bold" />
            ) : (
              <FilePdfIcon size={15} />
            )}
            {pdfState === "generating" ? "Generating…" : pdfState === "done" ? "Downloaded!" : "Download PDF"}
          </Button>

          <Button
            size="default"
            variant="outline"
            className="flex-1 gap-2"
            onClick={handlePrint}
            disabled={!photoCanvas}
          >
            <PrinterIcon size={15} />
            Print
          </Button>
        </div>
      </div>
    </div>
  );
}
