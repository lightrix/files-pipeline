import type IMG from "../../options/lib/compress/img.js";
import defaultOptions from "../../options/lib/compress/index.js";

// rome-ignore lint:
export default async (sharpFile: any, options: IMG = {}) => {
	const fileType = sharpFile.options.input.file.split(".").pop();

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
		validOptionCalls.includes(optionType) &&
		typeof options[optionType] !== "undefined" &&
		options[optionType] !== false
	) {
		return await sharpFile[optionType](
			options[optionType] !== true
				? options[optionType]
				: defaultOptions["img"]
		).toBuffer();
	}
};
