import type { Options as CrittersOptions } from "critters";
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
