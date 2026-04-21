#!/usr/bin/env python3
"""Create reviewed blog drafts from web references.

This is a local drafting assistant inspired by the blog_post_writer pattern:
search -> fetch references -> select relevant chunks -> optional LLM draft.

It writes draft JSON to blog-drafts/. It does not publish to src/data/blogPosts.js.
"""

from __future__ import annotations

import argparse
import json
import os
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from duckduckgo_search import DDGS
from openai import OpenAI


SYSTEM_PROMPT_PATH = Path("scraper/prompts/blog_writer_system.txt")
DEFAULT_OUTPUT_DIR = Path("blog-drafts")
DEEPSEEK_BASE_URL = "https://api.deepseek.com"


@dataclass
class SourceChunk:
    title: str
    url: str
    text: str
    score: int


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "blog-draft"


def search_web(query: str, limit: int) -> list[dict[str, str]]:
    with DDGS() as ddgs:
        results = ddgs.text(query, max_results=limit)
        return [
            {
                "title": item.get("title", ""),
                "url": item.get("href", ""),
                "snippet": item.get("body", ""),
            }
            for item in results
            if item.get("href")
        ]


def fetch_page_text(url: str, timeout: int = 12) -> str:
    response = requests.get(
        url,
        timeout=timeout,
        headers={
            "User-Agent": "FrankfurtExpatServicesResearchBot/1.0 (+https://frankfurtexpatservices.com)"
        },
    )
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "aside", "form"]):
        tag.decompose()

    text = " ".join(soup.get_text(" ").split())
    return text[:12000]


def chunk_text(text: str, size: int = 1200, overlap: int = 180) -> Iterable[str]:
    start = 0
    while start < len(text):
        yield text[start : start + size]
        start += max(1, size - overlap)


def score_chunk(chunk: str, keywords: list[str]) -> int:
    lower = chunk.lower()
    return sum(lower.count(keyword) for keyword in keywords)


def collect_chunks(query: str, max_sources: int, max_chunks: int) -> tuple[list[SourceChunk], list[dict[str, str]]]:
    search_results = search_web(query, max_sources)
    keywords = [word for word in re.findall(r"[a-z0-9äöüß]+", query.lower()) if len(word) > 2]
    chunks: list[SourceChunk] = []

    for result in search_results:
        try:
            text = fetch_page_text(result["url"])
        except Exception as exc:
            print(f"Skipping {result['url']}: {exc}")
            continue

        for chunk in chunk_text(text):
            chunks.append(
                SourceChunk(
                    title=result["title"],
                    url=result["url"],
                    text=chunk,
                    score=score_chunk(chunk, keywords),
                )
            )

    chunks.sort(key=lambda item: item.score, reverse=True)
    return chunks[:max_chunks], search_results


def fallback_draft(topic: str, chunks: list[SourceChunk]) -> dict:
    sources = [{"title": chunk.title, "url": chunk.url} for chunk in chunks[:5]]
    seen_urls = set()
    unique_sources = []
    for source in sources:
        if source["url"] in seen_urls:
            continue
        seen_urls.add(source["url"])
        unique_sources.append(source)

    return {
        "title": topic,
        "description": f"Research notes for {topic}. Review and expand before publishing.",
        "category": "Bureaucracy",
        "readingTime": "5 min read",
        "sections": [
            {
                "heading": "Review these source notes",
                "body": "DeepSeek was not configured, so this draft contains extracted source notes for manual editing.",
            },
            *[
                {
                    "heading": chunk.title or "Source note",
                    "body": chunk.text[:700],
                }
                for chunk in chunks[:4]
            ],
        ],
        "sources": unique_sources,
    }


def generate_with_deepseek(topic: str, chunks: list[SourceChunk], model: str) -> dict:
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        return fallback_draft(topic, chunks)

    system_prompt = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8")
    source_notes = "\n\n".join(
        f"Source: {chunk.title}\nURL: {chunk.url}\nText: {chunk.text}" for chunk in chunks
    )

    client = OpenAI(api_key=api_key, base_url=DEEPSEEK_BASE_URL)
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": f"Topic: {topic}\n\nSource notes:\n{source_notes}",
            },
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
    )

    content = response.choices[0].message.content or "{}"
    return json.loads(content)


def write_draft(topic: str, draft: dict, output_dir: Path) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    slug = slugify(draft.get("title") or topic)
    payload = {
        "slug": slug,
        "draftedAt": datetime.now(timezone.utc).isoformat(),
        "status": "draft",
        **draft,
    }
    output_path = output_dir / f"{slug}.json"
    output_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return output_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a local blog draft from web references.")
    parser.add_argument("--topic", required=True, help="Blog topic or target keyword.")
    parser.add_argument("--max-sources", type=int, default=6, help="Maximum search results to fetch.")
    parser.add_argument("--max-chunks", type=int, default=8, help="Maximum retrieved chunks sent to the writer.")
    parser.add_argument("--output-dir", default=str(DEFAULT_OUTPUT_DIR), help="Draft output directory.")
    parser.add_argument("--model", default=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"), help="DeepSeek model name.")
    return parser.parse_args()


def main() -> None:
    load_dotenv()
    args = parse_args()
    chunks, _ = collect_chunks(args.topic, args.max_sources, args.max_chunks)
    if not chunks:
        raise SystemExit("No usable source text found. Try a more specific topic or fewer restricted sources.")

    draft = generate_with_deepseek(args.topic, chunks, args.model)
    output_path = write_draft(args.topic, draft, Path(args.output_dir))
    print(f"Wrote blog draft to {output_path}")


if __name__ == "__main__":
    main()
