import { resolve } from "node:path";

import { format } from "prettier";
import { OutputAsset, RollupOutput } from "rollup";
import { build, InlineConfig } from "vite";
import { describe, expect, test, vi } from "vitest";
import PreloadPrefetch, { PreloadPrefetchOptions } from "../src";
import { configs } from "./fixtures/configs";

async function buildVite(
  options: PreloadPrefetchOptions[],
  inlineConfig: InlineConfig = {}
) {
  const { output } = (await build({
    root: resolve(__dirname, "./fixtures"),
    plugins: [PreloadPrefetch(options)],
    ...inlineConfig,
  })) as RollupOutput;

  const { source: indexSource } = output.find(
    (item) => item.fileName === "index.html"
  ) as OutputAsset;

  return format(indexSource.toString(), { parser: "html" });
}

describe("PreloadPrefetch Plugin", () => {
  Object.keys(configs).forEach((key) => {
    const config = configs[key];
    test(`test ${key}`, async () => {
      const output = await buildVite(config);
      expect(output).toMatchSnapshot();
    });

    test(`test ${key} with basePath`, async () => {
      const output = await buildVite(config, { base: "/base" });
      expect(output).toMatchSnapshot();
    });

    test(`test ${key} with relative basePath `, async () => {
      const output = await buildVite(config, { base: "./" });
      expect(output).toMatchSnapshot();
    });

    test(`test ${key} with URL basePath `, async () => {
      const output = await buildVite(config, {
        base: "https://cdn.example.com/",
      });
      expect(output).toMatchSnapshot();
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
});
