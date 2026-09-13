const { HTMLBuilder } = require('../src/htmlBuilder');

describe('HTMLBuilder', () => {
  test('incrementally builds a header and article section', () => {
    const builder = new HTMLBuilder(() => new Date('2026-01-01T00:00:00.000Z'));

    builder
      .addHeader('Daily News Digest')
      .addSection('Technology', [{ title: 'A headline', url: 'https://example.com/story', source: 'Example' }])
      .addFooter();

    const html = builder.build();

    expect(html).toContain('<h1>Daily News Digest</h1>');
    expect(html).toContain('<h2>Technology</h2>');
    expect(html).toContain('<ul>');
    expect(html).toContain('<a href="https://example.com/story"');
    expect(new HTMLBuilder().addSection('Safety', [{ title: 'Unsafe', url: 'javascript:alert(1)', source: 'Example' }]).build()).toContain('href="#"');
    expect((html.match(/<h1>/g) || []).length).toBe(1);
  });
});
