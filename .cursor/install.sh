#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

command -v git >/dev/null
command -v bash >/dev/null
command -v node >/dev/null
command -v npm >/dev/null

git config --global --add safe.directory "$repo_root" 2>/dev/null || true

if [[ ! -f README.md ]]; then
  echo "README.md is required for this profile repository." >&2
  exit 1
fi

# Install the markdown preview + lint toolchain. Idempotent: npm ci when a
# lockfile is present, otherwise npm install (which also creates the lockfile).
preview_dir="$repo_root/.cursor/preview"
cd "$preview_dir"
if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi

echo "Profile README environment ready."
echo "Node: $(node --version), npm: $(npm --version)"
