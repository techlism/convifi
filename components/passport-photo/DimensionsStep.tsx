import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ArrowCounterClockwiseIcon, ArrowClockwiseIcon } from "@phosphor-icons/react";
import { DIMENSION_PRESETS } from "@/lib/passport-utils";
import { cn } from "@/lib/utils";

const BORDER_COLORS = [
  { label: "Red", value: "#dc2626" },
  { label: "Black", value: "#000000" },
  { label: "Blue", value: "#2563eb" },
];

interface DimensionsStepProps {
  imageSrc: string;
  rotation: number;
  onRotationChange: (r: number) => void;
  crop: Point;
  zoom: number;
  onCropChange: (c: Point) => void;
  onZoomChange: (z: number) => void;
  onCropComplete: (pixels: Area) => void;
  presetLabel: string;
  widthMm: number;
  heightMm: number;
  borderMm: number;
  borderColor: string;
  onPresetChange: (label: string, w: number, h: number) => void;
  onWidthChange: (v: number) => void;
  onHeightChange: (v: number) => void;
  onBorderMmChange: (v: number) => void;
  onBorderColorChange: (v: string) => void;
}

export default function DimensionsStep({
  imageSrc,
  rotation,
  onRotationChange,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  presetLabel,
  widthMm,
  heightMm,
  borderMm,
  borderColor,
  onPresetChange,
  onWidthChange,
  onHeightChange,
  onBorderMmChange,
  onBorderColorChange,
}: DimensionsStepProps) {
  const aspect = heightMm > 0 ? widthMm / heightMm : 1;
  const isCustom = presetLabel === "Custom";

  return (
    <div className="flex flex-col gap-7">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-1">Dimensions & crop</h2>
        <p className="text-sm text-muted-foreground">
          Pick a standard, then frame your shot.
        </p>
      </div>

      {/* ── 1. Preset + optional custom inputs ── */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Country / standard</Label>
          <Select
            value={presetLabel}
            onValueChange={(v) => {
              const found = DIMENSION_PRESETS.find((p) => p.label === v);
              if (found) onPresetChange(found.label, found.widthMm, found.heightMm);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIMENSION_PRESETS.map((p) => (
                <SelectItem key={p.label} value={p.label}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isCustom && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Width (mm)</Label>
              <Input
                type="number"
                min={10}
                max={100}
                value={widthMm}
                onChange={(e) => onWidthChange(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Height (mm)</Label>
              <Input
                type="number"
                min={10}
                max={150}
                value={heightMm}
                onChange={(e) => onHeightChange(Number(e.target.value))}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── 2. Cropper ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label>Position — head &amp; shoulders</Label>
          <span className="text-xs text-muted-foreground">{widthMm} × {heightMm} mm</span>
        </div>

        <div
          className="relative w-full rounded-xl overflow-hidden bg-zinc-900"
          style={{ height: "clamp(280px, 55vw, 400px)" }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={(_area, pixels) => onCropComplete(pixels)}
            style={{ containerStyle: { borderRadius: "0.75rem" } }}
          />
        </div>

        {/* Zoom + Straighten on same row pattern */}
        <div className="flex flex-col gap-2.5 mt-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground shrink-0 w-16">Zoom</span>
            <Slider
              min={1}
              max={3}
              step={0.01}
              value={[zoom]}
              onValueChange={([v]) => onZoomChange(v)}
            />
            <span className="text-xs tabular-nums text-muted-foreground w-8 text-right shrink-0">
              {zoom.toFixed(1)}×
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground shrink-0 w-16">Straighten</span>
            <Slider
              min={-45}
              max={45}
              step={0.5}
              value={[rotation]}
              onValueChange={([v]) => onRotationChange(v)}
            />
            <div className="flex items-center gap-0.5 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => onRotationChange(Math.max(-45, rotation - 1))}
              >
                <ArrowCounterClockwiseIcon size={11} />
              </Button>
              <span className="text-xs tabular-nums text-muted-foreground w-7 text-center">
                {rotation > 0 ? `+${rotation}°` : `${rotation}°`}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => onRotationChange(Math.min(45, rotation + 1))}
              >
                <ArrowClockwiseIcon size={11} />
              </Button>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Scroll / pinch to zoom · drag to reposition · head should fill ~70–80% of height
        </p>
      </div>

      {/* ── 3. Border ── */}
      <div className="flex flex-col gap-4 pt-1 border-t border-border">
        <p className="text-sm font-medium pt-2">Border</p>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="font-normal text-muted-foreground">Width</Label>
            <span className="text-xs tabular-nums text-muted-foreground">{borderMm} mm</span>
          </div>
          <Slider
            min={0}
            max={3}
            step={0.25}
            value={[borderMm]}
            onValueChange={([v]) => onBorderMmChange(v)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Label className="font-normal text-muted-foreground shrink-0">Colour</Label>
          <div className="flex flex-wrap gap-2">
            {BORDER_COLORS.map((bc) => (
              <button
                key={bc.value}
                type="button"
                title={bc.label}
                onClick={() => onBorderColorChange(bc.value)}
                className={cn(
                  "h-7 w-7 rounded-full transition-all",
                  borderColor === bc.value
                    ? "border-4 border-primary scale-110 shadow-md"
                    : "border-2 border-border hover:border-muted-foreground"
                )}
                style={{ backgroundColor: bc.value }}
              />
            ))}
            <label
              title="Custom colour"
              className="h-7 w-7 rounded-full border-2 border-border hover:border-muted-foreground overflow-hidden cursor-pointer transition-all shrink-0"
              style={{ background: "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)" }}
            >
              <input
                type="color"
                value={borderColor}
                onChange={(e) => onBorderColorChange(e.target.value)}
                className="opacity-0 w-0 h-0"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
