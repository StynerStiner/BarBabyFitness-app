#!/bin/bash

# List of words to add to the dictionary
WORDS=(
  "Venmo"
  "venmo"
  "Stiner"
  "Lige"
  "Barbaby"
  "paycharge"
  "cspell"
  "markdownlint"
  "markdownlintMD"
  "txn"
  "webOS"
  "IEMobile"
  "webFallbackUrl"
)

# Create the VS Code user dictionary if it doesn't exist
VSCODE_DICT=~/Library/Application\ Support/Code/User/cspell-user-dictionary.txt
CURSOR_DICT=~/Library/Application\ Support/Cursor/User/cspell-user-dictionary.txt

# Touch the files to create them if they don't exist
touch "$VSCODE_DICT" 2>/dev/null
touch "$CURSOR_DICT" 2>/dev/null

# Add each word to the dictionaries
for word in "${WORDS[@]}"; do
  # Check if word already exists in the VS Code dictionary
  if ! grep -q "^$word$" "$VSCODE_DICT" 2>/dev/null; then
    echo "$word" >> "$VSCODE_DICT"
    echo "Added '$word' to VS Code dictionary"
  fi

  # Check if word already exists in the Cursor dictionary
  if ! grep -q "^$word$" "$CURSOR_DICT" 2>/dev/null; then
    echo "$word" >> "$CURSOR_DICT"
    echo "Added '$word' to Cursor dictionary"
  fi
done

# Update the project-level cspell config file
echo '{
  "version": "0.2",
  "words": [' > .cspell.json

# Add each word to the words array
for word in "${WORDS[@]}"; do
  echo "    \"$word\"," >> .cspell.json
done

# Close the JSON file
echo '  ],
  "enabled": false
}' >> .cspell.json

echo "Updated .cspell.json file"

# Create the .vscode settings file if it doesn't exist
mkdir -p .vscode
echo '{
  "cSpell.words": [' > .vscode/settings.json

# Add each word to the VS Code settings
for word in "${WORDS[@]}"; do
  echo "    \"$word\"," >> .vscode/settings.json
done

# Close the JSON file
echo '  ],
  "cSpell.enabled": false
}' >> .vscode/settings.json

echo "Updated .vscode/settings.json file"

echo "All words have been added to the dictionaries"
echo "Please restart Cursor for changes to take effect" 