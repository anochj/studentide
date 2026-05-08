#!/bin/bash
# this script should be run inside of apps/infra
set -e

if [ ! -f cdk-outputs.json ]; then
    echo "cdk-outputs.json not found. Assuming CDK is synced. Skipping.."
    exit 0
fi

jq -c '.IDEStack | to_entries[]' cdk-outputs.json | while read -r item; do
    # get the info from the kv pairs
    ENV_NAME=$(echo "$item" | jq -r '.key')
    ENV_VALUE=$(echo "$item" | jq -r '.value')

    # save it to vercel
    bunx vercel env rm "$ENV_NAME" production --token "${VERCEL_TOKEN}" --yes || true 
    echo -n "$ENV_VALUE" | npx vercel env add "$ENV_NAME" production --token "${VERCEL_TOKEN}" plain
done