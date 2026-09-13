const ConfigService = require('./configService');

const NEWS_API_URL = process.env.NEWS_API_URL || 'https://newsapi.org/v2/top-headlines';
const PLACEHOLDER_API_KEY = 'YOUR_API_KEY_HERE';

function demoArticle(category) {
  return {
    title: `Demo headline for ${category}`,
    url: `https://news.google.com/search?q=${encodeURIComponent(category)}`,
    source: 'Local demo feed'
  };
}

function normalizeArticle(article) {
  if (!article || typeof article.title !== 'string' || typeof article.url !== 'string' || !article.title.trim() || !article.url.trim()) {
    return null;
  }

  return {
    title: article.title.trim(),
    url: article.url.trim(),
    source: typeof article.source === 'string' ? article.source : article.source?.name || 'Unknown source'
  };
}

async function fetchNewsForCategory(category, configService = ConfigService.getInstance()) {
  const apiKey = configService.getApiKey();

  if (apiKey === PLACEHOLDER_API_KEY) {
    return [demoArticle(category)];
  }

  const params = new URLSearchParams({
    apiKey,
    category,
    country: process.env.NEWS_COUNTRY || 'us',
    pageSize: '10'
  });

  let response;
  try {
    response = await fetch(`${NEWS_API_URL}?${params}`, { signal: AbortSignal.timeout(10000) });
  } catch (error) {
    throw new Error(`Network request failed for ${category}: ${error.message}`);
  }

  const payload = await response.json();
  if (!response.ok || payload.status === 'error') {
    throw new Error(payload.message || `News API returned HTTP ${response.status}`);
  }

  return (Array.isArray(payload.articles) ? payload.articles : []).map(normalizeArticle).filter(Boolean);
}

module.exports = { fetchNewsForCategory, normalizeArticle, demoArticle };
