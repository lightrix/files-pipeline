import { minify as csso } from "csso";
import { minify as htmlMinifierTerser } from "html-minifier-terser";
import { optimize as svgo } from "svgo";
import { minify as terser } from "terser";

import type { path as optionPath, Options } from "./../../options/index.js";
import parse from "./parse.js";

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
				case "css": {
					await parse(
						path,
						"**/*.css",
						debug,
						files,
						settings?.exclude,
						(data) => csso(data, setting).css
					);

					break;
				}

				case "html": {
					await parse(
						path,
						"**/*.html",
						debug,
						files,
						settings?.exclude,
						async (data) => await htmlMinifierTerser(data, setting)
					);

					break;
				}

				case "js": {
					await parse(
						path,
						"**/*.{js,mjs,cjs}",
						debug,
						files,
						settings?.exclude,
						async (data) => (await terser(data, setting)).code
					);

					break;
				}

				case "svg": {
					await parse(
						path,
						"**/*.svg",
						debug,
						files,
						settings?.exclude,
						async (data) => {
							const result = svgo(data, setting) as {
								// rome-ignore lint:
								[key: string]: any;
							};

							if (typeof result["error"] !== "undefined") {
								console.log(result["error"]);
							}

							if (typeof result["data"] !== "undefined") {
								return result["data"];
							}
						}
					);

					break;
				}

				default:
					break;
			}
		}
	}
};
