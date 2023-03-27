import BabelPlugin from '@rollup/plugin-babel';
import TerserPlugin from '@rollup/plugin-terser';
import TypescriptPlugin from '@rollup/plugin-typescript';

/**
 * @type {import("rollup").RollupOptions}
 */
export default {
  input: 'src/index.ts',
  output: [
    { file: 'lib/index.cjs', format: 'cjs', sourcemap: false, exports: 'auto' },
    { file: 'lib/index.mjs', format: 'esm', sourcemap: false, exports: 'auto' },
  ],
  plugins: [
    TypescriptPlugin({ tsconfig: './tsconfig.json' }),
    BabelPlugin({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js', '.ts'],
      presets: [
        [
          '@babel/preset-env',
          {
            loose: true,
            modules: false,
            targets: { node: 14 },
            useBuiltIns: false,
          },
        ],
      ],
    }),
    TerserPlugin({
      compress: {
        reduce_funcs: false,
      },
      keep_classnames: true,
      keep_fnames: true,
    }),
  ],
};
