# postcss-custom-properties-optimizer

[PostCSS] plugin for optimize custom properties

[![npm version](https://img.shields.io/npm/v/postcss-custom-properties-optimizer.svg?style=flat)](https://www.npmjs.com/package/postcss-custom-properties-optimizer)
[![Npm Weekly Downloads](https://img.shields.io/npm/dw/postcss-custom-properties-optimizer)](https://www.npmjs.com/package/postcss-custom-properties-optimizer)
[![Issues](https://img.shields.io/github/issues/notzheng/postcss-custom-properties-optimizer)](https://github.com/notzheng/postcss-custom-properties-optimizer/issues)
[![Codecov](https://codecov.io/gh/notzheng/postcss-custom-properties-optimizer/branch/main/graph/badge.svg)](https://codecov.io/gh/hebertcisco/ts-npm-package-boilerplate)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/notzheng/postcss-custom-properties-optimizer/blob/main/LICENSE)

## Purpose

This plugin can do these things:

- Remove unused custom properties
- Rename custom properties to shorter name (e.g. `--color-fg-default` to `--0`)

Because things above is not safe, use it at your own risk.

## Usage

**Step 1:** Install plugin:

```sh
pnpm install --D postcss postcss-custom-properties-optimizer
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-custom-properties-optimizer'),
    require('autoprefixer')
  ]
}
```

[PostCSS]: https://github.com/postcss/postcss

[official docs]: https://github.com/postcss/postcss#usage

### Options

```typescript
type Options = OptionsWithExclude | OptionsWithInclude;

interface OptionsWithExclude extends OptionsBase {
    /**  Exclude custom properties with this prefix */
    excludePrefix?: string;
    /**  Exclude custom properties in this list */
    exclude?: string[];
}

interface OptionsWithInclude extends OptionsBase {
    /**  Include custom properties with this prefix */
    includePrefix?: string;
    /**  Include custom properties in this list */
    include?: string[];
}

interface OptionsBase {
    /**  Rename custom properties to shorter name (e.g. `--color-fg-default` to `--0`) */
    shortenName?: boolean;
}
```
