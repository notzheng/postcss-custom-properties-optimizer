import { Options } from './options';

export const generatePropertyShouldProcessChecker = (options: Options): ((name: string) => boolean) => {
  if ('include' in options || 'includePrefix' in options) {
    const { include, includePrefix } = options;
    return (name: string) => {
      const nameInInclude = Array.isArray(include) && include.includes(name);
      const nameStartsWithIncludePrefix = typeof includePrefix === 'string' && name.startsWith(includePrefix);
      return nameInInclude || nameStartsWithIncludePrefix;
    };
  }

  if ('exclude' in options || 'excludePrefix' in options) {
    const { exclude, excludePrefix } = options;
    return (name: string) => {
      const nameInExclude = Array.isArray(exclude) && exclude.includes(name);
      const nameStartsWithExcludePrefix = typeof excludePrefix === 'string' && name.startsWith(excludePrefix);
      return !nameInExclude && !nameStartsWithExcludePrefix;
    };
  }

  return () => true;
};

export const RE_PROPERTY_NAME = /var\(\s*(--[^,\s)]+)\)/g;

export const extractCustomPropertiesFromValue = (value: string): string[] | null => {
  const matchedResult = Array.from(value.matchAll(RE_PROPERTY_NAME));
  if (matchedResult.length === 0) {
    return null;
  }
  return Array.from(matchedResult).map((match) => match[1]);
};

export const shortenCustomPropertiesInValue = (value: string, getShortenName: (prop: string) => string | undefined) => {
  return value?.replace(/var\(\s*(--[^,\s)]+)\)/g, (_, name) => {
    const shorterName = getShortenName(name);
    if (shorterName) {
      return `var(${shorterName})`;
    }
    return `var(${name})`;
  });
};
