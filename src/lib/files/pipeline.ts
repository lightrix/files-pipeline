import * as fs from "fs";
import { dirname } from "path";

import type { executions } from "../../options/index.js";

import defaults from "../../options/index.js";
import deepmerge from "../deepmerge.js";
import type files from "../files.js";

export default async (ctx: files, callbacks: executions) => {
	callbacks = deepmerge(defaults.pipeline, callbacks);

	for (const [outputPath, inputPath] of ctx.results) {
		try {
			ctx.pipe.current.inputPath = inputPath;
			ctx.pipe.current.outputPath = outputPath;

			ctx.pipe.current.fileSizeBefore = (
				await fs.promises.stat(ctx.pipe.current.inputPath)
			).size;

			if (callbacks.read && callbacks.wrote) {
				ctx.pipe.current.buffer = await callbacks.read(
					ctx.pipe.current
				);

				const buffer = await callbacks.wrote(ctx.pipe.current);

				if (!buffer) {
					continue;
				}

				ctx.pipe.current.buffer = buffer;

				if (
					callbacks.passed &&
					(await callbacks.passed(ctx.pipe.current))
				) {
					try {
						await fs.promises.access(
							dirname(ctx.pipe.current.outputPath),
							fs.constants.W_OK
						);
					} catch (_error) {
						await fs.promises.mkdir(
							dirname(ctx.pipe.current.outputPath),
							{
								recursive: true,
							}
						);
					}

					await fs.promises.writeFile(
						ctx.pipe.current.outputPath,
						ctx.pipe.current.buffer,
						"utf-8"
					);

					ctx.pipe.current.fileSizeAfter = (
						await fs.promises.stat(ctx.pipe.current.outputPath)
					).size;

					if (ctx.pipe.debug > 0) {
						ctx.pipe.files++;

						if (callbacks.changed) {
							ctx.pipe = await callbacks.changed(ctx.pipe);
						}
					}

					// rome-ignore lint/nursery/noPrecisionLoss:
					if (ctx.pipe.debug > 1) {
						if (typeof callbacks.accomplished === "function") {
							const message = await callbacks.accomplished(
								ctx.pipe.current
							);

							if (!message || message.length > 0) {
								console.log(message);
							}
						}
					}
				}
			}
		} catch (_error) {
			ctx.results.delete(outputPath);

			if (typeof callbacks.failed === "function") {
				const message = await callbacks.failed(ctx.pipe.current);

				if (!message || message.length > 0) {
					console.log(message);
				}
			}
		}
	}

	if (ctx.pipe.debug > 0 && ctx.results.size > 0) {
		if (typeof callbacks.fulfilled === "function") {
			const message = await callbacks.fulfilled(ctx.pipe);

			if (!message || message.length > 0) {
				console.log(message);
			}
		}
	}

	return ctx;
};
