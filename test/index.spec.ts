import { resolve } from "node:path";

import { OutputAsset, RollupOutput } from "rollup";
import { build, InlineConfig } from "vite";
import { test, describe, expect, vi } from "vitest";
import PreloadPrefetch, { PreloadPrefetchOptions } from "../src";

async function buildVite(options: PreloadPrefetchOptions[], inlineConfig: InlineConfig = {}) {
  const { output } = (await build({
    root: resolve(__dirname, "./fixtures"),
    plugins: [PreloadPrefetch(options)],
    ...inlineConfig,
  })) as RollupOutput;

  const { source: indexSource } = output.find(
    (item) => item.fileName === "index.html"
  ) as OutputAsset;

  return indexSource.toString();
}

describe("PreloadPrefetch Plugin", () => {
  test("should not add links if no matching files are found", async () => {
    const options: PreloadPrefetchOptions[] = [
      {
        rel: "preload",
        files: [
          {
            entryMatch: /\.nonexistent$/,
          },
        ],
        injectTo: "head",
      },
    ];

    await buildVite(options).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });

  test("should add preload links with custom attributes", async () => {
    const options: PreloadPrefetchOptions[] = [
      {
        rel: "preload",
        files: [
          {
            outputMatch: /\.js$/,
            attributes: {
              as: "script",
              crossorigin: "use-credentials",
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

  test("should warn if no entryMatch or outputMatch is provided", async () => {
    const options: PreloadPrefetchOptions[] = [
      {
        rel: "preload",
        files: [{}], // No entryMatch or outputMatch
        injectTo: "head",
      },
    ];

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await buildVite(options);
    expect(consoleSpy).toHaveBeenCalledWith(
      "You should have at least one option between entryMatch and outputMatch."
    );
    consoleSpy.mockRestore();
  });

  test("should add prefetch links to the start of <head>", async () => {
    const options: PreloadPrefetchOptions[] = [
      {
        rel: "prefetch",
        files: [
          {
            entryMatch: /\.css$/,
          },
        ],
        injectTo: "head-prepend",
      },
    ];

    await buildVite(options).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });

  test("should handle multiple options with different rel attributes", async () => {
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
      {
        rel: "prefetch",
        files: [
          {
            outputMatch: /\.js$/,
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

  test("should not add a leading slash for external base path", async () => {
    const options: PreloadPrefetchOptions[] = [
      {
        rel: "preload",
        files: [
            {
                entryMatch: /\.woff2$/
            }
        ],
        injectTo: "head",
      },
    ];

    const viteOptions: InlineConfig = {
      base: "https://cdn.example.com/statics/",
    };

    await buildVite(options, viteOptions).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });
});
