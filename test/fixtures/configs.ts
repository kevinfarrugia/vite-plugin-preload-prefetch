import type { PreloadPrefetchOptions } from "../../src";

export const configs: Record<string, PreloadPrefetchOptions[]> = {
  "no-matching-files": [
    {
      rel: "preload",
      files: [
        {
          entryMatch: /\.nonexistent$/,
        },
      ],
      injectTo: "head",
    },
  ],
  "custom-attributes": [
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
  ],
  "head-prepend-prefetch": [
    {
      rel: "prefetch",
      files: [
        {
          entryMatch: /\.css$/,
        },
      ],
      injectTo: "head-prepend",
    },
  ],
  "multiple-rules": [
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
  ],
  "dynamic-imports": [
    {
      rel: "prefetch",
      files: [
        {
          entryMatch: /form-validation/,
        },
      ],
      injectTo: "head",
    },
  ],
  "head-prepend-preload": [
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
  ]
};
