import deepmerge from "../../../lib/deepmerge.js";

import type { functionCallbacks, Options as OptionsBase } from "../../index.js";

// @ts-ignore
import type { Options as CrittersOptions } from "critters";

import defaultOptions from "../../index.js";
import type { optionCallbacksPipe } from "../../index.js";

export interface Options extends OptionsBase {
	// rome-ignore lint/suspicious/noExplicitAny:
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
	pipeline: deepmerge(defaultOptions.pipeline, {
		failed: async (inputPath: string) =>
			`Error: Cannot inline file ${inputPath}!`,
		fulfilled: async (pipe: optionCallbacksPipe) =>
			`Successfully inlined a total of ${pipe.files} HTML ${
				pipe.files === 1 ? "file" : "files"
			}.`,
		accomplished: false,
	} satisfies functionCallbacks),
} satisfies Options;
