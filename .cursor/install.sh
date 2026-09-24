#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

command -v git >/dev/null
command -v bash >/dev/null

git config --global --add safe.directory "$repo_root" 2>/dev/null || true

if [[ ! -f README.md ]]; then
  echo "README.md is required for this profile repository." >&2
  exit 1
fi

echo "Profile README environment ready."
