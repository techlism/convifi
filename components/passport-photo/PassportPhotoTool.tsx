"use client";
import { useCallback, useState } from "react";
import type { Area, Point } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, SpinnerGapIcon, ArrowCounterClockwiseIcon } from "@phosphor-icons/react";

import StepIndicator from "./StepIndicator";
import UploadStep from "./UploadStep";
import EditStep from "./EditStep";
import DimensionsStep from "./DimensionsStep";
import LayoutStep from "./LayoutStep";
import { getCroppedCanvas, maxPhotosInfo, DIMENSION_PRESETS } from "@/lib/passport-utils";
import type { Adjustments, LayoutConfig } from "@/lib/passport-utils";

// Upload is step 1 internally but not counted — indicator shows steps 2-4 as 1-3
const STEPS = [
  { label: "Tune" },
  { label: "Frame" },
  { label: "Print" },
];

const firstPreset = DIMENSION_PRESETS[0];

const DEFAULT_STATE = {
  imageSrc: null as string | null,
  rotation: 0,
  adjustments: { brightness: 0, contrast: 0, saturation: 0 } as Adjustments,
  presetLabel: firstPreset.label,
  widthMm: firstPreset.widthMm,
  heightMm: firstPreset.heightMm,
  borderMm: 0,
  borderColor: "#ffffff",
  crop: { x: 0, y: 0 } as Point,
  zoom: 1,
  croppedAreaPixels: null as Area | null,
  photoCanvas: null as HTMLCanvasElement | null,
  layoutConfig: {
    widthMm: firstPreset.widthMm,
    heightMm: firstPreset.heightMm,
    borderMm: 0,
    borderColor: "#ffffff",
    photosPerRow: 4,
    rows: 4,
    gapMm: 3,
  } as LayoutConfig,
};

