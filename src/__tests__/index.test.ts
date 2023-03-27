import Plugin from '../index';
import { Options } from '../options';
import postcss from 'postcss';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

const CASES_PATH = join(__dirname, 'cases');

describe('Plugin Test', () => {
  const checkWithString = async (input: string, output: string, opts: Options = {}) => {
    const result = await postcss([Plugin(opts)]).process(input, { from: undefined });
    expect(result.css).toEqual(output);
    expect(result.warnings()).toHaveLength(0);
  };

  const check = async (inputFilename: string, outputFilename: string, opts: Options = {}) => {
    const inputContent = await readFile(join(CASES_PATH, `${inputFilename}.css`), {
      encoding: 'utf-8',
    });
    const outputContent = await readFile(join(CASES_PATH, `${outputFilename}.out.css`), {
      encoding: 'utf-8',
    });
    await checkWithString(inputContent, outputContent, opts);
  };

  const cases: Array<[title: string, options: Options, inputFile: string, outputFile: string]> = [
    ['base', {}, 'base', 'base'],
    ['base', { shortenName: false }, 'base', 'base.not-shorten'],
    ['include', { includePrefix: '--color', include: ['--size', '--width'] }, 'include-exclude', 'include'],
    ['exclude', { excludePrefix: '--color', exclude: ['--margin'] }, 'include-exclude', 'exclude'],
  ];

  // eslint-disable-next-line jest/expect-expect
  test.each(cases)('[%s] with options: %j', async (_, options, inputFile, outputFile) => {
    await check(inputFile, outputFile, options);
  });
});
