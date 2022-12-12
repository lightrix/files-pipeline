import type { Sharp } from "sharp";
import type { optionCallbacksFile } from "../../options/index.js";
import type IMG from "../../options/lib/compress/img.js";
export interface sharpBuffer extends Sharp {
    [key: string]: any;
}
export interface currentSharp extends Omit<optionCallbacksFile, "buffer"> {
    buffer: sharpBuffer;
}
declare const _default: (current: currentSharp, options?: IMG) => Promise<any>;
export default _default;
