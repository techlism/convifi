import { useState } from "react";
import { Label } from "@/components/ui/label";
import { DownloadSimple, UploadSimple } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import imageCompression from "browser-image-compression";
import AlertBox from "@/components/AlertBox";

export default function ReduceImageInKB() {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [targetKB, setTargetKB] = useState<number | "">("");
  const [outputURL, setOutputURL] = useState("");
  const [outputName, setOutputName] = useState("");
  const [converting, setConverting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sizeInfo, setSizeInfo] = useState<{ original: number; compressed: number; convertedToJPEG?: boolean } | null>(null);

  async function reduce() {
    if (!inputFile || !targetKB) return;
    setConverting(true);
    setErrorMsg("");
    setSizeInfo(null);
    if (outputURL) URL.revokeObjectURL(outputURL);

    try {
      const maxSizeMB = (targetKB as number) / 1024;

      // PNG is lossless — quality reduction has no effect on it.
      // Force JPEG output so the library can actually hit aggressive size targets.
      const isPNG = inputFile.type === "image/png";
      const outputType = isPNG ? "image/jpeg" : (inputFile.type as "image/jpeg" | "image/webp");
      const outputExt  = isPNG ? "jpg" : inputFile.name.split(".").pop() ?? "jpg";
      const baseName   = inputFile.name.replace(/\.[^.]+$/, "");

      const result = await imageCompression(inputFile, {
        maxSizeMB,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        initialQuality: 0.85,
        fileType: outputType,
      });

      const url = URL.createObjectURL(result);
      setOutputURL(url);
      setOutputName(`reduced_${baseName}.${outputExt}`);
      setSizeInfo({
        original: Math.round(inputFile.size / 1024),
        compressed: Math.round(result.size / 1024),
        convertedToJPEG: isPNG,
      });
    } catch (err) {
      setErrorMsg("Could not reach the target size. Try a larger target or a different image.");
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
    setTargetKB("");
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file.");
      return;
    }
    setInputFile(file);
    setErrorMsg("");
    setSizeInfo(null);
  }

  const preventDefaults = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <div className="flex flex-col border p-2 rounded-lg shadow-md">
      <div className="m-2">
        {!inputFile ? (
          <Label htmlFor="reduce-file" className="block w-full cursor-pointer">
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
            <Input id="reduce-file" type="file" accept="image/*" className="hidden"
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

      {sizeInfo && !errorMsg && (() => {
        const achieved = sizeInfo.compressed <= (targetKB as number);
        const over = sizeInfo.compressed - (targetKB as number);
        return (
          <>
            <AlertBox type={achieved ? "success" : "warning"}>
              {sizeInfo.original} KB → <strong>{sizeInfo.compressed} KB</strong>
              {targetKB && (achieved
                ? ` — target of ${targetKB} KB achieved.`
                : ` — closest possible (${over} KB over target of ${targetKB} KB).`)}
            </AlertBox>
            {sizeInfo.convertedToJPEG && (
              <AlertBox type="warning">PNG converted to JPEG for lossy compression — transparency is not preserved.</AlertBox>
            )}
          </>
        );
      })()}

      <div className="m-2 p-5 border rounded-lg space-y-3">
        <Label htmlFor="target-kb" className="font-semibold text-sm">Target size (KB)</Label>
        <Input
          id="target-kb"
          type="number"
          min={10}
          placeholder="e.g. 100"
          value={targetKB}
          onChange={(e) => setTargetKB(e.target.value === "" ? "" : Math.max(10, Number(e.target.value)))}
        />
        {inputFile && targetKB && (targetKB as number) >= Math.round(inputFile.size / 1024) && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            Target is larger than the original — the image will not increase in size.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-center border m-2 p-5 rounded-lg">
        <Button onClick={reduce} disabled={!inputFile || !targetKB || converting}>
          {converting ? "Reducing…" : sizeInfo ? "Try Again" : "Reduce"}
        </Button>
        {outputURL && (
          <a href={outputURL} download={outputName}
            className="bg-primary text-primary-foreground hover:opacity-90 text-sm font-medium flex justify-center items-center gap-2 py-2 rounded-md">
            Download <DownloadSimple size={15} />
          </a>
        )}
        {outputURL && (
          <Button onClick={resetUpload} variant="outline">Reduce Another</Button>
        )}
      </div>
    </div>
  );
}
