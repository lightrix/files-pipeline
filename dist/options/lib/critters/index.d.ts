import type { Options as CrittersOptions } from "critters";
import type { optionCallbacksPipe } from "../../index.js";
export declare const callbacks: {
    failed: (inputPath: string) => Promise<string>;
    fulfilled: (pipe: optionCallbacksPipe) => Promise<string>;
    accomplished: boolean;
};
export interface Options {
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
};
export default _default;
