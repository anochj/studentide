#!/bin/bash
set -e

: "${PROJECT_ID:?PROJECT_ID is required}"

EFS_TARGET="/mnt/efs/$PROJECT_ID"
WORKSPACE_LINK="/home/project"

mkdir -p "$EFS_TARGET"
chown -R 6767:6767 "$EFS_TARGET"

# remove any existing dirs
if [ -d "$WORKSPACE_LINK" ] && [ ! -L "$WORKSPACE_LINK" ]; then
    rm -rf "$WORKSPACE_LINK"
fi

# symlink
ln -s "$EFS_TARGET" "$WORKSPACE_LINK"
chown -h 6767:6767 "$WORKSPACE_LINK"

# start theia
exec runuser -u theia -- node /opt/theia/applications/browser/lib/backend/main.js "$WORKSPACE_LINK" --hostname=0.0.0.0