name: Download and Unzip Engine

on:
  workflow_dispatch:
  push:

permissions:
  contents: write   # needed to push commits

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Fetches all history so rebase works correctly

      - name: Download zip
        run: |
          mkdir -p engines
          curl -L -o engine.zip "https://github.com/suprateem-ux/suprabot/raw/main/engines/fairy-stockfish-linux-x86-64-bmi2%204.zip"

      - name: Unzip
        run: |
          unzip -o engine.zip -d engines
          rm engine.zip

      - name: Commit extracted files
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          
          # 1. Stage the files first
          git add engines/
          
          # 2. Commit if there are changes, otherwise exit gracefully
          if ! git diff-index --quiet HEAD --; then
            git commit -m "Add unzipped engine files"
            
            # 3. Pull with rebase ONLY after committing to avoid the unstaged changes error
            git pull --rebase origin main
            
            # 4. Push the changes
            git push
          else
            echo "No changes to commit"
          fi
