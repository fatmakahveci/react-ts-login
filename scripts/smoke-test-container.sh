#!/usr/bin/env bash
set -euo pipefail

image="${1:?Usage: bash scripts/smoke-test-container.sh IMAGE}"
container_id="$(docker run --detach "$image")"
cleanup() {
  docker logs "$container_id"
  docker rm --force "$container_id" > /dev/null
}
trap cleanup EXIT

for attempt in {1..30}; do
  if docker exec "$container_id" node -e '
    fetch("http://127.0.0.1:3000")
      .then(async response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const html = await response.text();
        if (!html.includes("Forma") || !html.includes("main-content")) {
          throw new Error("Unexpected application response");
        }
        const assets = [...html.matchAll(/(?:src|href)="([^" ]+\.(?:js|css)(?:\?[^" ]*)?)"/g)]
          .map(match => match[1]).filter(path => path.startsWith("/_next/"));
        if (assets.length === 0) throw new Error("No application assets found");
        await Promise.all(assets.map(async path => {
          const asset = await fetch(new URL(path, "http://127.0.0.1:3000"));
          if (!asset.ok) throw new Error(`Missing asset: ${path}`);
        }));
      })
      .catch(error => { console.error(error.message); process.exit(1); });
  '; then
    echo "Container smoke test passed."
    exit 0
  fi
  sleep 2
done

echo "Container did not serve the application and its assets in time." >&2
exit 1
