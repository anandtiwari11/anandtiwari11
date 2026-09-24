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

# Lint the README with the profile-tuned ruleset.
preview_dir="$repo_root/.cursor/preview"
if [[ -d "$preview_dir/node_modules" ]]; then
  (cd "$preview_dir" && npm run --silent lint)
  echo "Markdown lint passed."
else
  echo "Preview dependencies not installed; run .cursor/install.sh first." >&2
  exit 1
fi

# Smoke-test the preview renderer end to end (no long-running server needed).
node "$preview_dir/render-check.mjs"
echo "Preview render check passed."
