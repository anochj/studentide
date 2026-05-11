# Files and JSON
# JSON is a common way to save simple data.

import json
from pathlib import Path

file_path = Path("study-data.json")

sessions = [
    {"topic": "functions", "minutes": 20},
    {"topic": "dictionaries", "minutes": 25},
]

file_path.write_text(json.dumps(sessions, indent=2))
print("Saved study data.")

loaded_sessions = json.loads(file_path.read_text())

print()
print("Loaded sessions:")
for session in loaded_sessions:
    print("-", session["topic"], "for", session["minutes"], "minutes")

file_path.unlink()
print()
print("Removed the temporary study-data.json file after the demo.")
