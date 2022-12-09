import type { DeepMergeLeafURI } from "deepmerge-ts";
import { deepmergeCustom } from "deepmerge-ts";

export default deepmergeCustom<{
	DeepMergeArraysURI: DeepMergeLeafURI;
}>({
	mergeArrays: false,
});
