const fs = require('node:fs/promises');
const path = require('node:path');
const ConfigService = require('./configService');
const apiClient = require('./apiClient');
const { deduplicateArticles } = require('./deduplication');
const { HTMLBuilder } = require('./htmlBuilder');

async function generateDigest({
  configService = ConfigService.getInstance(),
  newsClient = apiClient,
  fileSystem = fs,
  builderFactory = () => new HTMLBuilder()
} = {}) {
  const categories = configService.getCategories();
  const articles = [];

  for (const category of categories) {
    try {
      const fetched = await newsClient.fetchNewsForCategory(category, configService);
      for (const article of fetched) {
        articles.push({ ...article, category });
      }
      console.log(`Fetched ${fetched.length} article(s) for ${category}`);
    } catch (error) {
      console.error(`Unable to fetch ${category}: ${error.message}`);
    }
  }

  const uniqueArticles = deduplicateArticles(articles);
  const byCategory = new Map(categories.map((category) => [category, []]));
  for (const article of uniqueArticles) {
    byCategory.get(article.category).push(article);
  }

  const builder = builderFactory();
  builder.addHeader('Daily News Digest');
  for (const category of categories) {
    builder.addSection(category, byCategory.get(category));
  }
  builder.addFooter();

  const html = builder.build();
  const outputPath = typeof configService.getOutputPath === 'function'
    ? configService.getOutputPath()
    : path.resolve(configService.baseDirectory, configService.getOutputFile());

  await fileSystem.mkdir(path.dirname(outputPath), { recursive: true });
  await fileSystem.writeFile(outputPath, html, 'utf8');
  return { outputPath, articleCount: uniqueArticles.length, html };
}

if (require.main === module) {
  generateDigest()
    .then(({ outputPath, articleCount }) => {
      console.log(`Digest complete: ${articleCount} unique article(s) written to ${outputPath}`);
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}

module.exports = { generateDigest };
