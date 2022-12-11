import t from"../../../lib/format-bytes.js";import s from"../../../lib/deepmerge.js";import o from"../../index.js";var l={css:{clone:!1,comments:!1,forceMediaMerge:!0},html:{caseSensitive:!0,collapseInlineTagWhitespace:!1,collapseWhitespace:!0,continueOnParseError:!0,html5:!0,includeAutoGeneratedTags:!0,keepClosingSlash:!0,minifyCSS:!0,minifyJS:!0,minifyURLs:!1,preventAttributesEscaping:!1,processConditionalComments:!1,removeAttributeQuotes:!0,removeComments:!0,ignoreCustomComments:[/^\s*#/,/^\s*\[/,/^\s*\]/,/^\s*!/,/^\s*\//],removeScriptTypeAttributes:!0,removeStyleLinkTypeAttributes:!0,removeTagWhitespace:!1,sortAttributes:!0,sortClassName:!0,trimCustomFragments:!0,useShortDoctype:!1,noNewlinesBeforeTagClose:!0,quoteCharacter:'"'},js:{ecma:5,enclose:!1,keep_classnames:!1,keep_fnames:!1,ie8:!1,module:!1,safari10:!1,toplevel:!1},img:{avif:{chromaSubsampling:"4:4:4",effort:9},gif:{effort:10},jpeg:{chromaSubsampling:"4:4:4",mozjpeg:!0,trellisQuantisation:!0,overshootDeringing:!0,optimiseScans:!0},png:{compressionLevel:9,palette:!0},raw:{},tiff:{compression:"lzw"},webp:{effort:6}},svg:{multipass:!0,js2svg:{indent:0,pretty:!1},plugins:["preset-default"]},pipeline:s(o.pipeline,{failed:async e=>`Error: Cannot compress file ${e}!`,passed:async e=>e.fileSizeBefore>Buffer.byteLength(e.buffer.toString()),accomplished:async e=>`Compressed ${e.inputPath} for ${await t(e.fileSizeBefore-e.fileSizeAfter)} (${((e.fileSizeBefore-e.fileSizeAfter)/e.fileSizeBefore*100).toFixed(2)}% reduction) in ${e.outputPath}.`,changed:async e=>(e.info.total=(e.info.total?e.info.total:0)+(e.current.fileSizeBefore-e.current.fileSizeAfter),e)})};export{l as default};
