// @ts-ignore
import Critters from "critters";

import type { optionPath, Options } from "../../options/index.js";
import type {
	functionCallbacks,
	optionCallbacksPipe,
} from "../../options/lib/callbacks.js";
import type { Options as CrittersOptions } from "../../options/lib/critters/index.js";

import defaultCallbacks from "../../options/lib/callbacks.js";
import parse from "../parse.js";
import { fileURLToPath } from "url";
import applyTo from "../apply-to.js";
import { deepmerge } from "deepmerge-ts";

const callbacks = deepmerge(defaultCallbacks, {
	failed: async (inputPath: string) =>
		`Error: Cannot inline file ${inputPath} !`,
	fulfilled: async (pipe: optionCallbacksPipe) =>
		`\u001b[32mSuccessfully inlined a total of ${
			pipe.files
		} ${pipe.type.toUpperCase()} ${
			pipe.files === 1 ? "file" : "files"
		}.\u001b[39m`,
	accomplished: false,
}) satisfies functionCallbacks;

export default async (
	path: optionPath,
	settings: Options & CrittersOptions,
	debug: number = 2
) => {
	const _path = applyTo(path, (url: URL | string) =>
		url instanceof URL ? fileURLToPath(url) : url
	);

	const critters = new Critters(
		deepmerge(settings["critters"], {
			path: _path instanceof Map ? _path.keys().next().value : _path,
			logLevel: (() => {
				switch (debug) {
					case 0:
						return "silent";
					case 1:
						return "silent";
					case 2:
						return "info";
					default:
						return "info";
				}
			})(),
		} satisfies CrittersOptions["critters"])
	);

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
							wrote: (data) => critters.process(data),
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
