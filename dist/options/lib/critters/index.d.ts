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
        wrote: (current: import("../../index.js").optionCallbacksFile) => Promise<import("../../index.js").optionBuffer>;
        read: (current: import("../../index.js").optionCallbacksFile) => Promise<string>;
        passed: () => Promise<true>;
        failed: (inputPath: string) => Promise<string>;
        accomplished: false;
        fulfilled: (pipe: optionCallbacksPipe) => Promise<string>;
        changed: (pipe: optionCallbacksPipe) => Promise<optionCallbacksPipe>;
    };
};
export default _default;
