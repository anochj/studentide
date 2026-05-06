#!/bin/sh
set -e

: "${PROJECT_ID:?PROJECT_ID is required}"
: "${S3_SIGNED_URL:?S3_SIGNED_URL is required}"

EFS_MOUNT="/mnt/efs/$PROJECT_ID"
ARCHIVE_PATH="/tmp/project-archive-${PROJECT_ID}.zip"

if [ ! -d "$EFS_MOUNT" ]; then
    echo "Workspace $PROJECT_ID has not been initialized yet. Nothing to archive."
    # Exit 0 so the task succeeds instead of failing and retrying
    exit 0 
fi

cd "$EFS_MOUNT"
zip -r "$ARCHIVE_PATH" .

curl -f -X PUT -T "$ARCHIVE_PATH" "$S3_SIGNED_URL" \
    -H "Content-Type: application/zip"

rm -f "$ARCHIVE_PATH"

echo "Project $PROJECT_ID archived and uploaded to S3 successfully."

exit 0