name: Run bot

on:
  workflow_dispatch:
  push:
    branches:
      - "main"
    paths:
      - "user_interface.py"
      - "config.yml"

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 355

    concurrency:
      group: bot-run
      cancel-in-progress: false

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3
        
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.13"

      - name: Install dependencies & prepare
        run: |
          wget "https://github.com/official-stockfish/Stockfish/releases/download/stockfish-dev-20260630-60888387/stockfish-linux-x86-64-universal.tar.gz"

          tar -xzf stockfish-linux-x86-64-universal.tar.gz
          rm stockfish-linux-x86-64-universal.tar.gz

          BIN=$(find . -type f | grep stockfish | head -n 1)

          if [ -z "$BIN" ]; then
            echo "Stockfish binary not found!"
            exit 1
          fi

          mv "$BIN" engines/stockfish
          chmod +x engines/stockfish

          sed -i "s/TokenTimeIsBackBuddyss/${{ secrets.LICHESS_KEY }}/g" config.yml
          pip install -r requirements.txt
          chmod +x ./engines/fairy-stockfish_x86-64-bmi2

      - name: Run Bot
        run: |
          echo "Starting bot..."
          python user_interface.py --upgrade "join bharat-royals" "join royalracer-fans" "join world-chess-learners" &
          PID=$!

          ( sleep 20700 && echo "Time up. Killing bot..." && kill -SIGTERM $PID ) &

          wait $PID
          echo "Bot ended cleanly."

      - name: Self-Restart
        if: always()
        run: gh workflow run "Run bot"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
