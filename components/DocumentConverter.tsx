import React, { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SpinnerGapIcon, CopyIcon, CheckIcon, DownloadSimpleIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import AlertBox from "@/components/AlertBox";
import { createPandocInstance } from "@/lib/pandoc-core.js";
import { inputFormats, outputFormats } from "@/lib/document-formats";
import { Label } from "@/components/ui/label";

type InputFormat = keyof typeof inputFormats;
type OutputFormat = keyof typeof outputFormats;

interface PandocConverterProps {
  defaultSourceFormat?: InputFormat;
  defaultTargetFormat?: OutputFormat;
}

const PandocConverter: React.FC<PandocConverterProps> = ({
  defaultSourceFormat,
  defaultTargetFormat,
}) => {
  const [sourceFormat, setSourceFormat] = useState<InputFormat | "">("");
  const [targetFormat, setTargetFormat] = useState<OutputFormat | "">("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState<Uint8Array | null>(null);
  const [textContent, setTextContent] = useState("");
  const [outputContent, setOutputContent] = useState("");
  const [pandocInstance, setPandocInstance] = useState<
    | ((
        options: Record<string, unknown>,
        stdin: string,
        files: Record<string, string>
      ) => Promise<{ stdout: string }>)
    | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate and set default formats
  useEffect(() => {
    if (defaultSourceFormat && defaultTargetFormat) {
      const resolvedSource =
        defaultSourceFormat === "html" ? "html" : defaultSourceFormat;
      const resolvedTarget =
        defaultTargetFormat === "html" ? "html5" : defaultTargetFormat;

      if (
        !(resolvedSource in inputFormats) ||
        !(resolvedTarget in outputFormats)
      ) {
        setError(
          "Invalid default format configuration provided. Please use the select menus below."
        );
        return;
      }
      setSourceFormat(resolvedSource as InputFormat);
      setTargetFormat(resolvedTarget as OutputFormat);
    }
  }, [defaultSourceFormat, defaultTargetFormat]);

  const getAcceptedFileTypes = useCallback(() => {
    if (sourceFormat) {
      const format = inputFormats[sourceFormat];
      return format.ext ? `${format.ext}` : undefined;
    }
    return Object.values(inputFormats)
      .map((format) => (format.ext ? `${format.ext}` : null))
      .filter(Boolean)
      .join(",");
  }, [sourceFormat]);

  const initializePandoc = useCallback(async () => {
    try {
      const response = await fetch("/pandoc.wasm");
      if (!response.ok)
        throw new Error(`Failed to fetch pandoc.wasm: ${response.status}`);
      const wasmBinary = await response.arrayBuffer();
      const instance = await createPandocInstance(wasmBinary);
      setPandocInstance(() => instance.convert);
      setIsLoading(false);
    } catch (err) {
      setError(`Failed to initialize Pandoc: ${(err as Error).message}`);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializePandoc();
  }, [initializePandoc]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      setFileContent(new Uint8Array(buffer));
      setFileName(file.name);
      setTextContent("");

      const extension = file.name.split(".").pop()?.toLowerCase();
      const formatEntry = Object.entries(inputFormats).find(([key]) => {
        const fmt = inputFormats[key];
        return fmt?.ext?.endsWith(extension || "");
      });

      if (formatEntry) {
        setSourceFormat(formatEntry[0] as InputFormat);
      }
    } catch (err) {
      setError(`Failed to read file: ${(err as Error).message}`);
    }
  };

  function resetFileSelection() {
    setFileContent(null);
    setFileName("");
    setTextContent("");
    setOutputContent("");
    setError(null);
    if (!defaultSourceFormat) {
      setSourceFormat("");
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      try {
        const buffer = await file.arrayBuffer();
        setFileContent(new Uint8Array(buffer));
        setFileName(file.name);
        setTextContent("");

        const extension = file.name.split(".").pop()?.toLowerCase();
        const formatEntry = Object.entries(inputFormats).find(([key]) => {
          const fmt = inputFormats[key];
          return fmt?.ext?.endsWith(extension || "");
        });

        if (formatEntry) {
          setSourceFormat(formatEntry[0] as InputFormat);
        }
      } catch (err) {
        setError(`Failed to read file: ${(err as Error).message}`);
      }
    }
  };

  const handleConvert = useCallback(async () => {
    if (
      !pandocInstance ||
      (!fileContent && !textContent) ||
      !sourceFormat ||
      !targetFormat
    )
      return;

    setError(null);
    setIsConverting(true);
    try {
      const isBinaryInput = inputFormats[sourceFormat]?.binary;
      const isBinaryOutput = outputFormats[targetFormat]?.binary;

      const options: Record<string, unknown> = {
        from: String(sourceFormat),
        to: String(targetFormat),
        standalone: true,
      };

      let stdin = "";
      const files: Record<string, string | Blob> = {};

      if (isBinaryInput && fileContent) {
        const inputFileName = `input${inputFormats[sourceFormat].ext}`;
        files[inputFileName] = new Blob([fileContent.slice()]);
        options["input-files"] = [inputFileName];
      } else {
        stdin = fileContent ? new TextDecoder().decode(fileContent) : textContent;
      }

      const outputFileName = isBinaryOutput
        ? `output${outputFormats[targetFormat].ext ?? ".bin"}`
        : null;
      if (outputFileName) {
        options["output-file"] = outputFileName;
      }

      // Cast needed because pandoc-core's files param accepts Blob but our
      // stored state type uses string for compatibility with setPandocInstance.
      const convert = pandocInstance as unknown as (
        options: Record<string, unknown>,
        stdin: string,
        files: Record<string, string | Blob>
      ) => Promise<{ stdout: string; files?: Record<string, Blob> }>;

      const result = await convert(options, stdin, files);

      if (isBinaryOutput && outputFileName) {
        const outBlob = result.files?.[outputFileName];
        if (outBlob) {
          const outputFormatConfig = outputFormats[targetFormat];
          const ext = outputFormatConfig.ext ?? ".bin";
          const name = `${(fileName || "output").split(".")[0]}${ext}`;
          const url = URL.createObjectURL(outBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setOutputContent("[binary file downloaded]");
        } else {
          setError("Conversion produced no output. The format combination may not be supported.");
        }
      } else {
        setOutputContent(result.stdout);
      }
    } catch (err) {
      setError(`Conversion failed: ${(err as Error).message}`);
    } finally {
      setIsConverting(false);
    }
  }, [pandocInstance, fileContent, textContent, sourceFormat, targetFormat, fileName]);

  const downloadOutput = (
    content: string,
    formatConfig: (typeof outputFormats)[OutputFormat]
  ) => {
    const extension = formatConfig.ext || ".txt";
    const outputFileName = `${fileName.split(".")[0] || "output"}${extension}`;
    const blob = new Blob([content], {
      type: formatConfig.mime || "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = outputFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    if (!outputContent || !targetFormat) return;
    const formatConfig = outputFormats[targetFormat];
    downloadOutput(outputContent, formatConfig);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Failed to copy to clipboard");
    }
  };

  const preventDefaults = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const formatsLocked =
    defaultSourceFormat !== undefined &&
    defaultTargetFormat !== undefined &&
    defaultSourceFormat in inputFormats &&
    (defaultTargetFormat === "html" ? "html5" : defaultTargetFormat) in outputFormats;

  const isSourceBinary = sourceFormat
    ? inputFormats[sourceFormat]?.binary
    : false;
  const isTargetBinary = targetFormat
    ? outputFormats[targetFormat]?.binary
    : false;

  return (
    <Card className="m-1">
      <CardContent className="space-y-4 p-4">
        {fileName === "" ? (
          <Label htmlFor="dropzone-doc-file" className="block w-full cursor-pointer">
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg gap-2 p-8 w-full"
              onDragOver={preventDefaults}
              onDragEnter={preventDefaults}
              onDragLeave={preventDefaults}
              onDrop={handleDrop}
            >
              <UploadSimpleIcon size={24} />
              <p className="mb-2 text-sm text-muted-foreground text-center">
                <span className="font-semibold">Click to Select</span> or Drag and Drop
              </p>
            </div>
            <input
              type="file"
              id="dropzone-doc-file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept={getAcceptedFileTypes()}
            />
          </Label>
        ) : (
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 border-primary">
            <p className="text-lg font-semibold text-muted-foreground text-center">
              {fileName.length <= 23
                ? fileName
                : `${fileName.substring(0, 15)}....${fileName.substring(fileName.length - 5)}`}
            </p>
            <Button
              variant="ghost"
              onClick={resetFileSelection}
              className="text-sm opacity-30"
            >
              Choose a different document or discard selection
            </Button>
          </div>
        )}

        {error && <AlertBox type="error">{error}</AlertBox>}
        {outputContent && !error && (
          <AlertBox type="success">Conversion complete — copy or download the result below.</AlertBox>
        )}

        <div className="flex gap-4 flex-wrap">
          <Select
            value={sourceFormat}
            onValueChange={(value: InputFormat) => setSourceFormat(value)}
            disabled={isLoading || formatsLocked}
          >
            <SelectTrigger className="min-w-50 flex-1">
              <SelectValue placeholder="Source format" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(inputFormats).map(([key, format]) => (
                <SelectItem key={key} value={key}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={targetFormat}
            onValueChange={(value: OutputFormat) => setTargetFormat(value)}
            disabled={isLoading || formatsLocked}
          >
            <SelectTrigger className="min-w-50 flex-1">
              <SelectValue placeholder="Target format" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(outputFormats)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, format]) => (
                  <SelectItem key={key} value={key}>
                    {format.label.toUpperCase()}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {!isSourceBinary && (
          <Textarea
            placeholder="Paste or type your content here..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="h-48 resize-none"
          />
        )}

        {!isTargetBinary && outputContent && (
          <div className="relative">
            <Textarea value={outputContent} readOnly className="h-64 resize-none" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={copyToClipboard}
            >
              {copied ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        <div className="flex justify-center gap-4 flex-wrap">
          <Button
            onClick={handleConvert}
            disabled={
              isLoading || isConverting || (!fileContent && !textContent) || !sourceFormat || !targetFormat
            }
            className="w-36"
          >
            {isLoading ? (
              <>
                <SpinnerGapIcon className="h-4 w-4 animate-spin mr-2" />
                Loading…
              </>
            ) : isConverting ? (
              <>
                <SpinnerGapIcon className="h-4 w-4 animate-spin mr-2" />
                Converting…
              </>
            ) : (
              "Convert"
            )}
          </Button>

          {outputContent && (isTargetBinary || targetFormat) && (
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <DownloadSimpleIcon className="h-4 w-4" />
              Download
            </Button>
          )}

          {outputContent && (
            <Button onClick={resetFileSelection} variant="outline">
              Convert Another
            </Button>
          )}
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground text-center">
            Loading Pandoc WASM… this may take a moment on first load.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PandocConverter;
