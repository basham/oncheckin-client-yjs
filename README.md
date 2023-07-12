# oncheckin-client-yjs
Persistent online peer and backup for Yjs docs.

## Setup

Create `config/default.yaml`, with the following configurations.

```yaml
# Directory of the LevelDB database that contains all synced Yjs docs.
dbDir: ./data/db
# Directory of daily backups for each doc.
# Each doc contains its own subdirectory.
# Doc backups are in a format like 2023-07-05.json.gz.
# current.json is the live backup.
docsDir: ./data/docs
# URL of the Yjs websocket server.
server: wss://...
# List of doc names to backup.
docs:
- <doc 1>
- <doc 2>
```
