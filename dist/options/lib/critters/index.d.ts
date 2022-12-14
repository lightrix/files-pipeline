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
        failed: (current: import("../../index.js").optionCallbacksFile) => Promise<string>;
        fulfilled: (pipe: import("../../index.js").optionCallbacksPipe) => Promise<string | false>;
        accomplished: false;
    };
};
export default _default;
