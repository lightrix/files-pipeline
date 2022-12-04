import { deepmerge } from "deepmerge-ts";

// @ts-ignore
import type { Options as CrittersOptions } from "critters";

import { callbacks as defaultCallbacks } from "../../index.js";
import type { optionCallbacksPipe } from "../../index.js";

export const callbacks = deepmerge(defaultCallbacks, {
	failed: async (inputPath: string) =>
		`Error: Cannot inline file ${inputPath} !`,
	fulfilled: async (pipe: optionCallbacksPipe) =>
		`Successfully inlined a total of ${pipe.files} ${pipe.type} ${
			pipe.files === 1 ? "file" : "files"
		}.`,
	accomplished: false,
});

export interface Options {
	// rome-ignore lint:
	[key: string]: any;

	critters?: boolean | CrittersOptions;
}

export default {
	critters: {
		preload: "media",
		inlineFonts: true,
		compress: true,
		pruneSource: true,
	},
};
