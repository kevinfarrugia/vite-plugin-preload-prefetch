import { resolve } from "node:path";

import { OutputAsset, RollupOutput } from "rollup";
import { build } from "vite";
import { test, describe, expect } from "vitest";
import PreloadPrefetch, { PreloadPrefetchOptions } from "../src";

async function buildVite(options: PreloadPrefetchOptions[]) {
  const { output } = (await build({
    root: resolve(__dirname, "./fixtures"),
    plugins: [PreloadPrefetch(options)],
  })) as RollupOutput;

  const { source: indexSource } = output.find(
    (item) => item.fileName === "index.html"
  ) as OutputAsset;

  return indexSource.toString();
}

describe("preloadPrefetch", () => {
  test("should add preload to WOFF2 font files", async () => {
    const options: PreloadPrefetchOptions[] = [
      {
        rel: "preload",
        files: [
          {
            entryMatch: /\.woff2$/,
            attributes: {
              type: "font/woff2",
              as: "font",
              crossorigin: "anonymous",
            },
          },
        ],
        injectTo: "head",
      },
    ];

    await buildVite(options).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });

  test("should add prefetch to dynamically imported file", async () => {
    const options: PreloadPrefetchOptions[] = [
      {
        rel: "prefetch",
        files: [
          {
            entryMatch: /form-validation/,
          },
        ],
        injectTo: "head",
      },
    ];

    await buildVite(options).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });

  test("should add preload to WOFF2 font files at start of <head>", async () => {
    const options: PreloadPrefetchOptions[] = [
      {
        rel: "preload",
        files: [
          {
            entryMatch: /\.woff2$/,
            attributes: {
              type: "font/woff2",
              as: "font",
              crossorigin: "anonymous",
            },
          },
        ],
        injectTo: "head-prepend",
      },
    ];

    await buildVite(options).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });
});
