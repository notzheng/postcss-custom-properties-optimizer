import { Plugin } from 'postcss';

import { CustomPropertiesStats } from './stats';

import {
  shortenCustomPropertiesInValue,
  extractCustomPropertiesFromValue,
  generatePropertyShouldProcessChecker,
} from './utils';

import { DEFAULT_OPTIONS, Options } from './options';

/**
 * PostCSS Plugin Custom Properties
 *
 * 1. Remove unused custom properties
 * 2. Rename custom properties to shorter name
 *
 */
export default (options: Options = DEFAULT_OPTIONS): Plugin => {
  return {
    postcssPlugin: 'postcss-custom-properties',

    prepare() {
      const stats = new CustomPropertiesStats();
      const checkPropertyShouldProcess = generatePropertyShouldProcessChecker(options);

      return {
        Declaration(decl) {
          const { prop, value, variable: isCustomProperty } = decl;

          // property declaration
          const shouldProcess = isCustomProperty && checkPropertyShouldProcess(prop);
          if (shouldProcess) {
            stats.markDeclared(prop);
          }

          // count used
          const otherPropertiesInValues = extractCustomPropertiesFromValue(value);
          if (!otherPropertiesInValues) {
            return;
          }

          otherPropertiesInValues.forEach((otherProp) => {
            // exclude
            if (!checkPropertyShouldProcess(otherProp) || prop === otherProp) {
              return;
            }

            if (shouldProcess) {
              stats.addDep(prop, otherProp);
              return;
            }

            stats.increaseUsedCount(otherProp);
          });
        },

        OnceExit(root) {
          const { shortenName = true } = options;

          stats.shrink(shortenName);

          root.walkDecls((decl) => {
            const { prop, value, variable: isCustomProperty } = decl;

            // do not need checkShouldProgress again
            const info = isCustomProperty && stats.get(prop);

            if (info) {
              const { shouldRemove, shorterName } = info;
              if (shouldRemove) {
                decl.remove();
                return;
              }
              if (shortenName && shorterName) {
                decl.prop = shorterName;
              }
            }

            if (!shortenName) {
              return;
            }

            decl.value = shortenCustomPropertiesInValue(value, (name) => {
              if (!stats.has(name)) {
                return;
              }
              return stats.getShorterName(name);
            });
          });
        },
      };
    },
  };
};

export const postcss = true;

export type { Options } from './options';
