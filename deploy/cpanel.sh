#!/usr/bin/env bash
set -euo pipefail

app_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
web_root="$HOME/public_html"

if [[ "$app_root" != "$HOME/vireda" ]]; then
    echo "Deploy the repository to $HOME/vireda before running this script." >&2
    exit 1
fi

for required in "$app_root/.env" "$app_root/vendor/autoload.php" "$app_root/public/build/manifest.json"; do
    if [[ ! -f "$required" ]]; then
        echo "Missing $required. Complete the setup steps in README.md first." >&2
        exit 1
    fi
done

if [[ -e "$web_root/.git" || -e "$web_root/.env" || -e "$web_root/artisan" ]]; then
    echo "A Laravel repository is still in $web_root. Move it outside the web root before deploying." >&2
    exit 1
fi

mkdir -p "$web_root"
cp -R "$app_root/public/." "$web_root/"
rm -f "$web_root/hot"
cp "$app_root/deploy/public_html_index.php" "$web_root/index.php"

echo "Deployed Laravel public files to $web_root"
