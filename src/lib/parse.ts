import * as fs from "fs";
import { dirname } from "path";

import type { optionPath, Options } from "../options/index.js";
import type {
	functionCallbacks,
	optionCallbacksFile,
	optionCallbacksPipe,
} from "../options/lib/callbacks.js";

import defaultCallbacks from "../options/lib/callbacks.js";
import files from "./files.js";

export default async (
	path: optionPath,
	glob: string,
	debug: number = 2,
	type: string = "",
	exclude: Options["exclude"],
	callbacks: () => functionCallbacks = () => defaultCallbacks
) => {
	let pipe = {
		files: 0,
		type: type,
		info: {},
		current: {
			inputPath: "",
			outputPath: "",
			fileSizeAfter: 0,
			fileSizeBefore: 0,
		},
	} satisfies optionCallbacksPipe;

	for (const file of (await new files().in(path).by(glob)).not(exclude)
		.results) {
		const inputPath = file[1];
		const outputPath = file[0];

		try {
			const fileSizeBefore = (await fs.promises.stat(inputPath)).size;

			const writeBuffer = await callbacks().wrote(
				await callbacks().read(inputPath)
			);

			if (!writeBuffer) {
				continue;
			}

			if (
				typeof callbacks().passed === "function" ||
				!callbacks().passed
			) {
				// @ts-expect-error
				if (await callbacks().passed(fileSizeBefore, writeBuffer)) {
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

					await fs.promises.writeFile(
						outputPath,
						writeBuffer,
						"utf-8"
					);

					const fileSizeAfter = (await fs.promises.stat(outputPath))
						.size;

					if (debug > 0) {
						pipe.current = {
							inputPath,
							outputPath,
							fileSizeBefore,
							fileSizeAfter,
						} satisfies optionCallbacksFile;

						pipe.files++;

						pipe = await callbacks().changed(pipe);
					}

					if (debug > 1) {
						if (typeof callbacks().accomplished === "function") {
							console.info(
								// @ts-expect-error
								await callbacks().accomplished(
									inputPath,
									outputPath,
									fileSizeBefore,
									fileSizeAfter
								)
							);
						}
					}
				}
			}
		} catch (_error) {
			if (typeof callbacks().failed === "function") {
				// @ts-expect-error
				console.log(callbacks().failed(inputPath));
			}
		}
	}

	if (debug > 0) {
		if (typeof callbacks().fulfilled === "function") {
			// @ts-expect-error
			console.info(await callbacks().fulfilled(pipe));
		}
	}
};
