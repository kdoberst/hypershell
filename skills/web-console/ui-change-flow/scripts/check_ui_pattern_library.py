#!/usr/bin/env python3
"""Validate the HyperShell positive UI pattern library."""

from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[4]
LIBRARY = ROOT / "specs/web-console/patterns"
STORY_ROOTS = (
    ROOT / "specs/web-console/mockups",
    ROOT / "components/web-console/app",
)
ALLOWED_STATUS = {"candidate", "approved", "superseded"}
PATTERN_REQUIRED_SECTIONS = {
    "## When to use",
    "## Required states",
    "## Accessibility",
    "## Responsive behavior",
    "## Do",
    "## Don't",
    "## Related",
}
FOUNDATION_REQUIRED_SECTIONS = {
    "## When to use",
    "## Accessibility",
    "## Do",
    "## Don't",
    "## Related",
}


def parse_front_matter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    match = re.fullmatch(r"---\n(.*?)\n---\n(.*)", text, re.DOTALL)
    if not match:
        raise ValueError(f"{path}: missing front matter")
    metadata = yaml.safe_load(match.group(1))
    if not isinstance(metadata, dict):
        raise ValueError(f"{path}: front matter must be an object")
    return metadata


def story_titles() -> set[str]:
    titles: set[str] = set()
    for story_root in STORY_ROOTS:
        for path in story_root.rglob("*.stories.tsx"):
            text = path.read_text(encoding="utf-8")
            for match in re.finditer(r'^\s*title:\s*"([^"]+)"', text, re.MULTILINE):
                titles.add(match.group(1))
    return titles


def check_entries(entries: list[dict], kind: str, errors: list[str], titles: set[str]) -> None:
    seen_ids: set[str] = set()
    for entry in entries:
        label = f"{kind} {entry.get('id', '<missing>')}"
        if "id" not in entry:
            errors.append(f"{label}: missing id")
            continue
        if entry["id"] in seen_ids:
            errors.append(f"{label}: duplicate id")
        seen_ids.add(entry["id"])

        for field in ("path", "status", "tags"):
            if field not in entry:
                errors.append(f"{label}: missing {field}")

        if entry.get("status") not in ALLOWED_STATUS:
            errors.append(f"{label}: invalid status {entry.get('status')!r}")

        path_value = entry.get("path")
        if not isinstance(path_value, str):
            continue
        path = LIBRARY / path_value
        if not path.is_file():
            errors.append(f"{label}: missing file {path}")
            continue

        try:
            metadata = parse_front_matter(path)
        except ValueError as error:
            errors.append(str(error))
            continue

        if metadata.get("id") != entry["id"]:
            errors.append(f"{label}: index and document ids differ")
        if metadata.get("status") != entry.get("status"):
            errors.append(f"{label}: index and document statuses differ")

        text = path.read_text(encoding="utf-8")
        required_sections = (
            PATTERN_REQUIRED_SECTIONS
            if kind == "patterns"
            else FOUNDATION_REQUIRED_SECTIONS
        )
        missing_sections = required_sections - set(text.splitlines())
        if missing_sections:
            errors.append(
                f"{label}: missing sections {', '.join(sorted(missing_sections))}"
            )

        if kind == "patterns" and entry.get("status") == "approved":
            story = entry.get("story") or metadata.get("story")
            if not story:
                errors.append(f"{label}: approved pattern missing story")
            elif story not in titles:
                errors.append(f"{label}: story {story!r} not found")
            for field in ("components",):
                if field not in metadata:
                    errors.append(f"{label}: approved pattern missing {field}")

        if entry.get("status") == "superseded" and not metadata.get("replaces"):
            errors.append(f"{label}: superseded entry missing replaces")


def main() -> int:
    index_path = LIBRARY / "index.yaml"
    if not index_path.is_file():
        print(f"error: missing {index_path}", file=sys.stderr)
        return 1

    try:
        index = yaml.safe_load(index_path.read_text(encoding="utf-8"))
    except yaml.YAMLError as error:
        print(f"error: invalid index.yaml: {error}", file=sys.stderr)
        return 1

    errors: list[str] = []
    titles = story_titles()
    for kind in ("foundations", "patterns"):
        entries = index.get(kind, [])
        if not isinstance(entries, list):
            errors.append(f"index {kind} must be a list")
            continue
        check_entries(entries, kind, errors, titles)

    indexed_paths = {
        str((LIBRARY / entry["path"]).relative_to(ROOT))
        for kind in ("foundations", "patterns")
        for entry in index.get(kind, [])
        if isinstance(entry, dict) and isinstance(entry.get("path"), str)
    }
    for directory in (LIBRARY / "foundations", LIBRARY / "patterns"):
        for path in directory.glob("*.md"):
            relative = str(path.relative_to(ROOT))
            if relative not in indexed_paths:
                errors.append(f"unindexed document: {relative}")

    if errors:
        for error in errors:
            print(f"error: {error}", file=sys.stderr)
        return 1

    print("UI pattern library validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
