# vite-plugin-preload-prefetch

Preload and prefetch assets in your HTML file using regular expressions.

## Installation

```bash
# yarn
yarn add vite-plugin-preload-prefetch -D

# npm
npm install vite-plugin-preload-prefetch -D
```

## Usage

```js
// vite.config.js
import preloadPrefetch from "vite-plugin-preload-prefetch";

export default {
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "src/index.js",
      output: {
        file: "dist/app.js",
        format: "cjs",
      },
      plugins: [
        preloadPrefetch([
          {
            rel: "prefetch",
            files: [{ entryMatch: /form-validation/ }],
            injectTo: "head",
          },
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
        ]),
      ],
    },
  },
};
```

The output of the above configuration will be:

```diff
<head>
  <title>Demo</title>
  <link rel="stylesheet" href="/app.css" />
  <script type="module" src="/app.js"></script>
+  <link rel="prefetch" href="/form-validation.js" />
+  <link rel="prefetch" href="/form-validation.css" />
+  <link rel="preload" href="/roboto.woff2" type="font/woff2" as="font" crossorigin="anonymous" />
</head>
```

### Options

#### `rel`

Type: `string`

The `rel` attribute of the `link` tag.

#### `files`

Type: `Array<{ entryMatch?: RegExp; outputMatch?: RegExp; attributes?: Record<string, string> }>`

The files to preload or prefetch. The `entryMatch` and `outputMatch` are regular expressions to match the entry and output file names respectively. The `attributes` property is a key-value pair of attributes to attach to the `link` tag.

#### `injectTo`

Type: `head|head-prepend`

The position to inject the `link` tag. _(default: `head`)_

## Inpiration

This plugin is inspired by [unplugin-inject-preload](https://github.com/Applelo/unplugin-inject-preload).

## License

[Apache-2.0](LICENSE)
