import { useRef, useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { DownloadSimple, UploadSimple, FilmStrip, MusicNote } from "@phosphor-icons/react";
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
import { Switch } from "@/components/ui/switch";
import { ChangeFileAlertDialog } from "@/components/ChangeFileAlert";
import AlertBox from "@/components/AlertBox";

type CoreConfig = {
  coreURL: string;
  wasmURL: string;
  workerURL?: string;
};

interface VideoSettings {
  resolution: string;
  aspectRatio: string;
  constantQuality: string;
  frameRate: string;
  audioCodec: string;
  audioBitrate: string;
  channels: string;
  volume: string;
  sampleRate: string;
  fit: string;
  preset: string;
}

const DEFAULT_SETTINGS: VideoSettings = {
  resolution: "original",
  aspectRatio: "original",
  constantQuality: "original",
  frameRate: "original",
  audioCodec: "original",
  audioBitrate: "original",
  channels: "original",
  volume: "original",
  sampleRate: "original",
  fit: "original",
  preset: "original",
};

const CORE_BASE = (mt: boolean) =>
  `https://unpkg.com/@ffmpeg/core${mt ? "-mt" : ""}@0.12.6/dist/esm`;

export default function VideoProperties({
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
  const [settings, setSettings] = useState<VideoSettings>(DEFAULT_SETTINGS);
  const [percentProgress, setPercentProgress] = useState(0);
  const [converting, setConverting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [useMultithreading, setUseMultithreading] = useState(false);

  const parseProgress = useCallback((msg: string) => {
    if (!msg) return;
    if (msg.includes("Duration:")) {
      const dur = msg.split("Duration:")[1].split(",")[0].trim();
      const [h, m, s] = dur.split(":").map(Number);
      totalDurationRef.current = h * 3600 + m * 60 + Math.floor(s);
      console.log("[ffmpeg] total duration:", totalDurationRef.current, "s");
    }
    if (msg.includes("time=")) {
      const t = msg.split("time=")[1].split(" ")[0].trim();
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

    const loadFFmpeg = async () => {
      setFFmpegLoading(true);
      setLoaded(false);
      setErrorMsg("");

      ffmpeg.on("log", ({ message: msg }) => {
        parseProgress(msg);
      });

      if (useMultithreading && typeof SharedArrayBuffer === "undefined") {
        setErrorMsg(
          "Multithreading requires cross-origin isolation (SharedArrayBuffer). " +
          "Try disabling multithreading, or ensure COOP/COEP headers are set."
        );
        setFFmpegLoading(false);
        return;
      }

      const base = CORE_BASE(useMultithreading);
      const coreConfig: CoreConfig = {
        coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
      };
      if (useMultithreading) {
        coreConfig.workerURL = await toBlobURL(
          `${base}/ffmpeg-core.worker.js`,
          "text/javascript",
        );
      }

      try {
        await ffmpeg.load(coreConfig);
        console.log(
          `[convifi] ffmpeg loaded — ${useMultithreading ? "multi" : "single"}-thread, ` +
          `crossOriginIsolated=${typeof crossOriginIsolated !== "undefined" ? crossOriginIsolated : "unknown"}`
        );
        setLoaded(true);
      } catch (error) {
        console.error("[convifi] failed to load FFmpeg:", error);
        setErrorMsg(`Failed to load FFmpeg: ${String(error)}`);
      } finally {
        setFFmpegLoading(false);
      }
    };

    loadFFmpeg();

    return () => {
      try { ffmpeg.terminate(); } catch { /* ignore */ }
      if (outputFileURL) URL.revokeObjectURL(outputFileURL);
    };
  }, [useMultithreading, parseProgress]);

  const getFFmpegAttributes = () => {
    const attributes: string[] = [];

    if (settings.resolution !== "original") attributes.push("-vf", settings.resolution);
    if (settings.constantQuality !== "original") attributes.push(...settings.constantQuality.split(" "));
    if (settings.fit !== "original") attributes.push(...settings.fit.split(" "));
    if (settings.frameRate !== "original") attributes.push("-r", settings.frameRate);
    if (settings.aspectRatio !== "original") attributes.push(...settings.aspectRatio.split(" "));
    if (settings.audioCodec !== "original") attributes.push(...settings.audioCodec.split(" "));
    if (settings.audioBitrate !== "original") attributes.push("-b:a", settings.audioBitrate.replace("-b:v ", ""));
    if (settings.channels !== "original") attributes.push(...settings.channels.split(" "));
    if (settings.volume !== "original") attributes.push("-af", settings.volume);
    if (settings.sampleRate !== "original") attributes.push(...settings.sampleRate.split(" "));
    if (settings.preset !== "original") attributes.push(...settings.preset.split(" "));

    if (format === "webm") {
      // VP8 + Vorbis; for CRF mode, libvpx needs -b:v 0
      attributes.push("-c:v", "libvpx", "-b:v", "0", "-c:a", "libvorbis");
      if (!attributes.includes("-crf")) attributes.push("-crf", "14");
    }

    return attributes;
  };

  const FFMPEGProcessor = async () => {
    if (!loaded || !inputFile || !ffmpegRef.current) return;

    const ffmpeg = ffmpegRef.current;
    setConverting(true);
    setPercentProgress(0);
    setErrorMsg("");
    totalDurationRef.current = -1;
    if (outputFileURL) { URL.revokeObjectURL(outputFileURL); setOutputFileURL(""); }

    try {
      console.log(`[convifi] writing input.${primaryFormat}…`);
      await ffmpeg.writeFile(`input.${primaryFormat}`, await fetchFile(inputFile));

      const attributes = getFFmpegAttributes();
      const cmd = ["-i", `input.${primaryFormat}`, ...attributes, `output.${format}`];
      console.log("[convifi] exec:", cmd.join(" "));

      const code = await ffmpeg.exec(cmd);
      console.log("[convifi] exec exit code:", code);

      if (code !== 0) {
        setErrorMsg(`FFmpeg exited with code ${code}. Check the logs below for details.`);
                return;
      }

      const fileData = await ffmpeg.readFile(`output.${format}`);
      const data = new Uint8Array(fileData as unknown as ArrayBuffer);
      const dataBlob = new Blob([data], { type: `video/${format}` });

      if (dataBlob.size > 0) {
        setPercentProgress(100);
        setOutputFileURL(URL.createObjectURL(dataBlob));
      } else {
        setErrorMsg("Output file is empty. Check the logs below.");
              }

      await ffmpeg.deleteFile(`input.${primaryFormat}`).catch(() => {});
      await ffmpeg.deleteFile(`output.${format}`).catch(() => {});
    } catch (error) {
      console.error("[convifi] conversion error:", error);
      setErrorMsg(`Conversion failed: ${String(error)}`);
          } finally {
      setConverting(false);
    }
  };

  const resetUpload = () => {
    setConverting(false);
    setInputFile(null);
    if (outputFileURL) URL.revokeObjectURL(outputFileURL);
    setOutputFileURL("");
    setErrorMsg("");
    setSettings(DEFAULT_SETTINGS);
    setPercentProgress(0);
    totalDurationRef.current = -1;
  };

  const handleSettingChange = (key: keyof VideoSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleAudioBitrateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const bitrate = event.target.value;
    if (!Number.isNaN(Number(bitrate)) && bitrate !== "") {
      handleSettingChange("audioBitrate", `${bitrate}k`);
    } else {
      handleSettingChange("audioBitrate", "original");
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

  const buttonLabel = () => {
    if (ffmpegLoading) return inputFile ? "Loading FFmpeg…" : "Loading…";
    if (converting) return "Converting…";
    return "Convert";
  };

  return (
    <div className="flex align-middle justify-center flex-col rounded-lg shadow-md border p-2 mt-2">
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
            {!converting ? (
              <Button variant="ghost" onClick={resetUpload} className="opacity-50">
                Choose a different video
              </Button>
            ) : (
              <ChangeFileAlertDialog resetUpload={resetUpload} fileType="video" />
            )}
          </div>
        )}
      </div>

      {errorMsg && <AlertBox type="error">{errorMsg}</AlertBox>}
      {outputFileURL && !errorMsg && (
        <AlertBox type="success">Conversion complete — click Download to save your file.</AlertBox>
      )}

      <div className="flex flex-col space-y-6 m-2 border p-5 rounded-lg">
        <div className={`${converting && inputFile ? "blur disabled" : ""}`}>
          <h2 className="flex items-center text-xl font-semibold">
            <FilmStrip className="mr-2 text-gray-600" size={22} />
            Video
          </h2>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xl:gap-14 lg:gap-12 md:gap-8 gap-6 items-center">
            <div className="flex flex-col">
              <strong className="font-medium flex align-middle p-3 items-center justify-between">
                Resolution <InfoTooltip information="The resolution determines the amount of detail (pixels) and clarity of the video. Generally, higher pixels mean higher quality." />
              </strong>
              <Select onValueChange={(v) => handleSettingChange("resolution", v)}>
                <SelectTrigger id="resolution"><SelectValue placeholder="Unchanged" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="original" className="font-bold">Original</SelectItem>
                    <Separator />
                    <SelectItem value="scale=426:240">240p (426x240)</SelectItem>
                    <SelectItem value="scale=640:480">480p (640x480)</SelectItem>
                    <SelectItem value="scale=1280:720">720p (1280x720)</SelectItem>
                    <SelectItem value="scale=1920:1080">1080p (1920x1080)</SelectItem>
                    <SelectItem value="scale=2560:1440">1440p (2560x1440)</SelectItem>
                    <SelectItem value="scale=3840:2160">2160p (3840x2160)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <strong className="font-medium flex align-middle p-3 items-center justify-between">
                Constant Quality (CRF) <InfoTooltip information="The CRF value sets the video quality. Lower values mean better quality but longer conversion times." />
              </strong>
              <Select onValueChange={(v) => handleSettingChange("constantQuality", v)}>
                <SelectTrigger id="crf"><SelectValue placeholder="23 (Normal) | Unchanged" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="original" className="font-bold">Original</SelectItem>
                    <Separator />
                    <SelectItem value="-crf 0">0 (Lossless)</SelectItem>
                    <SelectItem value="-crf 18">18 (High Quality)</SelectItem>
                    <SelectItem value="-crf 23">23 (Normal)</SelectItem>
                    <SelectItem value="-crf 28">28 (Low Quality)</SelectItem>
                    <SelectItem value="-crf 51">51 (Worst Quality)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <strong className="font-medium flex align-middle p-3 items-center justify-between">
                Fit | Crop <InfoTooltip information="Sets the mode of sizing the video." />
              </strong>
              <Select onValueChange={(v) => handleSettingChange("fit", v)}>
                <SelectTrigger id="fit"><SelectValue placeholder="Unchanged" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="original" className="font-bold">Original</SelectItem>
                    <Separator />
                    <SelectItem value="-vf scale=-2:1080">Scale (to 1080p, maintain aspect ratio)</SelectItem>
                    <SelectItem value="-filter:v crop=in_h*9/16:in_h:(in_w-in_h*9/16)/2:0">Crop Vertically (to 16:9)</SelectItem>
                    <SelectItem value="-vf pad=1920:1080:-1:-1:color=black">Pad (to 1920x1080, black bars)</SelectItem>
                    <SelectItem value="-vf pad=1920:1080:-1:-1:color=white">Pad (to 1920x1080, white bars)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <strong className="font-medium flex align-middle p-3 items-center justify-between">
                Aspect Ratio <InfoTooltip information="Aspect ratio refers to the proportional relationship between the width and height of a video." />
              </strong>
              <Select onValueChange={(v) => handleSettingChange("aspectRatio", v)}>
                <SelectTrigger id="aspectRatio"><SelectValue placeholder="Unchanged" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="original" className="font-bold">Original</SelectItem>
                    <Separator />
                    <SelectItem value="-aspect 16:9">16:9 - Normal</SelectItem>
                    <SelectItem value="-aspect 4:3">4:3 - WideScreen</SelectItem>
                    <SelectItem value="-aspect 21:9">21:9 - Cinematic</SelectItem>
                    <SelectItem value="-aspect 1:1">1:1 - Square</SelectItem>
                    <SelectItem value="-aspect 9:16">9:16 - Portrait</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <strong className="font-medium flex align-middle p-3 items-center justify-between">
                FPS (Frame Rate) <InfoTooltip information="FPS - Frames Per Second. 60fps - Smooth, 30fps - Most Commonly used, 24 - For Cinema." />
              </strong>
              <Select onValueChange={(v) => handleSettingChange("frameRate", v)}>
                <SelectTrigger id="fps"><SelectValue placeholder="Unchanged" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="original" className="font-bold">Original</SelectItem>
                    <Separator />
                    <SelectItem value="24">24 FPS</SelectItem>
                    <SelectItem value="25">25 FPS</SelectItem>
                    <SelectItem value="30">30 FPS</SelectItem>
                    <SelectItem value="60">60 FPS</SelectItem>
                    <SelectItem value="120">120 FPS</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <strong className="font-medium flex align-middle p-3 items-center justify-between">
                Preset <InfoTooltip information="The preset impacts how the video data is compressed during encoding. Use when time is crucial." />
              </strong>
              <Select onValueChange={(v) => handleSettingChange("preset", v)}>
                <SelectTrigger id="preset"><SelectValue placeholder="Unchanged | Default (Medium)" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="original" className="font-bold">Original</SelectItem>
                    <Separator />
                    <SelectItem value="-preset ultrafast">Ultrafast</SelectItem>
                    <SelectItem value="-preset superfast">Superfast</SelectItem>
                    <SelectItem value="-preset veryfast">Veryfast</SelectItem>
                    <SelectItem value="-preset faster">Faster</SelectItem>
                    <SelectItem value="-preset fast">Fast</SelectItem>
                    <SelectItem value="-preset medium">Medium</SelectItem>
                    <SelectItem value="-preset slow">Slow</SelectItem>
                    <SelectItem value="-preset slower">Slower</SelectItem>
                    <SelectItem value="-preset veryslow">Veryslow</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div className={`${converting && inputFile ? "blur disabled" : ""}`}>
          <h2 className="flex items-center text-xl font-semibold">
            <MusicNote className="mr-2 text-gray-600" size={22} />
            Audio
          </h2>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xl:gap-14 lg:gap-12 md:gap-8 gap-6 items-center">
            <div className="flex flex-col">
              <strong className="font-medium flex align-middle p-3 items-center justify-between">
                Audio Codec <InfoTooltip information="The audio codec is a type of program used to compress and decompress digital audio files." />
              </strong>
              <Select onValueChange={(v) => handleSettingChange("audioCodec", v)}>
                <SelectTrigger id="audio-codec"><SelectValue placeholder="AAC" /></SelectTrigger>
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
                Audio Bitrate <InfoTooltip information="Bitrate refers to the amount of audio data transmitted per second (kbps). Higher bitrates result in better sound quality." />
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
              <Select onValueChange={(v) => handleSettingChange("channels", v)}>
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
              <Select onValueChange={(v) => handleSettingChange("volume", v)}>
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
                Sample Rate <InfoTooltip information="Sample rate (Hz) refers to the number of samples of audio per second. Common rates include 44.1 kHz (CD quality) and 48 kHz (professional)." />
              </strong>
              <Select onValueChange={(v) => handleSettingChange("sampleRate", v)}>
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
        <Progress value={percentProgress} className="text-grey-500" />
        <div className="flex items-center space-x-2">
          <Switch
            id="use-multithreading"
            checked={useMultithreading}
            onCheckedChange={() => {
              if (!converting) {
                resetUpload();
                setUseMultithreading((prev) => !prev);
              }
            }}
          />
          <Label htmlFor="use-multithreading">Use Multithreading</Label>
          <InfoTooltip information="Multithreading will generally take less time but will consume more RAM and requires cross-origin isolation (COOP/COEP headers)." />
        </div>

        {ffmpegLoading && (
          <p className="text-sm text-muted-foreground">
            Loading FFmpeg ({useMultithreading ? "multi-thread" : "single-thread"})…
          </p>
        )}
        {loaded && !ffmpegLoading && (
          <p className="text-sm text-green-600 dark:text-green-400">
            ✓ FFmpeg ready ({useMultithreading ? "MT" : "ST"})
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-3 items-center">
          <Button
            onClick={FFMPEGProcessor}
            disabled={inputFile === null || converting || ffmpegLoading}
            className="text-md"
          >
            {buttonLabel()}
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
