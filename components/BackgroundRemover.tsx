import { useState } from "react";
import { Label } from "@/components/ui/label";
import { DownloadSimple, UploadSimple, Lightning } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { removeBackground } from "@imgly/background-removal";
import { ImgComparisonSlider } from "@img-comparison-slider/react";

type DownloadFileType = "image/png" | "image/webp";
type ModelPrecision = "isnet" | "isnet_fp16" | "isnet_quint8";

export default function BackgroundRemover() {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputFileURL, setOutputFileURL] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [imageDownloadType, setImageDownloadType] = useState<DownloadFileType>("image/png");
  const [modelPrecision, setModelPrecision] = useState<ModelPrecision>("isnet_fp16");
  const [quality, setQuality] = useState(100);
  const [currentStatus, setCurrentStatus] = useState("Processing…");

  function getOutputFileName() {
    const base = inputFile?.name.split(".")[0] ?? "image";
    return imageDownloadType === "image/png"
      ? `bg_removed_${base}.png`
      : `bg_removed_${base}.webp`;
  }

  async function removeBackgroundLocal() {
    if (!inputFile) return;
    setProcessing(true);
    setErrorMsg("");
    setOutputFileURL("");
    setProgress(0);
    try {
      const imageData = await new Response(inputFile).blob();
      const blob = await removeBackground(imageData, {
        progress: (key: string, current: number, total: number) => {
          if (key.includes("fetch")) setCurrentStatus("Fetching model…");
          if (key.includes("compute")) {
            setProgress(Math.round((current / total) * 100));
            setCurrentStatus("Processing…");
          }
        },
        model: modelPrecision,
        output: {
          format: imageDownloadType,
          quality: quality / 100,
        },
      });
      setOutputFileURL(URL.createObjectURL(blob));
    } catch (error) {
      setErrorMsg("Error removing background. See console for details.");
      console.error("Error removing background:", error);
    }
    setProcessing(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    if (file.type.startsWith("image/")) {
      setInputFile(file);
      setErrorMsg("");
    } else {
      setErrorMsg("Please select a valid image file.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.type.startsWith("image/")) {
      setInputFile(file);
      setErrorMsg("");
    } else {
      setErrorMsg("Please select a valid image file.");
    }
  };

  const preventDefaults = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  const resetUpload = () => {
    setInputFile(null);
    setOutputFileURL("");
    setErrorMsg("");
    setProgress(0);
  };

  return (
    <div className="flex flex-col border p-2 rounded-lg shadow-md mb-4">
      <div className="m-2">
        {inputFile == null ? (
          <Label htmlFor="bg-remove-file" className="block w-full cursor-pointer">
            <div
              className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg w-full"
              onDragOver={preventDefaults}
              onDragEnter={preventDefaults}
              onDragLeave={preventDefaults}
              onDrop={handleDrop}
            >
              <UploadSimple size={24} />
              <p className="mb-2 text-sm text-muted-foreground text-center mt-2">
                <span className="font-semibold">Click to Select</span> or Drag and Drop
              </p>
            </div>
            <Input id="bg-remove-file" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </Label>
        ) : (
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 border-primary">
            <p className="text-lg font-semibold text-muted-foreground text-center">
              {inputFile.name.length <= 23
                ? inputFile.name
                : `${inputFile.name.substring(0, 15)}....${inputFile.name.substring(inputFile.name.length - 5)}`}
            </p>
            <Button variant="ghost" onClick={resetUpload} className="text-xs opacity-30" disabled={processing}>
              Choose a different image
            </Button>
          </div>
        )}
      </div>

      {inputFile && outputFileURL && (
        <div className="mx-auto border p-4 rounded-lg flex gap-4 my-2 justify-center w-full">
          <ImgComparisonSlider className="rounded-lg w-full max-h-96">
            <img slot="first" src={URL.createObjectURL(inputFile)} alt="Before" className="max-h-96 rounded-lg w-full object-contain" />
            <img slot="second" src={outputFileURL} alt="After" className="max-h-96 rounded-lg w-full object-contain" />
          </ImgComparisonSlider>
        </div>
      )}

      <div className="m-2 border p-4 rounded-lg">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="options">
            <AccordionTrigger>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Lightning size={18} /> Advanced Options
              </h3>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Model quality</h3>
                  <p className="text-muted-foreground text-sm">Higher quality uses more data and is slower.</p>
                </div>
                <Select value={modelPrecision} onValueChange={(v) => setModelPrecision(v as ModelPrecision)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="isnet">High Quality (Slower)</SelectItem>
                    <SelectItem value="isnet_fp16">Balanced</SelectItem>
                    <SelectItem value="isnet_quint8">Fast (Lower Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h3 className="font-medium">Output as WebP</h3>
                  <p className="text-muted-foreground text-sm">Smaller file size, wide compatibility.</p>
                </div>
                <Switch
                  checked={imageDownloadType === "image/webp"}
                  onCheckedChange={() =>
                    setImageDownloadType(imageDownloadType === "image/webp" ? "image/png" : "image/webp")
                  }
                />
              </div>

              <div className="grid gap-2 p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Quality</h3>
                  <p className="text-muted-foreground text-sm">Can reduce file size in some cases.</p>
                </div>
                <Slider min={1} max={100} defaultValue={[100]} step={1} onValueChange={(v) => setQuality(v[0])} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {errorMsg && (
        <div className="border p-4 rounded-lg bg-red-100 dark:bg-red-950 text-red-500 m-2 font-medium text-sm">
          {errorMsg}
        </div>
      )}

      {processing && (
        <div className="border p-4 m-2 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">{currentStatus}</p>
          <Progress value={progress} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-center border m-2 p-5 rounded-lg">
        <Button onClick={removeBackgroundLocal} disabled={!inputFile || processing}>
          {processing ? currentStatus : "Remove Background"}
        </Button>
        {outputFileURL && (
          <a
            href={outputFileURL}
            download={getOutputFileName()}
            className="bg-primary text-primary-foreground hover:opacity-90 text-sm font-medium flex justify-center items-center gap-2 py-2 rounded-md"
          >
            Download <DownloadSimple size={15} />
          </a>
        )}
        {outputFileURL && (
          <Button onClick={resetUpload} variant="outline">Remove Another</Button>
        )}
      </div>
    </div>
  );
}
