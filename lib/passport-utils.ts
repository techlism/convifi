import type { Area } from "react-easy-crop";

export interface Adjustments {
  brightness: number; // -50 to +50, 0 = normal
  contrast: number;
  saturation: number;
}

export interface DimensionPreset {
  label: string;
  widthMm: number;
  heightMm: number;
}

export interface LayoutConfig {
  widthMm: number;
  heightMm: number;
  borderMm: number;
  borderColor: string;
  photosPerRow: number;
  rows: number;
  gapMm: number;
}

export const DIMENSION_PRESETS: DimensionPreset[] = [
  { label: "UK / Schengen (35 × 45 mm)", widthMm: 35, heightMm: 45 },
  { label: "US Passport (50.8 × 50.8 mm / 2\" × 2\")", widthMm: 50.8, heightMm: 50.8 },
  { label: "India Passport (35 × 45 mm)", widthMm: 35, heightMm: 45 },
  { label: "Australia (35 × 45 mm)", widthMm: 35, heightMm: 45 },
  { label: "Canada (50 × 70 mm)", widthMm: 50, heightMm: 70 },
  { label: "UAE Visa (35 × 45 mm)", widthMm: 35, heightMm: 45 },
  { label: "China Visa (33 × 48 mm)", widthMm: 33, heightMm: 48 },
  { label: "Japan (35 × 45 mm)", widthMm: 35, heightMm: 45 },
  { label: "South Korea (35 × 45 mm)", widthMm: 35, heightMm: 45 },
  { label: "Custom", widthMm: 35, heightMm: 45 },
];

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/** Crop + rotate + apply brightness/contrast/saturation adjustments */
export async function getCroppedCanvas(
  imageSrc: string,
  pixelCrop: Area,
  rotation: number,
  adjustments: Adjustments
): Promise<HTMLCanvasElement> {
  const image = await createImage(imageSrc);
  const rotRad = (rotation * Math.PI) / 180;

  // Compute bounding box of the rotated image
  const bboxWidth =
    Math.abs(Math.cos(rotRad)) * image.width +
    Math.abs(Math.sin(rotRad)) * image.height;
  const bboxHeight =
    Math.abs(Math.sin(rotRad)) * image.width +
    Math.abs(Math.cos(rotRad)) * image.height;

  // Step 1: rotate into a temp canvas
  const rotCanvas = document.createElement("canvas");
  rotCanvas.width = bboxWidth;
  rotCanvas.height = bboxHeight;
  const rotCtx = rotCanvas.getContext("2d")!;
  rotCtx.translate(bboxWidth / 2, bboxHeight / 2);
  rotCtx.rotate(rotRad);
  rotCtx.drawImage(image, -image.width / 2, -image.height / 2);

  // Step 2: crop from rotated canvas and apply CSS filters
  const outCanvas = document.createElement("canvas");
  outCanvas.width = pixelCrop.width;
  outCanvas.height = pixelCrop.height;
  const outCtx = outCanvas.getContext("2d")!;

  const b = 100 + adjustments.brightness;
  const c = 100 + adjustments.contrast;
  const s = 100 + adjustments.saturation;
  outCtx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;

  outCtx.drawImage(
    rotCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return outCanvas;
}

/**
 * Render an A4 sheet canvas with the passport photo tiled.
 * scale = 1 → full 300 DPI (2480×3508); scale < 1 for preview.
 */
export function createA4Canvas(
  photoCanvas: HTMLCanvasElement,
  config: LayoutConfig,
  scale = 1
): HTMLCanvasElement {
  const DPI = 300 * scale;
  const MM_PX = DPI / 25.4;

  const a4W = Math.round(210 * MM_PX);
  const a4H = Math.round(297 * MM_PX);

  const photoW = Math.round(config.widthMm * MM_PX);
  const photoH = Math.round(config.heightMm * MM_PX);
  const gap = Math.round(config.gapMm * MM_PX);
  const border = Math.round(config.borderMm * MM_PX);

  // Clamp to what physically fits
  const maxPerRow = Math.max(1, Math.floor((a4W + gap) / (photoW + gap)));
  const maxRows = Math.max(1, Math.floor((a4H + gap) / (photoH + gap)));
  const perRow = Math.min(config.photosPerRow, maxPerRow);
  const numRows = Math.min(config.rows, maxRows);

  // Centre horizontally (equal left/right margins make cutting easier),
  // but anchor to the top so prints fill from the top down.
  const gridW = perRow * photoW + (perRow - 1) * gap;
  const offsetX = Math.round((a4W - gridW) / 2);
  const offsetY = gap; // same gap used between photos, consistent top margin

  const canvas = document.createElement("canvas");
  canvas.width = a4W;
  canvas.height = a4H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, a4W, a4H);

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < perRow; col++) {
      const x = offsetX + col * (photoW + gap);
      const y = offsetY + row * (photoH + gap);

      if (border > 0) {
        ctx.fillStyle = config.borderColor;
        ctx.fillRect(x, y, photoW, photoH);
      }

      ctx.drawImage(
        photoCanvas,
        x + border,
        y + border,
        photoW - 2 * border,
        photoH - 2 * border
      );
    }
  }

  return canvas;
}

/** Compute max photos that fit given current config (for UI display) */
export function maxPhotosInfo(config: LayoutConfig): { maxPerRow: number; maxRows: number } {
  const DPI = 300;
  const MM_PX = DPI / 25.4;
  const a4W = Math.round(210 * MM_PX);
  const a4H = Math.round(297 * MM_PX);
  const photoW = Math.round(config.widthMm * MM_PX);
  const photoH = Math.round(config.heightMm * MM_PX);
  const gap = Math.round(config.gapMm * MM_PX);
  return {
    maxPerRow: Math.max(1, Math.floor((a4W + gap) / (photoW + gap))),
    maxRows: Math.max(1, Math.floor((a4H + gap) / (photoH + gap))),
  };
}

/** Convert a canvas to a PDF Uint8Array using pdf-lib */
export async function canvasToA4Pdf(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const pdfDoc = await PDFDocument.create();
  // A4 in pts: 595.28 × 841.89
  const page = pdfDoc.addPage([595.28, 841.89]);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
  const base64 = dataUrl.split(",")[1];
  const raw = atob(base64);
  const imgBytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) imgBytes[i] = raw.charCodeAt(i);
  const img = await pdfDoc.embedJpg(imgBytes);
  page.drawImage(img, { x: 0, y: 0, width: 595.28, height: 841.89 });
  return pdfDoc.save();
}
