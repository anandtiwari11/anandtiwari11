#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

if [[ ! -f README.md ]]; then
  echo "README.md is missing." >&2
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Repository is not a git work tree." >&2
  exit 1
fi

byte_count="$(wc -c < README.md | tr -d ' ')"
if [[ "$byte_count" -lt 1 ]]; then
  echo "README.md is empty." >&2
  exit 1
fi

echo "README.md validation passed (${byte_count} bytes)."
