# [@nikolarhristov/pipeline] 🧪

## Installation

First, install the `@nikolarhristov/pipeline` component like so:

```
npm install -D -E @nikolarhristov/pipeline
```

Then, create a new pipeline from this component:

**`index.ts`**

```ts
import pipeline from "@nikolarhristov/pipeline";

new pipeline({
	path: "./input/",
});
```

## Getting started

The pipeline will not provide you with a process method which you can use to
call the callbacks on each file of the pipeline.

**`index.ts`**

```ts
import pipeline from "@nikolarhristov/pipeline";

await new pipeline({
	path: "./input/",
	files: "**/*.md",
	pipeline: {
		wrote: (file: string, data: string) => {
			// prepend or append some content to all text files
			data += "LICENSE [MIT]";

			return data;
		},
	},
}).process();
```

These are the defaults for each callback.

```ts
import pipeline from "@nikolarhristov/pipeline";

await new pipeline({
	pipeline: {
		wrote: async (_file: string, data: string) => data,
		read: async (file: fs.PathLike | fs.promises.FileHandle) =>
			await fs.promises.readFile(file, "utf-8"),
		passed: async () => true,
		failed: async (inputPath: optionCallbacksFile["inputPath"]) =>
			`Error: Cannot process file ${inputPath} !`,
		accomplished: async (
			inputPath: optionCallbacksFile["inputPath"],
			outputPath: optionCallbacksFile["outputPath"],
			_fileSizeBefore: optionCallbacksFile["fileSizeBefore"],
			_fileSizeAfter: optionCallbacksFile["fileSizeAfter"]
		) => `Processed ${inputPath} in ${outputPath}.`,
		fulfilled: async (pipe: optionCallbacksPipe) =>
			`Successfully processed a total of ${pipe.files} ${
				pipe.files === 1 ? "file" : "files"
			}.`,
		changed: async (pipe) => pipe,
	},
});
```

The pipeline has built in methods which you can use to compress your CSS, HTML
and JavaScript or inline the critical CSS in the HTML files in that directory.

**`index.ts`**

```ts
import pipeline from "@nikolarhristov/pipeline";

await (
	await new pipeline({
		path: "./input/",
	}).compress()
).critters();
```

The following image file types will also be compressed:

-   avci
-   avcs
-   avif
-   avifs
-   gif
-   heic
-   heics
-   heif
-   heifs
-   jfif
-   jif
-   jpe
-   jpeg
-   jpg
-   png
-   raw
-   tiff
-   webp

SVG compression is supported, as well via [svgo].

You can override any of the default options from the configurations of:

-   [critters](https://github.com/GoogleChromeLabs/critters#usage)
-   [csso](https://github.com/css/csso#minifysource-options)
-   [html-minifier-terser](https://github.com/terser/html-minifier-terser#options-quick-reference)
-   [sharp](https://sharp.pixelplumbing.com/api-output#jpeg)
-   [svgo](https://github.com/svg/svgo#configuration)
-   [terser](https://github.com/terser/terser#minify-options-structure)

or disable them entirely:

**`index.ts`**

```ts
import pipeline from "@nikolarhristov/pipeline";

new pipeline({
	path: "./input/",
	critters: false,
	css: false,
	html: false,
	img: false,
	js: false,
	svg: false,
});
```

You can add multiple paths to `compress` or `critters` by specifying an array as
the `path` variable.

**`index.ts`**

```ts
import pipeline from "@nikolarhristov/pipeline";

new pipeline({
	path: ["./input/", "./input2/"],
});
```

You can also provide a map of paths for different input output directories.

**`index.ts`**

```ts
import pipeline from "@nikolarhristov/pipeline";

new pipeline({
	path: new Map([["./input", "./output"]]),
});
```

Or an array of the two.

**`index.ts`**

```ts
import pipeline from "@nikolarhristov/pipeline";

new pipeline({
	path: ["./input", new Map([["./input", "./output"]])],
});
```

You can provide a filter to exclude files from your pipeline. A filter can be an
array of regexes or a single match. You can use functions, as well to match on
file names.

**`index.ts`**

```ts
import pipeline from "@nikolarhristov/pipeline";

new pipeline({
	exclude: [
		"my-awesome.file",
		(file: string) =>
			file === "./input/this-file-will-not-be-processed.txt",
	],
});
```

Set `logger` to `0` if you do not want to see debug messages. Default is `2`.

**`index.ts`**

```ts
import pipeline from "@nikolarhristov/pipeline";

new pipeline({
	logger: 0,
});
```

[@nikolarhristov/pipeline]: https://npmjs.org/@nikolarhristov/pipeline
[svgo]: https://npmjs.org/svgo

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a history of changes to this component.

[![Lightrix logo](https://raw.githubusercontent.com/Lightrix/npm/main/.github/img/favicon.png "Built with Lightrix/npm")](https://github.com/Lightrix/npm)
