import * as fs from "fs";
import { dirname } from "path";

import type { path as optionPath, Options } from "./../../options/index.js";

import files from "./../files.js";

export default async (
	path: optionPath,
	glob: string,
	debug: number = 2,
	type: string = "",
	exclude: Options["exclude"],
	// rome-ignore lint:
	write: (data: string, file: string) => any = async (data) => data,
	// rome-ignore lint:
	read: (file: string) => any = async (file) =>
		await fs.promises.readFile(file, "utf-8")
) => {
	const inlines = {
		files: 0,
		total: 0,
	};

	for (const file of (await new files().in(path).by(glob)).not(exclude)
		.results) {
		const inputPath = file[1];
		const outputPath = file[0];

		try {
			const writeBuffer = await write(await read(inputPath));

			if (!writeBuffer) {
				continue;
			}

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

			inlines.files++;
		} catch (_error) {
			console.log(_error);
			console.log(`Error: Cannot inline file ${inputPath} !`);
		}
	}

	if (debug > 0 && inlines.files > 0) {
		console.info(
			`\u001b[32mSuccessfully inlined a total of ${
				inlines.files
			} ${type.toUpperCase()} ${
				inlines.files === 1 ? "file" : "files"
			}.\u001b[39m`
		);
	}
};
