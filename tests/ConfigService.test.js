const ConfigService = require('../src/configService');

describe('ConfigService singleton', () => {
  test('returns the exact same instance for repeated getInstance calls', () => {
    const first = ConfigService.getInstance();
    const second = ConfigService.getInstance();

    expect(first).toBe(second);
    expect(first.getCategories()).toHaveLength(5);
  });
});
