export function createPandocInstance(wasmBinary: ArrayBuffer): Promise<{
  convert: (
    options: Record<string, unknown>,
    stdin: string,
    files: Record<string, unknown>
  ) => Promise<{ stdout: string; stderr: string; warnings: unknown[]; files: Record<string, unknown>; mediaFiles: Record<string, unknown> }>;
  query: (options: Record<string, unknown>) => unknown;
  pandoc: (args: string, inData: unknown, resources?: unknown[]) => Promise<{ out: unknown; mediaFiles: Map<string, unknown> }>;
}>;
