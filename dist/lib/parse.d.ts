import type { optionPath, Options } from "../options/index.js";
import type { functionCallbacks } from "../options/lib/callbacks.js";
declare const _default: (path: optionPath, glob: string, debug: number | undefined, type: string | undefined, exclude: Options["exclude"], callbacks?: () => functionCallbacks) => Promise<void>;
export default _default;
