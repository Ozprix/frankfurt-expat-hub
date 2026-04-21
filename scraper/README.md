# Local Web Scraping

This folder is for zero-cost local scraping. It uses ScrapeGraphAI with local Ollama models and writes static JSON that the React app can import at build time.

No paid APIs are required:

- No OpenAI API key
- No ScrapeGraph Cloud key
- No Netlify function scraping
- No live browser scraping from React

## Setup

Install Ollama and pull local models:

```bash
brew install ollama
ollama serve
ollama pull llama3.2
ollama pull nomic-embed-text
```

Create a Python environment from the project root:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r scraper/requirements.txt
playwright install chromium
```

## Scrape A Directory Candidate

```bash
python scraper/local_scrape_to_json.py \
  --url "https://example.com" \
  --output src/data/scraped/directory.json \
  --append
```

The default prompt lives at `scraper/prompts/directory.txt`.

## Workflow

1. Run the scraper locally against public pages you are allowed to access.
2. Review `src/data/scraped/directory.json`.
3. Remove weak, duplicate, or unverified rows.
4. Deploy the React app as normal. Netlify only serves static JSON and bundled React.

## Guardrails

- Check `robots.txt` and site terms.
- Do not bypass logins, paywalls, CAPTCHA, or anti-bot systems.
- Keep request volume low.
- Store source URL and scrape date.
- Treat scraped rows as research leads until manually reviewed.
