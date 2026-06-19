import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createA4Canvas, canvasToA4Pdf } from "@/lib/passport-utils";
import type { LayoutConfig } from "@/lib/passport-utils";
import { FilePdfIcon, ImageIcon, SpinnerGapIcon, CheckIcon } from "@phosphor-icons/react";

interface ExportStepProps {
  photoCanvas: HTMLCanvasElement | null;
  config: LayoutConfig;
  onStartOver: () => void;
}

type ExportState = "idle" | "generating" | "done";

export default function ExportStep({ photoCanvas, config, onStartOver }: ExportStepProps) {
  const [pngState, setPngState] = useState<ExportState>("idle");
  const [pdfState, setPdfState] = useState<ExportState>("idle");

  const totalPhotos = config.photosPerRow * config.rows;

  const handleDownloadPng = async () => {
    if (!photoCanvas || pngState === "generating") return;
    setPngState("generating");
    try {
      await new Promise((r) => requestAnimationFrame(r)); // let UI update
      const a4 = createA4Canvas(photoCanvas, config, 1);
      a4.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "passport-photos.png";
          a.click();
          URL.revokeObjectURL(url);
          setPngState("done");
          setTimeout(() => setPngState("idle"), 3000);
        },
        "image/png"
      );
    } catch {
      setPngState("idle");
    }
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
    <div className="flex flex-col items-center gap-8 py-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-1">Download</h2>
        <p className="text-sm text-muted-foreground">
          {totalPhotos} photo{totalPhotos !== 1 ? "s" : ""} · A4 sheet · 300 DPI print-ready
        </p>
      </div>

      {/* Spec summary card */}
      <div className="w-full max-w-sm rounded-xl border border-border bg-muted/40 p-4 text-sm grid grid-cols-2 gap-y-2">
        <span className="text-muted-foreground">Photo size</span>
        <span className="font-medium text-right">{config.widthMm} × {config.heightMm} mm</span>
        <span className="text-muted-foreground">Border</span>
        <span className="font-medium text-right">{config.borderMm} mm</span>
        <span className="text-muted-foreground">Grid</span>
        <span className="font-medium text-right">{config.photosPerRow} × {config.rows}</span>
        <span className="text-muted-foreground">Gap</span>
        <span className="font-medium text-right">{config.gapMm} mm</span>
        <span className="text-muted-foreground">Sheet</span>
        <span className="font-medium text-right">A4 · 300 DPI</span>
      </div>

      {/* Download buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button
          size="lg"
          className="flex-1 gap-2"
          onClick={handleDownloadPng}
          disabled={pngState === "generating"}
        >
          {pngState === "generating" ? (
            <SpinnerGapIcon size={16} className="animate-spin" />
          ) : pngState === "done" ? (
            <CheckIcon size={16} weight="bold" />
          ) : (
            <ImageIcon size={16} />
          )}
          {pngState === "generating" ? "Generating…" : pngState === "done" ? "Downloaded!" : "Download PNG"}
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="flex-1 gap-2"
          onClick={handleDownloadPdf}
          disabled={pdfState === "generating"}
        >
          {pdfState === "generating" ? (
            <SpinnerGapIcon size={16} className="animate-spin" />
          ) : pdfState === "done" ? (
            <CheckIcon size={16} weight="bold" />
          ) : (
            <FilePdfIcon size={16} />
          )}
          {pdfState === "generating" ? "Generating…" : pdfState === "done" ? "Downloaded!" : "Download PDF"}
        </Button>
      </div>

      <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground text-center">
        <p>All processing happens in your browser. Nothing is uploaded.</p>
      </div>

      <Button variant="ghost" size="sm" onClick={onStartOver} className="text-muted-foreground">
        Start over with a new photo
      </Button>
    </div>
  );
}
