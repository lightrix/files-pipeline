// @ts-ignore
import type { Options as CrittersOptions } from "critters";

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
} satisfies Options;
