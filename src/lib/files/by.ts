import FastGlob from "fast-glob";
import type { Pattern } from "fast-glob";
import type files from "../files.js";

export default async (
	ctx: files,
	glob: Pattern | Pattern[]
): Promise<files> => {
	if (!glob) {
		return ctx;
	}

	for (const [input, output] of ctx.paths) {
		for (const file of await FastGlob(glob, {
			cwd: input,
			onlyFiles: true,
		})) {
			ctx.results.set(`${output}${file}`, `${input}${file}`);
		}
	}

	return ctx;
};
