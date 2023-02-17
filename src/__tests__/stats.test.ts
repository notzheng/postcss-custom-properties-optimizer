import { CustomPropertiesStats, CustomPropertyInfo } from '../stats';

describe('CustomPropertiesStats', () => {
  describe('base methods', () => {
    let stats: CustomPropertiesStats;

    beforeEach(() => {
      stats = new CustomPropertiesStats();
    });

    const PROP_NAME = 'test';
    const generateInitialInfo = (): CustomPropertyInfo => ({
      decl: false,
      used: 0,
      deps: new Set(),
    });
    const addPropertyInfoToStats = (name: string, value: CustomPropertyInfo = generateInitialInfo()) => {
      stats['storage'][name] = value;
    };

    test('should be a class', () => {
      expect(stats).toBeInstanceOf(CustomPropertiesStats);
    });

    test('initial storage', () => {
      expect(stats['storage']).toEqual({});
    });

    test('ensureExists create new', () => {
      stats['ensureExists'](PROP_NAME);
      expect(stats['storage']).toEqual<Record<string, CustomPropertyInfo>>({
        [PROP_NAME]: generateInitialInfo(),
      });
    });

    test('ensureExists do not create', () => {
      const info: CustomPropertyInfo = {
        decl: true,
        used: 2,
        deps: new Set(['1', '2']),
      };
      addPropertyInfoToStats(PROP_NAME, info);
      stats['ensureExists'](PROP_NAME);
      expect(stats['storage']).toEqual({ [PROP_NAME]: info });
    });

    test('checkExists', () => {
      addPropertyInfoToStats(PROP_NAME);
      expect(() => {
        stats['checkExists']('somethingElse');
      }).toThrow();
    });

    test('get', () => {
      addPropertyInfoToStats(PROP_NAME);
      expect(stats.get(PROP_NAME)).toBe(stats['storage'][PROP_NAME]);
      expect(stats.get('somethingElse')).toBe(undefined);
    });

    test('has', () => {
      addPropertyInfoToStats(PROP_NAME);
      expect(stats.has(PROP_NAME)).toBe(true);
      expect(stats.has('somethingElse')).toBe(false);
    });

    test('markDeclared', () => {
      stats.markDeclared(PROP_NAME);
      expect(stats['storage'][PROP_NAME].decl).toBe(true);
      stats.markDeclared(PROP_NAME, false);
      expect(stats['storage'][PROP_NAME].decl).toBe(false);
    });

    test('isDeclared', () => {
      stats.markDeclared(PROP_NAME);
      expect(stats.isDeclared(PROP_NAME)).toBe(true);
      stats.markDeclared(PROP_NAME, false);
      expect(stats.isDeclared(PROP_NAME)).toBe(false);
    });

    test('addDeps', () => {
      stats.addDep(PROP_NAME, 'dep1');
      stats.addDep(PROP_NAME, 'dep2');
      expect(stats['storage'][PROP_NAME].deps).toEqual(new Set(['dep1', 'dep2']));
      expect(stats['storage'].dep1.used).toBe(1);
      expect(stats['storage'].dep2.used).toBe(1);
      stats.addDep(PROP_NAME, 'dep2');
      expect(stats['storage'].dep2.used).toBe(1);
    });

    test('increaseUsedCount and decreaseUsedCount', () => {
      stats.increaseUsedCount(PROP_NAME);
      expect(stats['storage'][PROP_NAME].used).toBe(1);
      stats.increaseUsedCount(PROP_NAME);
      expect(stats['storage'][PROP_NAME].used).toBe(2);
      stats.decreaseUsedCount(PROP_NAME);
      expect(stats['storage'][PROP_NAME].used).toBe(1);
    });

    test('getShorterName', () => {
      addPropertyInfoToStats(PROP_NAME);
      stats['storage'][PROP_NAME].shorterName = 'shorterName';
      expect(stats.getShorterName(PROP_NAME)).toBe('shorterName');
    });
  });

  describe('shrink', () => {
    // @TODO: add more cases
    const cases: Array<
      [
        name: string,
        shortenName: boolean,
        input: Record<string, CustomPropertyInfo>,
        output: Record<string, CustomPropertyInfo>,
      ]
    > = [
      [
        'base',
        true,
        {
          '--a': {
            used: 0,
            decl: true,
            deps: new Set(),
          },
          '--b': {
            used: 1,
            decl: true,
            deps: new Set(),
          },
        },
        {
          '--a': {
            used: 0,
            decl: true,
            deps: new Set(),
            shouldRemove: true,
          },
          '--b': {
            used: 1,
            decl: true,
            deps: new Set(),
            shorterName: '--0',
          },
        },
      ],
      [
        'deps',
        true,
        {
          '--a': {
            used: 2,
            decl: true,
            deps: new Set(['--b', '--c']),
          },
          '--b': {
            used: 2,
            decl: true,
            deps: new Set(),
          },
        },
        {
          '--a': {
            decl: true,
            deps: new Set(['--b', '--c']),
            shorterName: '--0',
            used: 2,
          },
          '--b': {
            decl: true,
            deps: new Set(),
            shorterName: '--1',
            used: 2,
          },
        },
      ],
    ];

    test.each(cases)('shrink case: %s', (_, shortenName, input, output) => {
      const stats = new CustomPropertiesStats();
      stats['storage'] = input;
      stats.shrink(shortenName);
      expect(stats['storage']).toEqual(output);
    });
  });
});
