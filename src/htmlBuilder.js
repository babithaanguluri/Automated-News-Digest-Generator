function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[character]));
}

function safeHref(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : '#';
  } catch {
    return '#';
  }
}

class HTMLBuilder {
  constructor(clock = () => new Date()) {
    this.clock = clock;
    this.parts = [
      '<!doctype html><html lang="en"><head><meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      '<title>Daily News Digest</title>',
      '<style>body{font-family:system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem;line-height:1.5;color:#172033}h1{margin-bottom:.25rem}section{margin:2rem 0}ul{padding-left:1.4rem}li{margin:.7rem 0}a{color:#1456a0}small{color:#5a6678}</style>',
      '</head><body>'
    ];
    this.footerAdded = false;
  }

  addHeader(title) {
    this.parts.push(`<header><h1>${escapeHtml(title)}</h1><p>Curated headlines across five categories.</p></header>`);
    return this;
  }

  addSection(category, articles) {
    const items = articles.length > 0 ? articles : [{
      title: `No live headlines available for ${category}`,
      url: `https://news.google.com/search?q=${encodeURIComponent(category)}`,
      source: 'News search'
    }];

    this.parts.push(`<section><h2>${escapeHtml(category)}</h2><ul>`);
    for (const article of items) {
      this.parts.push(`<li><a href="${escapeHtml(safeHref(article.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(article.title)}</a> <small>(${escapeHtml(article.source || 'Unknown source')})</small></li>`);
    }
    this.parts.push('</ul></section>');
    return this;
  }

  addFooter() {
    if (!this.footerAdded) {
      this.parts.push(`<footer><p>Generated ${escapeHtml(this.clock().toISOString())}</p></footer></body></html>`);
      this.footerAdded = true;
    }
    return this;
  }

  build() {
    return this.addFooter().parts.join('');
  }
}

module.exports = { HTMLBuilder, escapeHtml, safeHref };
