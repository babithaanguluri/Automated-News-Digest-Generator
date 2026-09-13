function normalizeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return '';
  }

  const rawUrl = value.trim();
  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;

  try {
    const parsed = new URL(withProtocol);
    const hostname = parsed.hostname.replace(/^www\./i, '');
    const port = parsed.port ? `:${parsed.port}` : '';
    const pathname = parsed.pathname.replace(/\/+$/, '');
    const query = parsed.search;
    return `${hostname}${port}${pathname || ''}${query}`.toLowerCase();
  } catch {
    return rawUrl.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '').toLowerCase();
  }
}

function deduplicateArticles(articles) {
  const seen = new Set();
  const unique = [];

  for (const article of articles) {
    const normalizedUrl = normalizeUrl(article.url);
    if (!normalizedUrl || seen.has(normalizedUrl)) {
      continue;
    }

    seen.add(normalizedUrl);
    unique.push(article);
  }

  return unique;
}

module.exports = { normalizeUrl, deduplicateArticles };
