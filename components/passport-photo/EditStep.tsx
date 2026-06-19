import { useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { Adjustments } from "@/lib/passport-utils";
import { SunIcon, CircleHalfIcon, DropIcon } from "@phosphor-icons/react";

interface EditStepProps {
  imageSrc: string;
  adjustments: Adjustments;
  onAdjustmentsChange: (a: Adjustments) => void;
}

interface AdjustSliderProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

function AdjustSlider({ label, icon, value, onChange, min = -50, max = 50 }: AdjustSliderProps) {
  const displayVal = value > 0 ? `+${value}` : String(value);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <span className="text-muted-foreground">{icon}</span>
          {label}
        </div>
        <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">
          {displayVal}
        </span>
      </div>
      <Slider min={min} max={max} step={1} value={[value]} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}

export default function EditStep({ imageSrc, adjustments, onAdjustmentsChange }: EditStepProps) {
  const set = useCallback(
    (key: keyof Adjustments) => (v: number) =>
      onAdjustmentsChange({ ...adjustments, [key]: v }),
    [adjustments, onAdjustmentsChange]
  );

  const filterStyle = `brightness(${100 + adjustments.brightness}%) contrast(${100 + adjustments.contrast}%) saturate(${100 + adjustments.saturation}%)`;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-1">Adjust photo</h2>
        <p className="text-sm text-muted-foreground">
          Tune brightness, contrast and colour. You'll crop and straighten in the next step.
        </p>
      </div>

      {/* Live preview */}
      <div
        className="relative mx-auto rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center"
        style={{ height: "clamp(220px, 40vw, 340px)", width: "100%" }}
      >
        <img
          src={imageSrc}
          alt="Preview"
          className="max-h-full max-w-full object-contain transition-all duration-150"
          style={{ filter: filterStyle }}
        />
      </div>

      <div className="h-px bg-border" />

      {/* Adjustment sliders */}
      <div className="flex flex-col gap-5">
        <AdjustSlider label="Brightness" icon={<SunIcon size={14} />} value={adjustments.brightness} onChange={set("brightness")} />
        <AdjustSlider label="Contrast" icon={<CircleHalfIcon size={14} />} value={adjustments.contrast} onChange={set("contrast")} />
        <AdjustSlider label="Saturation" icon={<DropIcon size={14} />} value={adjustments.saturation} onChange={set("saturation")} />
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="self-start text-muted-foreground text-xs"
        onClick={() => onAdjustmentsChange({ brightness: 0, contrast: 0, saturation: 0 })}
      >
        Reset adjustments
      </Button>
    </div>
  );
}
