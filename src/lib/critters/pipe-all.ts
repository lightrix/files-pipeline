// @ts-ignore
import Critters from "critters";

import { dirname } from "path";

import type { path as optionPath, Options } from "./../../options/index.js";
import parse from "./parse.js";
import { fileURLToPath } from "url";
import applyTo from "../apply-to.js";

export default async (
	path: optionPath,
	settings: Options,
	debug: number = 2
) => {
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
						async (data, file) =>
							(
								await new Critters({
									...setting,
									path: dirname(file),
								})
							).process(data)
					);

					break;
				}

				default:
					break;
			}
		}
	}
};
