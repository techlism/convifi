import { useEffect, useState } from "react";
import { DownloadSimple, UploadSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import AlertBox from "@/components/AlertBox";

// Formats wasm-vips cannot output (raster → vector is impossible without tracing)
const UNSUPPORTED_OUTPUT = new Set(["svg"]);

// Formats that need jsPDF instead of vips
const PDF_OUTPUT = new Set(["pdf"]);

const MIME: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  webp: "image/webp", tiff: "image/tiff", bmp: "image/bmp",
  gif: "image/gif", avif: "image/avif",
};

// Module-level singleton so WASM loads once per page session
type VipsInstance = Awaited<ReturnType<typeof import("wasm-vips")>>;
let vipsPromise: Promise<VipsInstance> | null = null;

function getVips() {
  if (!vipsPromise) {
    vipsPromise = import("wasm-vips").then((m) =>
      (m as unknown as { default: (config?: Record<string, unknown>) => Promise<VipsInstance> }).default({
        locateFile: (file: string) => `/${file}`,
      })
    );
  }
  return vipsPromise;
}

async function convertToPDF(inputFile: File): Promise<Blob> {
  const { default: jsPDF } = await import("jspdf");
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(inputFile);
    img.onload = () => {
      const pdf = new jsPDF({
        orientation: img.width > img.height ? "landscape" : "portrait",
        unit: "px",
        format: [img.width, img.height],
      });
      pdf.addImage(img as HTMLImageElement, "JPEG", 0, 0, img.width, img.height);
      URL.revokeObjectURL(url);
      resolve(pdf.output("blob"));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function ImageConverter({
  format,
  primaryFormat,
}: {
  format: string;
  primaryFormat: string;
}) {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputFileURL, setOutputFileURL] = useState("");
  const [converting, setConverting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (PDF_OUTPUT.has(format) || UNSUPPORTED_OUTPUT.has(format)) return;
    setLoading(true);
    getVips().finally(() => setLoading(false));
  }, [format]);

  function getDownloadFileName() {
    if (!inputFile) return `converted.${format}`;
    const base = inputFile.name.replace(/\.[^.]+$/, "");
    return `${base}.${format}`;
  }

  async function convert() {
    if (!inputFile) return;
    setConverting(true);
    setErrorMsg("");
    if (outputFileURL) URL.revokeObjectURL(outputFileURL);

    try {
      if (UNSUPPORTED_OUTPUT.has(format)) {
        setErrorMsg("Raster to SVG conversion requires vectorization which is not supported in the browser.");
        return;
      }

      let blob: Blob;

      if (PDF_OUTPUT.has(format)) {
        blob = await convertToPDF(inputFile);
      } else {
        const vips = await getVips();
        const buffer = await inputFile.arrayBuffer();
        const image = vips.Image.newFromBuffer(buffer);
        const suffix = `.${format === "jpg" || format === "jpeg" ? "jpg" : format}`;
        const outputData = image.writeToBuffer(suffix);
        image.delete();
        blob = new Blob([outputData.buffer as ArrayBuffer], { type: MIME[format] ?? `image/${format}` });
      }

      setOutputFileURL(URL.createObjectURL(blob));
    } catch (err) {
      setErrorMsg("Conversion failed. The format may not be supported for this image.");
      console.error("[convifi] image conversion error:", err);
    } finally {
      setConverting(false);
    }
  }

  function resetUpload() {
    setInputFile(null);
    if (outputFileURL) URL.revokeObjectURL(outputFileURL);
    setOutputFileURL("");
    setErrorMsg("");
  }

  function handleFile(file: File) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const isJpeg = (primaryFormat === "jpeg" || primaryFormat === "jpg") && (ext === "jpg" || ext === "jpeg");
    if (!isJpeg && ext !== primaryFormat.toLowerCase()) {
      setErrorMsg(`Please select a valid ${primaryFormat.toUpperCase()} file.`);
      return;
    }
    setInputFile(file);
    setErrorMsg("");
    setOutputFileURL("");
  }

  const preventDefaults = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <div className="flex flex-col border rounded-lg shadow-md">
      <div className="m-2">
        {!inputFile ? (
          <label htmlFor="img-convert-file" className="block w-full cursor-pointer">
            <div
              className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg w-full"
              onDragOver={preventDefaults}
              onDragEnter={preventDefaults}
              onDragLeave={preventDefaults}
              onDrop={(e) => { preventDefaults(e); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            >
              <UploadSimple size={24} />
              <p className="mb-2 text-sm text-muted-foreground text-center mt-2">
                <span className="font-semibold">Click to Select</span> or Drag and Drop
              </p>
            </div>
            <input
              id="img-convert-file"
              type="file"
              accept={`.${primaryFormat}`}
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </label>
        ) : (
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 w-full border-primary">
            <p className="text-lg font-semibold text-muted-foreground text-center">
              {inputFile.name.length <= 23
                ? inputFile.name
                : `${inputFile.name.slice(0, 15)}....${inputFile.name.slice(-5)}`}
            </p>
            <Button variant="ghost" onClick={resetUpload} className="text-xs opacity-30" disabled={converting}>
              Choose a different image
            </Button>
          </div>
        )}
      </div>

      {errorMsg && <AlertBox type="error">{errorMsg}</AlertBox>}
      {outputFileURL && !errorMsg && (
        <AlertBox type="success">Conversion complete — click Download to save your {format.toUpperCase()} file.</AlertBox>
      )}

      {loading && (
        <p className="text-xs text-muted-foreground text-center mx-2 mb-2">Loading image engine…</p>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-center border m-2 p-5 rounded-lg">
        <Button onClick={convert} disabled={!inputFile || converting || loading || !!outputFileURL}>
          {converting ? "Converting…" : loading ? "Loading…" : "Convert"}
        </Button>
        {outputFileURL && (
          <a
            href={outputFileURL}
            download={getDownloadFileName()}
            className="bg-primary text-primary-foreground hover:opacity-90 text-sm font-medium flex justify-center items-center gap-2 py-2 rounded-md"
          >
            Download <DownloadSimple size={15} />
          </a>
        )}
        {outputFileURL && (
          <Button onClick={resetUpload} variant="outline">Convert Another</Button>
        )}
      </div>
    </div>
  );
}
