// @ts-ignore
import Critters from "critters";

import type { path as optionPath, Options } from "./../../options/index.js";
import type { callbacks as callbacksOption } from "../../options/lib/callbacks.js";

import defaultCallbacks from "./../../options/lib/callbacks.js";
import parse from "./../parse.js";
import { fileURLToPath } from "url";
import applyTo from "./../apply-to.js";
import { deepmerge } from "deepmerge-ts";

const callbacks: callbacksOption = deepmerge(defaultCallbacks, {
	error: async (inputPath: string) =>
		`Error: Cannot inline file ${inputPath} !`,
	end: async (pipe: { files: number; type: string; total: number }) =>
		`\u001b[32mSuccessfully inlined a total of ${
			pipe.files
		} ${pipe.type.toUpperCase()} ${
			pipe.files === 1 ? "file" : "files"
		}.\u001b[39m`,
});

export default async (
	path: optionPath,
	settings: Options,
	debug: number = 2
) => {
	const _path = applyTo(path, (url: URL | string) =>
		url instanceof URL ? fileURLToPath(url) : url
	);

	const critters = await new Critters({
		...settings["critters"],
		path: _path instanceof Map ? _path.keys().next().value : _path,
	});

	for (const files in settings) {
		if (Object.prototype.hasOwnProperty.call(settings, files)) {
			const setting = settings[files];

			if (!setting) {
				continue;
			}

			switch (files) {
				case "critters": {
					await parse(
						path,
						"**/*.html",
						debug,
						"html",
						settings?.exclude,
						() => ({
							...callbacks,
							write: (data) => critters.process(data),
						})
					);

					break;
				}

				default:
					break;
			}
		}
	}
};
