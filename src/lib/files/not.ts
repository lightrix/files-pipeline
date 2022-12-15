import type { Options } from "../../options/index.js";
import type files from "../files.js";

export default async (ctx: files, pattern: Options["exclude"]) => {
	const filters = new Set();

	if (typeof pattern !== "undefined") {
		if (pattern instanceof Array || pattern instanceof Set) {
			for (const patterns of pattern) {
				filters.add(patterns);
			}
		} else {
			filters.add(pattern);
		}
	}

	for (const filter of filters) {
		if (typeof filter === "string") {
			for (const file of ctx.results) {
				// rome-ignore lint/nursery/noPrecisionLoss:
				if (file[0].match(filter) || file[1].match(filter)) {
					ctx.results.delete(file[0]);
				}
			}
		}

		if (typeof filter === "function") {
			for (const file of ctx.results) {
				// rome-ignore lint/nursery/noPrecisionLoss:
				if (filter(file[0]) || filter(file[1])) {
					ctx.results.delete(file[0]);
				}
			}
		}
	}

	return ctx;
};
