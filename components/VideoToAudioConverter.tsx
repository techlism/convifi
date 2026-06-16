import { useState } from "react";
import { UploadSimple, DownloadSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ConverterInfoSection from "@/components/ConverterInfoSection";
import AlertBox from "@/components/AlertBox";

type Mp3EncoderInstance = {
  encodeBuffer(l: Int16Array, r: Int16Array): Int8Array;
  flush(): Int8Array;
};
type LameGlobal = {
  Mp3Encoder: new (channels: number, sampleRate: number, kbps: number) => Mp3EncoderInstance;
};

// Loads lame.min.js from /public once and caches the promise
let lameLoadPromise: Promise<LameGlobal> | null = null;
function loadLame(): Promise<LameGlobal> {
  if (lameLoadPromise) return lameLoadPromise;
  lameLoadPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") { reject(new Error("SSR")); return; }
    // Already loaded (HMR / second mount)
    if ((window as unknown as Record<string, unknown>).lamejs) {
      resolve((window as unknown as Record<string, LameGlobal>).lamejs);
      return;
    }
    const s = document.createElement("script");
    s.src = "/lame.min.js";
    s.onload = () => resolve((window as unknown as Record<string, LameGlobal>).lamejs);
    s.onerror = () => reject(new Error("Failed to load lame.min.js"));
    document.head.appendChild(s);
  });
  return lameLoadPromise;
}

function encodeWAV(audioBuffer: AudioBuffer): ArrayBuffer {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const numSamples = audioBuffer.length;
  const bytesPerSample = 2;
  const dataSize = numSamples * numChannels * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const write = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  write(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
  view.setUint16(32, numChannels * bytesPerSample, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, dataSize, true);
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const s = Math.max(-1, Math.min(1, audioBuffer.getChannelData(ch)[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }
  return buffer;
}

async function encodeMP3(audioBuffer: AudioBuffer, onProgress: (p: number) => void): Promise<ArrayBuffer> {
  const lame = await loadLame();
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const encoder = new lame.Mp3Encoder(numChannels, sampleRate, 128);
  const chunks: Int8Array[] = [];
  const blockSize = 1152;

  const toInt16 = (ch: Float32Array) => {
    const out = new Int16Array(ch.length);
    for (let i = 0; i < ch.length; i++)
      out[i] = Math.max(-32768, Math.min(32767, ch[i] * 32767));
    return out;
  };

  const left = toInt16(audioBuffer.getChannelData(0));
  const right = numChannels > 1 ? toInt16(audioBuffer.getChannelData(1)) : left;
  const total = left.length;

  for (let i = 0; i < total; i += blockSize) {
    const buf = encoder.encodeBuffer(left.subarray(i, i + blockSize), right.subarray(i, i + blockSize));
    if (buf.length > 0) chunks.push(buf);
    onProgress(Math.round((i / total) * 95));
    if (i % (blockSize * 50) === 0) await new Promise((r) => setTimeout(r, 0));
  }

  const tail = encoder.flush();
  if (tail.length > 0) chunks.push(tail);
  onProgress(100);

  const totalLen = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(totalLen);
  let pos = 0;
  for (const c of chunks) { out.set(new Uint8Array(c.buffer), pos); pos += c.length; }
  return out.buffer;
}

export default function VideoToAudioConverter({ from, to }: { from: string; to: string }) {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputURL, setOutputURL] = useState("");
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  async function convert() {
    if (!inputFile) return;
    setConverting(true);
    setProgress(0);
    setErrorMsg("");
    if (outputURL) URL.revokeObjectURL(outputURL);

    try {
      const arrayBuffer = await inputFile.arrayBuffer();
      const audioCtx = new AudioContext();
      setProgress(10);

      let decoded: AudioBuffer;
      try {
        decoded = await audioCtx.decodeAudioData(arrayBuffer);
      } catch {
        throw new Error(`Browser could not decode ${from.toUpperCase()} audio. Try MP4 or WebM for best compatibility.`);
      }
      setProgress(30);

      let blob: Blob;
      if (to === "wav") {
        const wav = encodeWAV(decoded);
        blob = new Blob([wav], { type: "audio/wav" });
        setProgress(100);
      } else {
        const mp3 = await encodeMP3(decoded, (p) => setProgress(30 + Math.round(p * 0.7)));
        blob = new Blob([mp3], { type: "audio/mpeg" });
      }

      await audioCtx.close();
      setOutputURL(URL.createObjectURL(blob));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Conversion failed.");
      console.error("[convifi] video→audio error:", err);
    } finally {
      setConverting(false);
    }
  }

  function resetUpload() {
    setInputFile(null);
    if (outputURL) URL.revokeObjectURL(outputURL);
    setOutputURL("");
    setErrorMsg("");
    setProgress(0);
  }

  function handleFile(file: File) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (ext !== from.toLowerCase()) {
      setErrorMsg(`Please select a valid ${from.toUpperCase()} file.`);
      return;
    }
    setInputFile(file);
    setErrorMsg("");
    setOutputURL("");
  }

  const preventDefaults = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  const outputName = inputFile
    ? `${inputFile.name.replace(/\.[^.]+$/, "")}.${to}`
    : `output.${to}`;

  return (
    <div>
      <ConverterInfoSection format={to} primaryFormat={from} />
      <div className="flex flex-col border rounded-lg shadow-md">
        <div className="m-2">
          {!inputFile ? (
            <label htmlFor="v2a-file" className="block w-full cursor-pointer">
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
              <input
                id="v2a-file"
                type="file"
                accept={`.${from}`}
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </label>
          ) : (
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 border-primary">
              <p className="text-lg font-semibold text-muted-foreground text-center">
                {inputFile.name.length <= 23
                  ? inputFile.name
                  : `${inputFile.name.slice(0, 15)}....${inputFile.name.slice(-5)}`}
              </p>
              <Button variant="ghost" onClick={resetUpload} className="text-xs opacity-30 mt-1" disabled={converting}>
                Choose a different file
              </Button>
            </div>
          )}
        </div>

        {errorMsg && <AlertBox type="error">{errorMsg}</AlertBox>}
        {outputURL && !errorMsg && (
          <AlertBox type="success">Conversion complete — click Download to save your {to.toUpperCase()} file.</AlertBox>
        )}

        {converting && (
          <div className="m-2 p-3 border rounded-lg space-y-2">
            <p className="text-xs text-muted-foreground">
              {progress < 30 ? "Decoding audio…" : to === "wav" ? "Encoding WAV…" : "Encoding MP3…"}
            </p>
            <Progress value={progress} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-center border m-2 p-5 rounded-lg">
          <Button onClick={convert} disabled={!inputFile || converting || !!outputURL}>
            {converting ? "Converting…" : "Convert"}
          </Button>
          {outputURL && (
            <a
              href={outputURL}
              download={outputName}
              className="bg-primary text-primary-foreground hover:opacity-90 text-sm font-medium flex justify-center items-center gap-2 py-2 rounded-md"
            >
              Download <DownloadSimple size={15} />
            </a>
          )}
          {outputURL && (
            <Button onClick={resetUpload} variant="outline">Convert Another</Button>
          )}
        </div>
      </div>
    </div>
  );
}
