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
    timeout-minutes: 355  # just under 6h limit

    concurrency:
      group: bot-run
      cancel-in-progress: false  # keep live jobs safe

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

         find . -type f | grep stockfish

         BIN=$(find . -type f | grep "stockfish.*x86-64-universal\|stockfish" | head -n 1)

         mv "$BIN" engines/stockfish
         chmod +x engines/stockfish
          sed -i "s/TokenTimeIsBackBuddyss/${{ secrets.LICHESS_KEY }}/g" config.yml
          pip install -r requirements.txt 
          chmod +x ./engines/stockfish-ubuntu-x86-64-bmi2 ./engines/fairy-stockfish_x86-64-bmi2 ./engines/stockfish

      - name: Run Bot
        run: |
          echo "Starting bot..."
          python user_interface.py --upgrade "join bharat-royals" "join royalracer-fans" "join world-chess-learners" &
          PID=$!
          # Auto-exit before GitHub 6h limit
          ( sleep 20700 && echo "Time up. Killing bot..." && kill -SIGTERM $PID ) &
          wait $PID
          echo "Bot ended cleanly."

      - name: 🔁 Self-Restart
        if: always()
        run: gh workflow run "Run bot"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}









































