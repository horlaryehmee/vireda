#!/usr/bin/env bash
set -euo pipefail

app_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"

if [[ "$app_root" != "$HOME/public_html" ]]; then
    echo "This setup expects the repository in $HOME/public_html." >&2
    exit 1
fi

for required in "$app_root/.htaccess" "$app_root/.env" "$app_root/vendor/autoload.php" "$app_root/public/build/manifest.json"; do
    if [[ ! -f "$required" ]]; then
        echo "Missing $required. Complete the setup steps in README.md first." >&2
        exit 1
    fi
done

rm -f "$app_root/public/hot"

echo "Laravel is ready in $app_root; the root .htaccess routes requests to public/."
