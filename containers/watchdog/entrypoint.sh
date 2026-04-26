#!/bin/sh
set -e

: "${PROJECT_ID:?PROJECT_ID is required}"
: "${MAX_SESSION_SECONDS:?MAX_SESSION_SECONDS is required}"
: "${MAX_SIZE_MB:?MAX_SIZE_MB is required}"

# Configuration
CHECK_INTERVAL=5
EFS_MOUNT="/mnt/efs/$PROJECT_ID"

echo "Watchdog started for $PROJECT_ID"
echo "Session limit: $MAX_SESSION_SECONDS seconds"

ELAPSED=0

while [ $ELAPSED -lt $MAX_SESSION_SECONDS ]; do
    sleep $CHECK_INTERVAL
    ELAPSED=$((ELAPSED + CHECK_INTERVAL))

    echo "Checking session time: $ELAPSED seconds elapsed"

    # Check directory size if it exists
    if [ -d "$EFS_MOUNT" ]; then
        CURRENT_SIZE=$(du -sm "$EFS_MOUNT" | cut -f1)
        
        if [ "$CURRENT_SIZE" -ge "$MAX_SIZE_MB" ]; then
            echo "Storage limit exceeded. Locking $EFS_MOUNT to read-only."
            chmod -R 555 "$EFS_MOUNT"
            
            exit 1 
        fi
    fi
done

exit 0