export default function PassportPhotoTool() {
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  const [imageSrc, setImageSrc] = useState(DEFAULT_STATE.imageSrc);
  const [rotation, setRotation] = useState(DEFAULT_STATE.rotation);
  const [adjustments, setAdjustments] = useState<Adjustments>(DEFAULT_STATE.adjustments);
  const [presetLabel, setPresetLabel] = useState(DEFAULT_STATE.presetLabel);
  const [widthMm, setWidthMm] = useState(DEFAULT_STATE.widthMm);
  const [heightMm, setHeightMm] = useState(DEFAULT_STATE.heightMm);
  const [borderMm, setBorderMm] = useState(DEFAULT_STATE.borderMm);
  const [borderColor, setBorderColor] = useState(DEFAULT_STATE.borderColor);
  const [crop, setCrop] = useState<Point>(DEFAULT_STATE.crop);
  const [zoom, setZoom] = useState(DEFAULT_STATE.zoom);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(DEFAULT_STATE.croppedAreaPixels);
  const [photoCanvas, setPhotoCanvas] = useState<HTMLCanvasElement | null>(DEFAULT_STATE.photoCanvas);
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(DEFAULT_STATE.layoutConfig);

  const handleReset = () => {
    setStep(1);
    setImageSrc(DEFAULT_STATE.imageSrc);
    setRotation(DEFAULT_STATE.rotation);
    setAdjustments({ ...DEFAULT_STATE.adjustments });
    setPresetLabel(DEFAULT_STATE.presetLabel);
    setWidthMm(DEFAULT_STATE.widthMm);
    setHeightMm(DEFAULT_STATE.heightMm);
    setBorderMm(DEFAULT_STATE.borderMm);
    setBorderColor(DEFAULT_STATE.borderColor);
    setCrop({ ...DEFAULT_STATE.crop });
    setZoom(DEFAULT_STATE.zoom);
    setCroppedAreaPixels(DEFAULT_STATE.croppedAreaPixels);
    setPhotoCanvas(DEFAULT_STATE.photoCanvas);
    setLayoutConfig({ ...DEFAULT_STATE.layoutConfig });
  };

  const handlePresetChange = (label: string, w: number, h: number) => {
    setPresetLabel(label);
    setWidthMm(w);
    setHeightMm(h);
    // Reset crop so the new aspect ratio is applied fresh
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const goTo = useCallback(
    async (target: number) => {
      if (step === 3 && target === 4) {
        if (!imageSrc || !croppedAreaPixels) return;
        setProcessing(true);
        try {
          const canvas = await getCroppedCanvas(imageSrc, croppedAreaPixels, rotation, adjustments);
          setPhotoCanvas(canvas);
          const newConfig: LayoutConfig = { ...layoutConfig, widthMm, heightMm, borderMm, borderColor };
          const { maxPerRow, maxRows } = maxPhotosInfo(newConfig);
          setLayoutConfig({ ...newConfig, photosPerRow: maxPerRow, rows: maxRows });
        } finally {
          setProcessing(false);
        }
      }
      setStep(target);
    },
    [step, imageSrc, croppedAreaPixels, rotation, adjustments, layoutConfig, widthMm, heightMm, borderMm, borderColor]
  );

  const canProceed =
    (step === 1 && !!imageSrc) ||
    step === 2 ||
    (step === 3 && !!croppedAreaPixels) ||
    step === 4;

  return (
    <div className="flex flex-col gap-5">
      {/* Step indicator centred, with Back + Reset stacked on the left */}
      {step > 1 && (
        <div className="flex items-center">
          {/* Left — Back + Reset stacked */}
          <div className="flex flex-col gap-0.5 w-16 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground gap-1 h-7 px-2 justify-start"
              onClick={() => setStep((s) => s - 1)}
            >
              <ArrowLeftIcon size={12} />
              Back
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground gap-1 h-7 px-2 justify-start"
              onClick={handleReset}
            >
              <ArrowCounterClockwiseIcon size={12} />
              Reset
            </Button>
          </div>

          {/* Centre — step indicator, truly centred via equal-width sides */}
          <div className="flex-1 min-w-0">
            <StepIndicator steps={STEPS} current={step - 1} />
          </div>

          {/* Right — phantom spacer matching left width so centre is exact */}
          <div className="w-16 shrink-0" />
        </div>
      )}

      {/* Card */}
      <div className="rounded-2xl border border-border bg-card shadow-sm p-5 sm:p-8 min-h-105 flex flex-col">
        <div className="flex-1">
          {step === 1 && (
            <UploadStep onImageSelected={(url) => { setImageSrc(url); setStep(2); }} />
          )}
          {step === 2 && imageSrc && (
            <EditStep
              imageSrc={imageSrc}
              adjustments={adjustments}
              onAdjustmentsChange={setAdjustments}
            />
          )}
          {step === 3 && imageSrc && (
            <DimensionsStep
              imageSrc={imageSrc}
              rotation={rotation}
              onRotationChange={setRotation}
              crop={crop}
              zoom={zoom}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={setCroppedAreaPixels}
              presetLabel={presetLabel}
              widthMm={widthMm}
              heightMm={heightMm}
              borderMm={borderMm}
              borderColor={borderColor}
              onPresetChange={handlePresetChange}
              onWidthChange={setWidthMm}
              onHeightChange={setHeightMm}
              onBorderMmChange={setBorderMm}
              onBorderColorChange={setBorderColor}
            />
          )}
          {step === 4 && (
            <LayoutStep
              photoCanvas={photoCanvas}
              config={layoutConfig}
              onConfigChange={setLayoutConfig}
            />
          )}
        </div>

        {/* Footer — Continue button for steps 2 & 3; step 4 has download buttons inline */}
        {step > 1 && step < 4 && (
          <div className="flex justify-end pt-6 mt-6 border-t border-border">
            <Button
              size="sm"
              onClick={() => goTo(step + 1)}
              disabled={!canProceed || processing}
              className="gap-1.5 min-w-32"
            >
              {processing ? (
                <><SpinnerGapIcon size={14} className="animate-spin" />Processing…</>
              ) : (
                <>Continue <ArrowRightIcon size={14} /></>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
