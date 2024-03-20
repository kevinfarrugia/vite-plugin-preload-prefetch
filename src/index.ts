/* eslint-disable no-console */
import { OutputBundle } from "rollup";
import type { HtmlTagDescriptor, Plugin } from "vite";

let viteBasePath: string;

export interface PreloadPrefetchOptionsFiles {
  /**
   * Regular expression to target entry files
   */
  entryMatch?: RegExp;
  /**
   * Regular expression to target build files
   */
  outputMatch?: RegExp;
  /**
   * Attributes added to the preload links
   */
  attributes?: HtmlTagDescriptor["attrs"];
}

export type AssetsSet = Set<{ entry: string; output: string }>;

export type PreloadPrefetchOptions = {
  rel: string;
  files: PreloadPrefetchOptionsFiles[];
  injectTo?: "head" | "head-prepend";
};

function pathJoin(...strs: string[]) {
  let path = "";
  for (let index = 0; index < strs.length; index += 1) {
    const str = strs[index];
    const previousStr = index ? strs[index - 1] : "";

    if (str && !str.startsWith("/") && !previousStr.endsWith("/"))
      path += `/${str}`;
    else path += str;
  }

  return path;
}

/*
 * Retrieves all Vite assets and returns a set of entry and output files.
 * For example: { entry: 'Popup', output: 'Popup.7ed27409.js' }
 */
function getAssets(bundle: OutputBundle) {
  const assets: AssetsSet = new Set();
  const outputs = Object.keys(bundle).sort();
  outputs.forEach((output) => {
    const entry = bundle[output].name || "";
    assets.add({ entry, output });
  });

  return assets;
}

/*
 * Retrieves the attributes for the prefetch links
 */
function getTagsAttributes(
  assetsSet: AssetsSet,
  options: PreloadPrefetchOptions,
  basePath: string
) {
  const tagsAttributes: { [key: string]: string }[] = [];
  const assets = Array.from(assetsSet);

  if (!options.rel) {
    console.warn("You should provide a rel attribute.");
    return tagsAttributes;
  }

  for (let i = 0; i < assets.length; i += 1) {
    const asset = assets[i];

    for (let index = 0; index < options.files.length; index += 1) {
      const file = options.files[index];
      if (!file.entryMatch && !file.outputMatch) {
        console.warn(
          "You should have at least one option between entryMatch and outputMatch."
        );
      } else if (file.outputMatch && !file.outputMatch.test(asset.output)) {
        // do nothing
      } else if (file.entryMatch && !file.entryMatch.test(asset.entry)) {
        // do nothing
      } else {
        const attrs: HtmlTagDescriptor["attrs"] = file.attributes || {};
        const href = pathJoin(basePath, asset.output);

        const finalAttrs: { [key: string]: string } = {
          rel: options.rel,
          href,
          ...attrs,
        };

        // Remove any undefined values
        Object.keys(finalAttrs).forEach(
          (key) =>
            typeof finalAttrs[key] === "undefined" && delete finalAttrs[key]
        );

        tagsAttributes.push(finalAttrs);
      }
    }
  }

  return tagsAttributes;
}

/**
 * Add <link rel="preload">, <link rel="prefetch"> to the index.html file
 * Read more:
 * - https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/prefetch
 * - https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload
 */
export const preloadPrefetch = (options: PreloadPrefetchOptions[]): Plugin => ({
  name: "preloadPrefetch",
  configResolved(config) {
    // Base path is sanitized by vite with the final trailing slash
    viteBasePath = config.base;
  },
  transformIndexHtml: {
    order: "post",
    handler(html, ctx) {
      const { bundle } = ctx;
      if (!(bundle && options)) return html;

      const tags: HtmlTagDescriptor[] = [];

      options.forEach((option) => {
        const injectTo = option.injectTo ?? "head";

        const assets = getAssets(bundle);

        const tagsAttributes = getTagsAttributes(assets, option, viteBasePath);

        tagsAttributes.forEach((attrs) => {
          tags.push({
            tag: "link",
            attrs,
            injectTo,
          });
        });
      });

      return tags;
    },
  },
});

export default preloadPrefetch;
