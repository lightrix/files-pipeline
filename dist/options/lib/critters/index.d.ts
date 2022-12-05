/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { Options as OptionsBase } from "../../index.js";
import type { Options as CrittersOptions } from "critters";
import type { optionCallbacksPipe } from "../../index.js";
export interface Options extends OptionsBase {
    [key: string]: any;
    critters?: boolean | CrittersOptions;
}
declare const _default: {
    critters: {
        preload: string;
        inlineFonts: boolean;
        compress: boolean;
        pruneSource: boolean;
    };
    pipeline: {
        wrote: (_file: string, data: string) => Promise<string>;
        read: (file: import("fs").PathLike | import("fs/promises").FileHandle) => Promise<string>;
        passed: () => Promise<true>;
        failed: (inputPath: string) => Promise<string>;
        accomplished: boolean;
        fulfilled: (pipe: optionCallbacksPipe) => Promise<string>;
        changed: (pipe: optionCallbacksPipe) => Promise<optionCallbacksPipe>;
    };
};
export default _default;
