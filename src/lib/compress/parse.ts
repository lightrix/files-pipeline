import * as fs from "fs";
import { dirname } from "path";

import type { path as optionPath, Options } from "./../../options/index.js";

import formatBytes from "./../format-bytes.js";
import files from "./../files.js";

export default async (
	path: optionPath,
	glob: string,
	debug: number = 2,
	type: string = "",
	exclude: Options["exclude"],
	// rome-ignore lint:
	write: (data: string) => any = async (data) => data,
	// rome-ignore lint:
	read: (file: string) => any = async (file) =>
		await fs.promises.readFile(file, "utf-8")
) => {
	const savings = {
		files: 0,
		total: 0,
	};

	for (const file of (await new files().in(path).by(glob)).not(exclude)
		.results) {
		const inputPath = file[0];
		const outputPath = file[1];

		try {
			const fileSizeBefore = (await fs.promises.stat(inputPath)).size;
			const writeBuffer = await write(await read(inputPath));

			if (!writeBuffer) {
				continue;
			}

			if (fileSizeBefore > Buffer.byteLength(writeBuffer)) {
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

				savings.files++;
				savings.total += fileSizeBefore - fileSizeAfter;

				if (debug > 1) {
					console.info(
						`\u001b[32mCompressed ${inputPath} for ${await formatBytes(
							fileSizeBefore - fileSizeAfter
						)} (${(
							((fileSizeBefore - fileSizeAfter) /
								fileSizeBefore) *
							100
						).toFixed(2)}% reduction) in ${outputPath} .\u001b[39m`
					);
				}
			}
		} catch (_error) {
			console.log(`Error: Cannot compress file ${inputPath}!`);
		}
	}

	if (debug > 0 && savings.files > 0) {
		console.info(
			`\u001b[32mSuccessfully compressed a total of ${
				savings.files
			} ${type.toUpperCase()} ${
				savings.files === 1 ? "file" : "files"
			} for ${await formatBytes(savings.total)}.\u001b[39m`
		);
	}
};
