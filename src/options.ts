export interface OptionsBase {
  /**  Rename custom properties to shorter name (e.g. `--color-fg-default` to `--0`) */
  shortenName?: boolean;
}

export interface OptionsWithExclude extends OptionsBase {
  /**  Exclude custom properties with this prefix */
  excludePrefix?: string;
  /**  Exclude custom properties in this list */
  exclude?: string[];
}

export interface OptionsWithInclude extends OptionsBase {
  /**  Include custom properties with this prefix */
  includePrefix?: string;
  /**  Include custom properties in this list */
  include?: string[];
}

export type Options = OptionsWithExclude | OptionsWithInclude;

export const DEFAULT_OPTIONS: Options = {
  shortenName: true,
};
