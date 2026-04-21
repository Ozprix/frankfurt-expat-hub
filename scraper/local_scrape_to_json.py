#!/usr/bin/env python3
"""Run zero-cost local AI scraping and write static JSON for the React app.

This script uses the open-source ScrapeGraphAI library with local Ollama models.
It does not call OpenAI, ScrapeGraph Cloud, or any paid scraping API.
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from scrapegraphai.graphs import SmartScraperGraph


DEFAULT_PROMPT_PATH = Path("scraper/prompts/directory.txt")
DEFAULT_OUTPUT_PATH = Path("src/data/scraped/directory.json")


def read_prompt(args: argparse.Namespace) -> str:
    if args.prompt:
        return args.prompt

    prompt_path = Path(args.prompt_file)
    return prompt_path.read_text(encoding="utf-8")


def normalize_result(result: Any, source_url: str) -> list[dict[str, Any]]:
    if isinstance(result, dict) and isinstance(result.get("partners"), list):
        rows = result["partners"]
    elif isinstance(result, list):
        rows = result
    elif isinstance(result, dict):
        rows = [result]
    else:
        rows = [{"summary": str(result)}]

    scraped_at = datetime.now(timezone.utc).isoformat()
    normalized = []

    for row in rows:
        if not isinstance(row, dict):
            row = {"summary": str(row)}

        normalized.append(
            {
                "name": row.get("name", ""),
                "category": row.get("category", "Other"),
                "summary": row.get("summary", ""),
                "services": row.get("services", []),
                "languages": row.get("languages", []),
                "location": row.get("location", ""),
                "url": row.get("url") or source_url,
                "contact": row.get("contact", ""),
                "pricing": row.get("pricing", ""),
                "evidence": row.get("evidence", ""),
                "sourceUrl": source_url,
                "scrapedAt": scraped_at,
                "reviewStatus": "needs-review",
            }
        )

    return normalized


def load_existing(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []

    data = json.loads(path.read_text(encoding="utf-8"))
    return data if isinstance(data, list) else []


def write_json(path: Path, rows: list[dict[str, Any]], append: bool) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)

    output = [*load_existing(path), *rows] if append else rows
    path.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def run_scrape(args: argparse.Namespace) -> list[dict[str, Any]]:
    prompt = read_prompt(args)
    graph_config = {
        "llm": {
            "model": f"ollama/{args.model}",
            "temperature": 0,
            "format": "json",
        },
        "embeddings": {
            "model": f"ollama/{args.embedding_model}",
        },
        "verbose": args.verbose,
    }

    graph = SmartScraperGraph(
        prompt=prompt,
        source=args.url,
        config=graph_config,
    )

    return normalize_result(graph.run(), args.url)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Scrape a public URL locally and write static JSON.")
    parser.add_argument("--url", required=True, help="Public webpage to scrape.")
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT_PATH), help="JSON output path.")
    parser.add_argument("--prompt-file", default=str(DEFAULT_PROMPT_PATH), help="Prompt file path.")
    parser.add_argument("--prompt", help="Inline extraction prompt. Overrides --prompt-file.")
    parser.add_argument("--model", default="llama3.2", help="Ollama chat model name.")
    parser.add_argument("--embedding-model", default="nomic-embed-text", help="Ollama embedding model name.")
    parser.add_argument("--append", action="store_true", help="Append rows instead of replacing the output file.")
    parser.add_argument("--verbose", action="store_true", help="Enable ScrapeGraphAI verbose logging.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    rows = run_scrape(args)
    write_json(Path(args.output), rows, args.append)
    print(f"Wrote {len(rows)} scraped row(s) to {args.output}")


if __name__ == "__main__":
    main()
