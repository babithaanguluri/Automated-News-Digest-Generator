jest.mock('../src/apiClient', () => ({
  fetchNewsForCategory: jest.fn()
}));

const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const apiClient = require('../src/apiClient');
const { generateDigest } = require('../src/index');

describe('digest orchestration', () => {
  test('uses mocked API data and writes all five category sections without network access', async () => {
    const outputDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'news-digest-'));
    const categories = ['technology', 'business', 'science', 'health', 'sports'];
    const configService = {
      getCategories: () => categories,
      getOutputPath: () => path.join(outputDirectory, 'digest.html')
    };

    apiClient.fetchNewsForCategory.mockImplementation(async (category) => [{
      title: `${category} headline`,
      url: ['technology', 'business'].includes(category) ? 'https://www.example.com/shared/' : `https://example.com/${category}`,
      source: 'Mock source'
    }]);

    const result = await generateDigest({ configService, newsClient: apiClient, fileSystem: fs });
    const html = await fs.readFile(result.outputPath, 'utf8');

    expect(apiClient.fetchNewsForCategory).toHaveBeenCalledTimes(5);
    expect((html.match(/<h1>/g) || []).length).toBe(1);
    expect((html.match(/<h2>/g) || []).length).toBe(5);
    expect((html.match(/<ul>/g) || []).length).toBe(5);
    expect((html.match(/<li>/g) || []).length).toBeGreaterThanOrEqual(5);
    expect(html).toContain('technology headline');
    expect(html).toContain('No live headlines available for business');
  });
});
