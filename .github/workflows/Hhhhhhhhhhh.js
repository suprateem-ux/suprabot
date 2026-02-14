name: Mirror engines folder only

on:
  workflow_dispatch:
  push:
    branches:
      - main

jobs:
  mirror:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout current repo
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Fetch source repo
        run: |
          git fetch https://github.com/veerbot/suprabot1.git main

      - name: Overwrite engines folder only
        run: |
          git checkout FETCH_HEAD -- engines

      - name: Commit changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add engines
          git commit -m "Sync engines folder from suprabot1" || echo "No changes"

      - name: Push changes
        run: |
          git push origin main
