import { useCallback, useRef } from "react";
import { UploadSimpleIcon, ImageIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadStepProps {
  onImageSelected: (dataUrl: string) => void;
}

export default function UploadStep({ onImageSelected }: UploadStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) onImageSelected(e.target.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) readFile(file);
    },
    [readFile]
  );

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <div className="text-center max-w-sm">
        <h2 className="text-xl font-semibold mb-1">Upload your photo</h2>
        <p className="text-sm text-muted-foreground">
          Use a clear, front-facing photo. You'll crop and adjust it in the next step.
        </p>
      </div>

      <label
        htmlFor="passport-upload"
        className={cn(
          "relative flex flex-col items-center justify-center gap-4",
          "w-full max-w-md h-64 rounded-2xl border-2 border-dashed border-border",
          "cursor-pointer transition-all duration-200",
          "hover:border-primary hover:bg-primary/5 active:scale-[0.99]"
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <UploadSimpleIcon size={28} className="text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="font-medium">
            <span className="text-primary">Click to upload</span> or drag & drop
          </p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP — max 20 MB</p>
        </div>
        <input
          id="passport-upload"
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) readFile(file);
          }}
        />
      </label>

      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="h-px w-16 bg-border" />
        <span className="text-xs">or try with a sample</span>
        <div className="h-px w-16 bg-border" />
      </div>

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => {
          // Load a sample portrait from picsum
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d")!.drawImage(img, 0, 0);
            onImageSelected(canvas.toDataURL("image/jpeg"));
          };
          img.src = "https://picsum.photos/seed/portrait/600/800";
        }}
      >
        <ImageIcon size={14} />
        Use sample photo
      </Button>
    </div>
  );
}
