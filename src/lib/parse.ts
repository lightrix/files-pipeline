import * as fs from "fs";
import { dirname } from "path";

import type { path as optionPath, Options } from "./../options/index.js";
import type { callbacks as callbacksFunction } from "./../options/lib/callbacks.js";

import defaultCallbacks from "./../options/lib/callbacks.js";
import files from "./files.js";

export default async (
	path: optionPath,
	glob: string,
	debug: number = 2,
	type: string = "",
	exclude: Options["exclude"],
	callbacks: () => callbacksFunction = () => defaultCallbacks
) => {
	let pipe = {
		files: 0,
		type: type,
		info: {},
	};

	for (const file of (await new files().in(path).by(glob)).not(exclude)
		.results) {
		const inputPath = file[1];
		const outputPath = file[0];

		try {
			const fileSizeBefore = (await fs.promises.stat(inputPath)).size;

			const writeBuffer = await callbacks().write(
				await callbacks().read(inputPath)
			);

			if (!writeBuffer) {
				continue;
			}

			if (await callbacks().check(fileSizeBefore, writeBuffer)) {
				try {
					await fs.promises.access(
						dirname(outputPath),
						fs.constants.W_OK
					);
				} catch (_error) {
					await fs.promises.mkdir(dirname(outputPath), {
						recursive: true,
					});
				}

				await fs.promises.writeFile(outputPath, writeBuffer, "utf-8");

				const fileSizeAfter = (await fs.promises.stat(outputPath)).size;

				pipe.files++;
				pipe.info = callbacks().pipe(
					inputPath,
					outputPath,
					fileSizeBefore,
					fileSizeAfter
				);

				if (debug > 1) {
					console.info(
						await callbacks().success(
							inputPath,
							outputPath,
							fileSizeBefore,
							fileSizeAfter
						)
					);
				}
			}
		} catch (_error) {
			console.log(callbacks().error(inputPath));
		}
	}

	if (debug > 0) {
		console.info(await callbacks().end(pipe));
	}
};
