#!/usr/bin/env bash
set -euo pipefail

# llms-gist skill installer for Claude Code
# Usage: curl -fsSL llmsgist.org/i | bash

REPO="https://github.com/imsaif/gist.git"
SKILL_DIR="$HOME/.claude/skills/llms-gist"
TMP_DIR=$(mktemp -d)

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo ""
echo "  llmsgist.org: installing Claude Code skill"
echo "  ────────────────────────────────────────────"
echo ""

# Check if already installed
if [ -d "$SKILL_DIR" ]; then
  echo "  Found existing installation at $SKILL_DIR"
  read -r -p "  Update to latest version? [Y/n] " response
  response=${response:-Y}
  if [[ "$response" =~ ^[Nn] ]]; then
    echo "  Skipped. Your existing installation is unchanged."
    exit 0
  fi
  rm -rf "$SKILL_DIR"
  echo "  Removed old version."
fi

# Clone only what we need
echo "  Downloading skill files..."
git clone --depth 1 --filter=blob:none --sparse "$REPO" "$TMP_DIR/gist" 2>/dev/null
cd "$TMP_DIR/gist"
git sparse-checkout set skills/llms-gist 2>/dev/null

# Install
mkdir -p "$(dirname "$SKILL_DIR")"
cp -r "$TMP_DIR/gist/skills/llms-gist" "$SKILL_DIR"

echo ""
echo "  Installed to $SKILL_DIR"
echo ""
echo "  Next steps:"
echo "  1. Open Claude Code in any project"
echo "  2. Type: /llms-gist"
echo "  3. It will audit how AI tools see your project"
echo ""
echo "  Quick start:"
echo "    /llms-gist          ← audit your current project"
echo "    /llms-gist quick    ← generate a starter file fast"
echo "    /llms-gist create   ← full guided conversation"
echo ""
