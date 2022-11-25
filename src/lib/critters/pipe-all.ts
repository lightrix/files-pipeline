// @ts-ignore
import Critters from "critters";

import type { path as optionPath, Options } from "./../../options/index.js";
import parse from "./parse.js";
import { fileURLToPath } from "url";
import applyTo from "../apply-to.js";

export default async (
	path: optionPath,
	settings: Options,
	debug: number = 2
) => {
	const _path = applyTo(path, (url: URL | string) =>
		url instanceof URL ? fileURLToPath(url) : url
	);

	console.log(_path);

	const critters = await new Critters({
		...settings["critters"],
		path: _path,
	});

	for (const files in settings) {
		if (Object.prototype.hasOwnProperty.call(settings, files)) {
			const setting = settings[files];

			if (!setting) {
				continue;
			}

			switch (files) {
				case "critters": {
					// await parse(
					// 	path,
					// 	"**/*.html",
					// 	debug,
					// 	"html",
					// 	settings?.exclude,
					// 	async (data) => critters.process(data)
					// );

					break;
				}

				default:
					break;
			}
		}
	}
};
