import deepmerge from "../../../lib/deepmerge.js";

import type { executions, Options as OptionsBase } from "../../index.js";

// @ts-ignore
import type { Options as CrittersOptions } from "critters";

import options from "../../index.js";

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
	pipeline: {
		failed: async (current) =>
			`Error: Cannot inline file ${current.inputPath}!`,
		fulfilled: async (pipe) =>
			pipe.files > 0
				? `Successfully inlined a total of ${pipe.files} HTML ${
						pipe.files === 1 ? "file" : "files"
				  }.`
				: false,
		accomplished: false,
	},
} satisfies Options;
