import type { optionPath } from "../../options/index.js";
import type files from "../files.js";

import { fileURLToPath } from "url";

import applyTo from "../apply-to.js";

export default async (ctx: files, path: optionPath) => {
	const _path = await applyTo(
		await applyTo(path, (url: URL | string) =>
			url instanceof URL ? fileURLToPath(url) : url
		),
		(path: string) => (path.endsWith("/") ? path : `${path}/`)
	);

	if (!_path) {
		return ctx;
	}

	if (_path instanceof Map) {
		for (const [input, output] of _path) {
			ctx.paths.set(input, output);
		}
	} else {
		ctx.paths.set(_path, _path);
	}

	return ctx;
};
