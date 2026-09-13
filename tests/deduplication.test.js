const { normalizeUrl, deduplicateArticles } = require('../src/deduplication');

describe('article deduplication', () => {
  test('keeps the first article when URLs differ only by protocol, www, or slash', () => {
    const articles = [
      { title: 'First', url: 'http://a.com/story/', source: 'One' },
      { title: 'Duplicate', url: 'https://www.a.com/story', source: 'Two' },
      { title: 'Different', url: 'https://b.com/story', source: 'Three' }
    ];

    const unique = deduplicateArticles(articles);

    expect(normalizeUrl(articles[0].url)).toBe(normalizeUrl(articles[1].url));
    expect(unique).toHaveLength(2);
    expect(unique.map((article) => article.title)).toEqual(['First', 'Different']);
  });
});
