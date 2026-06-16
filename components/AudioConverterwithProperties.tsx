import { useEffect, useRef, useState, useCallback } from "react";
import { DownloadSimple, UploadSimple, MusicNote } from "@phosphor-icons/react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import {
  SelectValue,
  SelectTrigger,
  SelectContent,
  Select,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import InfoTooltip from "@/components/InfoTooltip";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import AlertBox from "@/components/AlertBox";

const CORE_BASE = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

export default function AudioConverterWithProperties({
  format,
  primaryFormat,
}: {
  format: string;
  primaryFormat: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [ffmpegLoading, setFFmpegLoading] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const totalDurationRef = useRef(-1);

  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputFileURL, setOutputFileURL] = useState<string>("");
  const [audioCodec, setAudioCodec] = useState<string>("original");
  const [audioBitrate, setAudioBitrate] = useState<string>("original");
  const [channels, setChannels] = useState<string>("original");
  const [volume, setVolume] = useState<string>("original");
  const [sampleRate, setSampleRate] = useState<string>("original");
  const [percentProgress, setPercentProgress] = useState(0);
  const [converting, setConverting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const parseProgress = useCallback((msg: string) => {
    if (!msg) return;
    if (msg.includes("Duration:")) {
      const dur = msg.split("Duration:")[1]?.split(",")[0]?.trim();
      if (dur) {
        const [h, m, s] = dur.split(":").map(Number);
        totalDurationRef.current = h * 3600 + m * 60 + Math.floor(s);
      }
    }
    if (msg.includes("time=")) {
      const t = msg.split("time=")[1]?.split(" ")[0]?.trim();
      if (!t) return;
      const [h, m, s] = t.split(":").map(Number);
      const current = h * 3600 + m * 60 + Math.floor(s);
      if (totalDurationRef.current > 0) {
        setPercentProgress(Math.min((current / totalDurationRef.current) * 100, 100));
      }
    }
  }, []);

  useEffect(() => {
    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;
    totalDurationRef.current = -1;

    const load = async () => {
      setFFmpegLoading(true);
      setLoaded(false);
      setErrorMsg("");

      ffmpeg.on("log", ({ message: msg }) => {
        parseProgress(msg);
      });

      try {
        await ffmpeg.load({
          coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
        });
        setLoaded(true);
      } catch (error) {
        console.error("[convifi] failed to load FFmpeg:", error);
        setErrorMsg(`Failed to load FFmpeg: ${String(error)}`);
      } finally {
        setFFmpegLoading(false);
      }
    };

    load();

    return () => {
      try { ffmpeg.terminate(); } catch { /* ignore */ }
      if (outputFileURL) URL.revokeObjectURL(outputFileURL);
    };
  }, [parseProgress]);

  const FFMPEGProcessor = async () => {
    if (!loaded || !inputFile || !ffmpegRef.current) return;

    const ffmpeg = ffmpegRef.current;
    setConverting(true);
    setPercentProgress(0);
    setErrorMsg("");
    totalDurationRef.current = -1;
    if (outputFileURL) { URL.revokeObjectURL(outputFileURL); setOutputFileURL(""); }

    const appliedAttributes: string[] = [];
    if (audioCodec !== "original") appliedAttributes.push(...audioCodec.split(" "));
    if (channels !== "original") appliedAttributes.push(...channels.split(" "));
    if (volume !== "original") appliedAttributes.push("-af", volume);
    if (sampleRate !== "original") appliedAttributes.push(...sampleRate.split(" "));
    if (audioBitrate !== "original") appliedAttributes.push("-b:a", audioBitrate);

    try {
      await ffmpeg.writeFile(`input.${primaryFormat}`, await fetchFile(inputFile));

      const cmd = ["-i", `input.${primaryFormat}`, ...appliedAttributes, `output.${format}`];

      const code = await ffmpeg.exec(cmd);

      if (code !== 0) {
        setErrorMsg(`FFmpeg exited with code ${code}. Check the logs below for details.`);
                return;
      }

      const fileData = await ffmpeg.readFile(`output.${format}`);
      const data = new Uint8Array(fileData as unknown as ArrayBuffer);
      const dataBlob = new Blob([data], { type: `audio/${format}` });

      if (dataBlob.size > 0) {
        setPercentProgress(100);
        setOutputFileURL(URL.createObjectURL(dataBlob));
      } else {
        setErrorMsg("Output file is empty. Check the logs below.");
              }

      await ffmpeg.deleteFile(`input.${primaryFormat}`).catch(() => {});
      await ffmpeg.deleteFile(`output.${format}`).catch(() => {});
    } catch (error) {
      console.error("[convifi] audio conversion error:", error);
      setErrorMsg(`Conversion failed: ${String(error)}`);
          } finally {
      setConverting(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setInputFile(e.dataTransfer.files[0]);
    }
  };

  const preventDefaults = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const resetUpload = () => {
    setInputFile(null);
    if (outputFileURL) URL.revokeObjectURL(outputFileURL);
    setOutputFileURL("");
    setErrorMsg("");
    setAudioCodec("original");
    setAudioBitrate("original");
    setChannels("original");
    setVolume("original");
    setSampleRate("original");
    setPercentProgress(0);
    totalDurationRef.current = -1;
  };

  const handleAudioBitrateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const bitrate = event.target.value;
    if (!Number.isNaN(Number(bitrate)) && bitrate !== "") {
      setAudioBitrate(`${bitrate}k`);
    } else {
      setAudioBitrate("original");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file?.name.toLowerCase().endsWith(primaryFormat)) {
      setInputFile(file);
      setErrorMsg("");
    } else if (file) {
      setErrorMsg(`This is not a valid ${primaryFormat} file. Please select a valid ${primaryFormat} file.`);
    }
  };

  return (
    <div className="flex align-middle justify-center flex-col rounded-lg shadow-md border p-2">
      <div className="m-2">
        {inputFile === null ? (
          <label htmlFor="dropzone-file" className="block w-full cursor-pointer">
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 w-full"
              onDragOver={preventDefaults}
              onDragEnter={preventDefaults}
              onDragLeave={preventDefaults}
              onDrop={handleDrop}
            >
              <UploadSimple size={24} />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                <span className="font-semibold">Click to Select</span> or Drag and Drop
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept={`.${primaryFormat}`}
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 w-full border-primary">
            <p className="text-lg font-semibold text-gray-500 dark:text-gray-400 text-center">
              {inputFile.name.length <= 23
                ? inputFile.name
                : `${inputFile.name.substring(0, 15)}....${inputFile.name.substring(inputFile.name.length - 5)}`}
            </p>
            <Button
              variant="ghost"
              onClick={resetUpload}
              className="text-xs opacity-30"
              disabled={converting}
            >
              Choose a different audio
            </Button>
          </div>
        )}
      </div>

      {errorMsg && <AlertBox type="error">{errorMsg}</AlertBox>}
      {outputFileURL && !errorMsg && (
        <AlertBox type="success">Conversion complete — click Download to save your file.</AlertBox>
      )}

      <div className="flex flex-col space-y-6 m-2 border p-5 rounded-lg">
        <div className={`${converting ? "blur disabled" : ""}`}>
          <h2 className="flex items-center text-xl font-semibold">
            <MusicNote className="mr-2 text-gray-600" size={22} />
            Audio
          </h2>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xl:gap-14 lg:gap-12 md:gap-8 gap-6 items-center">
            <div className="flex flex-col">
              <strong className="font-medium flex align-middle p-3 items-center justify-between">
                Audio Codec <InfoTooltip information="An Audio Codec converts audio data from one format to another." />
              </strong>
              <Select onValueChange={setAudioCodec}>
                <SelectTrigger id="audio-codec"><SelectValue placeholder="Unchanged | Selected" /></SelectTrigger>
                <SelectGroup>
                  <SelectContent>
                    <SelectItem value="original" className="font-bold">Original</SelectItem>
                    <Separator />
                    <SelectItem value="-c:a aac">AAC</SelectItem>
                    <SelectItem value="-c:a copy">COPY</SelectItem>
                    <SelectItem value="-an">NONE (No Audio)</SelectItem>
                  </SelectContent>
                </SelectGroup>
              </Select>
            </div>
            <div className="flex flex-col">
              <strong className="font-medium flex align-middle p-3 items-center justify-between">
                Audio Bitrate <InfoTooltip information="Bitrate (kbps) — higher values mean better quality but larger files. 128 kbps for podcasts, 320 kbps for music." />
              </strong>
              <Input
                placeholder="Enter bitrate (e.g. 128 kbps)"
                onChange={handleAudioBitrateChange}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <div className="flex flex-col">
              <strong className="font-medium flex align-middle p-3 items-center justify-between">
                Channel <InfoTooltip information="Mono has one channel, Stereo uses two channels for left and right speakers." />
              </strong>
              <Select onValueChange={setChannels}>
                <SelectTrigger id="channels"><SelectValue placeholder="Unchanged" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="original" className="font-bold">Original</SelectItem>
                  <Separator />
                  <SelectItem value="-ac 2">Stereo</SelectItem>
                  <SelectItem value="-ac 1">Mono</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <strong className="font-medium flex align-middle p-3 items-center justify-between">
                Volume <InfoTooltip information="Volume refers to the loudness or intensity of the sound." />
              </strong>
              <Select onValueChange={setVolume}>
                <SelectTrigger id="volume"><SelectValue placeholder="Unchanged" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="volume=1.5">+50%</SelectItem>
                  <SelectItem value="volume=1.2">+20%</SelectItem>
                  <SelectItem value="volume=1.1">+10%</SelectItem>
                  <Separator />
                  <SelectItem value="original" className="font-bold">Original</SelectItem>
                  <Separator />
                  <SelectItem value="volume=0.9">-10%</SelectItem>
                  <SelectItem value="volume=0.8">-20%</SelectItem>
                  <SelectItem value="volume=0.5">-50%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <strong className="font-medium flex align-middle p-3 items-center justify-between">
                Sample Rate <InfoTooltip information="Sample rate (Hz) — 44.1 kHz is CD quality, 48 kHz is professional standard." />
              </strong>
              <Select onValueChange={setSampleRate}>
                <SelectTrigger id="sample-rate"><SelectValue placeholder="Unchanged" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="original" className="font-bold">Original</SelectItem>
                  <Separator />
                  <SelectItem value="-ar 44100">44100 Hz</SelectItem>
                  <SelectItem value="-ar 48000">48000 Hz</SelectItem>
                  <SelectItem value="-ar 96000">96000 Hz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 items-center gap-5 border m-2 rounded-lg">
        <Progress value={percentProgress} />

        {ffmpegLoading && (
          <p className="text-sm text-muted-foreground">Loading FFmpeg…</p>
        )}
        {loaded && !ffmpegLoading && (
          <p className="text-sm text-green-600 dark:text-green-400">✓ FFmpeg ready</p>
        )}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-3 items-center">
          <Button
            onClick={FFMPEGProcessor}
            disabled={!loaded || inputFile === null || converting || ffmpegLoading}
            className="text-md"
          >
            {converting ? "Converting…" : ffmpegLoading ? "Loading…" : "Convert"}
          </Button>
          {outputFileURL !== "" && (
            <a
              href={outputFileURL}
              download={`${inputFile?.name.slice(0, Number((format.length + 1) * -1))}.${format}`}
              className="bg-primary text-primary-foreground hover:opacity-90 text-md font-medium flex justify-center items-center align-middle pt-2 pb-2 rounded-md"
            >
              Download <DownloadSimple size={15} className="ml-2" />
            </a>
          )}
          {outputFileURL !== "" && (
            <Button onClick={resetUpload} className="text-md" variant="outline">
              Convert Another
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
