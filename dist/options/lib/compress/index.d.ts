import type { Options as OptionsBase } from "../../index.js";
import type CSS from "./css.js";
import type HTML from "./html.js";
import type IMG from "./img.js";
import type JS from "./js.js";
import type SVG from "./svg.js";
export interface Options extends OptionsBase {
    [key: string]: any;
    css?: boolean | CSS;
    html?: boolean | HTML;
    js?: boolean | JS;
    img?: boolean | IMG;
    svg?: boolean | SVG;
}
declare const _default: {
    css: {
        clone: false;
        comments: false;
        forceMediaMerge: true;
    };
    html: {
        caseSensitive: true;
        collapseInlineTagWhitespace: false;
        collapseWhitespace: true;
        continueOnParseError: true;
        html5: true;
        includeAutoGeneratedTags: true;
        keepClosingSlash: true;
        minifyCSS: true;
        minifyJS: true;
        minifyURLs: false;
        preventAttributesEscaping: false;
        processConditionalComments: false;
        removeAttributeQuotes: true;
        removeComments: true;
        ignoreCustomComments: RegExp[];
        removeScriptTypeAttributes: true;
        removeStyleLinkTypeAttributes: true;
        removeTagWhitespace: false;
        sortAttributes: true;
        sortClassName: true;
        trimCustomFragments: true;
        useShortDoctype: false;
        noNewlinesBeforeTagClose: true;
        quoteCharacter: string;
    };
    js: {
        ecma: 5;
        enclose: false;
        keep_classnames: false;
        keep_fnames: false;
        ie8: false;
        module: false;
        safari10: false;
        toplevel: false;
    };
    img: {
        avif: {
            chromaSubsampling: string;
            effort: number;
        };
        gif: {
            effort: number;
        };
        jpeg: {
            chromaSubsampling: string;
            mozjpeg: true;
            trellisQuantisation: true;
            overshootDeringing: true;
            optimiseScans: true;
        };
        png: {
            compressionLevel: number;
            palette: true;
        };
        raw: {};
        tiff: {
            compression: string;
        };
        webp: {
            effort: number;
        };
    };
    svg: {
        multipass: true;
        js2svg: {
            indent: number;
            pretty: false;
        };
        plugins: "preset-default"[];
    };
    pipeline: {
        failed: (current: import("../../index.js").optionCallbacksFile) => Promise<string>;
        passed: (current: import("../../index.js").optionCallbacksFile) => Promise<boolean>;
        accomplished: (current: import("../../index.js").optionCallbacksFile) => Promise<string>;
        changed: (pipe: import("../../index.js").optionCallbacksPipe) => Promise<import("../../index.js").optionCallbacksPipe>;
    };
};
export default _default;
