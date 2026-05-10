#!/bin/bash
set -e

: "${PROJECT_ID:?PROJECT_ID is required}"

EFS_TARGET="/mnt/efs/$PROJECT_ID"
HOME_LINK="/home"
WORKSPACE_DIR="$HOME_LINK/project"

mkdir -p "$EFS_TARGET"
chown -R 6767:6767 "$EFS_TARGET"

# remove any existing dirs
rm -rf "$HOME_LINK"

# symlink
ln -s "$EFS_TARGET" "$HOME_LINK"
chown -h 6767:6767 "$HOME_LINK"
mkdir -p "$WORKSPACE_DIR"
chown -R 6767:6767 "$WORKSPACE_DIR"

echo "Workspace linked to $EFS_TARGET"
# download starter files if the directory is empty
if [ -z "$(ls -A "$WORKSPACE_DIR" 2>/dev/null)" ] && [ -n "$STARTER_ZIP_URL" ]; then
    curl -sSLf -o /opt/starter-file.zip "$STARTER_ZIP_URL" || { echo "Starter file download failed"; exit 1; }

    # move all contents in zip to project dir
    mkdir -p /opt/starter-files
    unzip -q /opt/starter-file.zip -d /opt/starter-files

    # remove macOS junk
    rm -rf /opt/starter-files/__MACOSX
    find /opt/starter-files -name ".DS_Store" -delete

    # flatten if zip contains a single top-level folder
    shopt -s dotglob nullglob

    entries=(/opt/starter-files/*)

    if [ ${#entries[@]} -eq 1 ] && [ -d "${entries[0]}" ]; then
        mv "${entries[0]}"/* "$WORKSPACE_DIR/"
    else
        mv /opt/starter-files/* "$WORKSPACE_DIR/"
    fi

    shopt -u dotglob nullglob

    # clean up
    rm /opt/starter-file.zip 
    rm -rf /opt/starter-files

    # regive permissions to theia user, zipped contents are root
    chown -R 6767:6767 "$WORKSPACE_DIR" 
fi



# start theia
exec runuser -u theia -- env HOME="/home" VSX_REGISTRY_URL="$VSX_REGISTRY_URL" node /opt/theia/applications/browser/lib/backend/main.js "$WORKSPACE_DIR" \
    --hostname=0.0.0.0 \
