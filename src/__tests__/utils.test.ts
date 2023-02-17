import { extractCustomPropertiesFromValue, generatePropertyShouldProcessChecker } from '../utils';
import { Options } from '../options';

describe('extractCustomPropertiesFromValue', () => {
  test('should return null when value not use any custom property', () => {
    expect(extractCustomPropertiesFromValue('#000')).toBeNull();
    expect(extractCustomPropertiesFromValue('1px solid #000')).toBeNull();
    expect(extractCustomPropertiesFromValue('var(-something)')).toBeNull();
  });

  test('should return array of custom properties names in values', () => {
    expect(extractCustomPropertiesFromValue('var(--border-width) solid var(--border-color)')).toEqual([
      '--border-width',
      '--border-color',
    ]);
    expect(extractCustomPropertiesFromValue('var(--background-color)')).toEqual(['--background-color']);
  });
});

describe('generatePropertyShouldProcessChecker', () => {
  test('should return a function', () => {
    [{}, { include: [] }, { includePrefix: '' }, { exclude: [] }, { excludePrefix: '' }].forEach((option) => {
      expect(typeof generatePropertyShouldProcessChecker(option)).toBe('function');
    });
  });

  const cases: Array<[name: string, options: Options, trueCases: string[], falseCases: string[]]> = [
    [
      'with include only',
      { include: ['--color-fg', '--color-bg'] },
      ['--color-fg', '--color-bg'],
      ['--color-border', '--something'],
    ],
    ['with includePrefix only', { includePrefix: '--color' }, ['--color-fg', '--color'], ['--colo', '--space-small']],
    [
      'with both include and includePrefix',
      { include: ['--colo'], includePrefix: '--color' },
      ['--color-fg', '--color-bg', '--colo'],
      ['--size-small', '--col'],
    ],
    [
      'with exclude only',
      { exclude: ['--color-fg', '--color-bg'] },
      ['--color-border', '--something'],
      ['--color-fg', '--color-bg'],
    ],
    ['with excludePrefix only', { excludePrefix: '--color' }, ['--colo', '--space-small'], ['--color-fg', '--color']],
    [
      'with both exclude and excludePrefix',
      { exclude: ['--colo'], excludePrefix: '--color' },
      ['--size-small', '--col'],
      ['--color-fg', '--color-bg', '--colo'],
    ],
  ];

  describe.each(cases)('%s', (name, option, trueCases, falseCases) => {
    const checker = generatePropertyShouldProcessChecker(option);

    test.each([
      ...trueCases.map((c) => ({ value: c, expected: true })),
      ...falseCases.map((c) => ({ value: c, expected: false })),
    ])('should return $expected with value $value', ({ value, expected }) => {
      expect(checker(value)).toBe(expected);
    });
  });
});
