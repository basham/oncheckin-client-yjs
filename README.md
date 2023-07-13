# oncheckin-client-yjs
Persistent online peer and backup for Yjs docs.

## Setup

Create `config/default.yaml`, with the following configurations.

```yaml
# URL of the Yjs websocket server.
server: wss://...
# Directory of the LevelDB database that contains all synced Yjs docs.
dbDir: ./data/db
# Directory of daily backups for each doc.
# Each doc contains its own subdirectory.
# Doc backups are in a format like 2023-07-05.json.gz.
# current.json is the live backup.
docsDir: ./data/docs
# Name of the top-level Yjs doc key that contains the data to be backed up. This will also be used as the base name for the JSON file representing the latest version of the document.
docRoot: data
# Amount of time in milliseconds to debounce a backup triggered by document updates.
debounceBackupInterval: 10000
# List of doc names to backup.
docs:
- <doc 1>
- <doc 2>
```
