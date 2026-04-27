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
    # TODO: Problem where MacOS zip files have __MACOSX folders, so both that and the zip'd folder get moved to the workspace. Need to figure that out
    

    curl -sSLf -o /opt/starter-file.zip "$STARTER_ZIP_URL" || { echo "Starter file download failed"; exit 1; }

    mkdir -p /opt/starter-files
    unzip /opt/starter-file.zip -d /opt/starter-files

    # move all contents in zip to project dir
    shopt -s dotglob # include hidden files
    mv -v /opt/starter-files/* "$WORKSPACE_DIR/"
    shopt -u dotglob

    # clean up
    rm /opt/starter-file.zip 
    rm -rf /opt/starter-files

    # regive permissions to theia user, zipped contents are root
    chown -R 6767:6767 "$WORKSPACE_DIR" 
fi

# start theia
exec runuser -u theia -- env HOME="/home" node /opt/theia/applications/browser/lib/backend/main.js "$WORKSPACE_DIR" \
    --hostname=0.0.0.0 \
