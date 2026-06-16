import { useState } from "react";
import { Label } from "@/components/ui/label";
import { DownloadSimple, UploadSimple } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import InfoTooltip from "@/components/InfoTooltip";
import AlertBox from "@/components/AlertBox";
import imageCompression from "browser-image-compression";

export default function ImageCompressor() {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputURL, setOutputURL] = useState("");
  const [outputName, setOutputName] = useState("");
  const [converting, setConverting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [quality, setQuality] = useState(0.8);
  const [maxDimension, setMaxDimension] = useState(1920);
  const [naturalDimension, setNaturalDimension] = useState(1920);
  const [sizeInfo, setSizeInfo] = useState<{ original: number; compressed: number } | null>(null);

  async function compress() {
    if (!inputFile) return;
    setConverting(true);
    setErrorMsg("");
    setSizeInfo(null);
    if (outputURL) URL.revokeObjectURL(outputURL);

    try {
      const result = await imageCompression(inputFile, {
        initialQuality: quality,
        maxWidthOrHeight: maxDimension,
        useWebWorker: true,
        fileType: inputFile.type as "image/jpeg" | "image/png" | "image/webp",
      });
      const url = URL.createObjectURL(result);
      setOutputURL(url);
      setOutputName(`compressed_${inputFile.name}`);
      setSizeInfo({
        original: Math.round(inputFile.size / 1024),
        compressed: Math.round(result.size / 1024),
      });
    } catch (err) {
      setErrorMsg("Compression failed. Try a different image or settings.");
      console.error(err);
    } finally {
      setConverting(false);
    }
  }

  function resetUpload() {
    setInputFile(null);
    if (outputURL) URL.revokeObjectURL(outputURL);
    setOutputURL("");
    setOutputName("");
    setSizeInfo(null);
    setErrorMsg("");
    setQuality(0.8);
    setMaxDimension(1920);
    setNaturalDimension(1920);
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file.");
      return;
    }
    setInputFile(file);
    setErrorMsg("");
    setSizeInfo(null);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const longest = Math.max(img.naturalWidth, img.naturalHeight);
      setMaxDimension(longest);
      setNaturalDimension(longest);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  const preventDefaults = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <div className="flex flex-col border p-2 rounded-lg shadow-md">
      <div className="m-2">
        {!inputFile ? (
          <Label htmlFor="compress-file" className="block w-full cursor-pointer">
            <div
              className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg w-full"
              onDragOver={preventDefaults}
              onDragEnter={preventDefaults}
              onDragLeave={preventDefaults}
              onDrop={(e) => { preventDefaults(e); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            >
              <UploadSimple size={24} />
              <p className="mt-2 mb-2 text-sm text-muted-foreground text-center">
                <span className="font-semibold">Click to Select</span> or Drag and Drop
              </p>
            </div>
            <Input id="compress-file" type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </Label>
        ) : (
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 border-primary">
            <p className="text-lg font-semibold text-muted-foreground text-center">
              {inputFile.name.length <= 23
                ? inputFile.name
                : `${inputFile.name.slice(0, 15)}....${inputFile.name.slice(-5)}`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{Math.round(inputFile.size / 1024)} KB</p>
            <Button variant="ghost" onClick={resetUpload} className="text-xs opacity-30 mt-1" disabled={converting}>
              Choose a different image
            </Button>
          </div>
        )}
      </div>

      {errorMsg && <AlertBox type="error">{errorMsg}</AlertBox>}

      {sizeInfo && !errorMsg && (
        <AlertBox type="success">
          Compressed successfully — {sizeInfo.original} KB → <strong>{sizeInfo.compressed} KB</strong> ({Math.round((1 - sizeInfo.compressed / sizeInfo.original) * 100)}% saved)
        </AlertBox>
      )}

      <div className="grid grid-cols-1 gap-6 items-center border m-2 p-5 rounded-lg">
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Quality</h3>
              <InfoTooltip information="Lower quality = smaller file. JPEG and WebP compress well; PNG is lossless and ignores this setting." />
            </div>
            <span className="text-sm font-medium border rounded px-2 py-0.5 bg-muted">{Math.round(quality * 100)}%</span>
          </div>
          <Slider defaultValue={[80]} min={10} max={100} step={5}
            onValueChange={([v]) => setQuality(v / 100)} />
        </div>
        <Separator />
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Max Dimension</h3>
              <InfoTooltip information="Caps the longest side of the image in pixels. Smaller = faster load, smaller file." />
            </div>
            <span className="text-sm font-medium border rounded px-2 py-0.5 bg-muted">{maxDimension}px</span>
          </div>
          <Slider value={[maxDimension]} min={320} max={naturalDimension} step={Math.max(1, Math.round(naturalDimension / 64))}
            onValueChange={([v]) => setMaxDimension(v)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-center border m-2 p-5 rounded-lg">
        <Button onClick={compress} disabled={!inputFile || converting}>
          {converting ? "Compressing…" : sizeInfo ? "Re-Compress" : "Compress"}
        </Button>
        {outputURL && (
          <a href={outputURL} download={outputName}
            className="bg-primary text-primary-foreground hover:opacity-90 text-sm font-medium flex justify-center items-center gap-2 py-2 rounded-md">
            Download <DownloadSimple size={15} />
          </a>
        )}
        {outputURL && (
          <Button onClick={resetUpload} variant="outline">Compress Another</Button>
        )}
      </div>
    </div>
  );
}
