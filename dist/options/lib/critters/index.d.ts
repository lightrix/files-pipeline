import type { Options as OptionsBase } from "../../index.js";
import type { Options as CrittersOptions } from "critters";
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
        failed: (current: import("../../index.js").optionCallbacksFile) => Promise<string>;
        accomplished: false;
        fulfilled: (pipe: import("../../index.js").optionCallbacksPipe) => Promise<string | false>;
        changed: (pipe: import("../../index.js").optionCallbacksPipe) => Promise<import("../../index.js").optionCallbacksPipe>;
    };
};
export default _default;
