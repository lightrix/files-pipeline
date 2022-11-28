import type { path as optionPath, Options } from "./../options/index.js";
import type { callbacks as callbacksFunction } from "./../options/lib/callbacks.js";
declare const _default: (path: optionPath, glob: string, debug: number | undefined, type: string | undefined, exclude: Options["exclude"], callbacks?: () => callbacksFunction) => Promise<void>;
export default _default;
