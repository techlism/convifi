import { LockSimple } from "@phosphor-icons/react";

export default function DocumentConverterInfoSection({
  defaultSourceFormat,
  defaultTargetFormat,
}: {
  defaultSourceFormat?: string;
  defaultTargetFormat?: string;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-2 mb-4 max-w-7xl">
      {defaultSourceFormat && defaultTargetFormat ? (
        <h1 className="text-4xl font-bold text-center">
          Convert {defaultSourceFormat.toUpperCase()} to{" "}
          {defaultTargetFormat.toUpperCase()} locally
        </h1>
      ) : (
        <h1 className="text-4xl font-bold text-center">
          Convert Documents Online — Free, Secure &amp; Local
        </h1>
      )}
      <div className="my-2 text-sm text-muted-foreground border p-4 rounded-lg font-medium flex flex-col space-y-2 shadow-sm">
        <LockSimple size={18} />
        <p>
          Your files are never uploaded to any server. All processing happens
          in your browser via Pandoc compiled to WASM.
          <br />
          Note: containerised formats like DOCX and EPUB may not preserve
          embedded images, as WASM doesn&apos;t support full file I/O.
        </p>

      </div>
    </div>
  );
}
