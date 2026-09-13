# Automated News Digest Builder

A small Node.js command-line application that fetches top headlines for five configured categories, removes duplicate articles by canonical URL, and writes a readable HTML digest.

## Setup

Requirements: Node.js 18 or newer.

```bash
npm install
```

## Configuration

Copy the template into the root configuration file:

```bash
cp config.json.example config.json
```

Set `apiKey` to a NewsAPI key. Keep the five-category array and set `outputFile` to the desired HTML path. The included placeholder key enables a local demo feed, so the application can be run before a key is available. `config.json` is ignored by git so credentials are not committed.

```json
{
  "apiKey": "YOUR_API_KEY_HERE",
  "categories": ["technology", "business", "science", "health", "sports"],
  "outputFile": "output/digest.html"
}
```

## Running the Application

Run the complete digest generation process with the single package command:

```bash
npm start
```

The output directory is created automatically. The generated file is written exactly to the path in `config.json`.

## Running with Docker

Build and run the project in a container:

```bash
docker build -t automated-news-digest-builder .
docker run --rm automated-news-digest-builder
```

The image starts with the bundled `config.json.example` as a default config, so it can produce a demo digest immediately without a real NewsAPI key. For a live run, update the generated `config.json` in the container or mount a host config file before starting the container.

A Compose-based workflow is also included:

```bash
docker compose up --build
```

For a live NewsAPI request, use a real API key. Optional environment overrides are available for compatible deployments:

```bash
NEWS_API_URL="https://newsapi.org/v2/top-headlines" NEWS_COUNTRY="us" npm start
```

## Running Tests

```bash
npm test
```

The suite verifies the singleton configuration service, URL deduplication, incremental HTML builder behavior, and the complete orchestration path with a mocked API client. No test makes a network request.

## Output contract

The generated HTML contains one main `<h1>`, one `<h2>` and `<ul>` for each of the five configured categories, and at least one linked `<li>` per list. Article text and URLs are escaped before insertion into the document.
