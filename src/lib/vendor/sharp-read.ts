import type { Sharp } from "sharp";
import type { optionCallbacksFile } from "../../options/index.js";
import type IMG from "../../options/lib/compress/img.js";

import defaults from "../../options/lib/compress/index.js";

export interface sharpBuffer extends Sharp {
	// rome-ignore lint/suspicious/noExplicitAny:
	[key: string]: any;
}

export interface currentSharp extends Omit<optionCallbacksFile, "buffer"> {
	buffer: sharpBuffer;
}

export default async (current: currentSharp, options: IMG = {}) => {
	const fileType = current.inputPath.split(".").pop();

	if (!fileType) {
		return;
	}

	const typeToOption: {
		[key: string]: string;
	} = {
		"avci": "avif",
		"avcs": "avif",
		"avifs": "avif",
		"heic": "heif",
		"heics": "heif",
		"heifs": "heif",
		"jfif": "jpeg",
		"jif": "jpeg",
		"jpe": "jpeg",
		"jpg": "jpeg",
	};

	const optionType =
		typeof typeToOption[fileType] !== "undefined"
			? typeToOption[fileType]
			: typeof options[fileType] !== "undefined"
			? fileType
			: false;

	const validOptionCalls = [
		"avif",
		"gif",
		"heif",
		"jpeg",
		"png",
		"raw",
		"tiff",
		"webp",
	];

	if (
		optionType &&
		validOptionCalls.includes(optionType) &&
		typeof options[optionType] !== "undefined" &&
		options[optionType] !== false
	) {
		if (optionType in current.buffer) {
			return await current.buffer[optionType](
				options[optionType] !== true
					? options[optionType]
					: defaults["img"]
			).toBuffer();
		}
	}
};
