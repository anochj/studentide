# Final Project: Study Tracker
# This project uses functions, dictionaries, lists, loops, and JSON.

import json
from pathlib import Path

DATA_FILE = Path("study-tracker-data.json")

def print_session(session):
    print("-", session["topic"], "for", session["minutes"], "minutes")

def total_minutes(sessions):
    total = 0
    for session in sessions:
        total = total + session["minutes"]
    return total

sessions = [
    {"topic": "Python review", "minutes": 20},
    {"topic": "Functions", "minutes": 25},
    {"topic": "JSON files", "minutes": 15},
]

DATA_FILE.write_text(json.dumps(sessions, indent=2))
loaded_sessions = json.loads(DATA_FILE.read_text())

print("Study Tracker")
print("-------------")
for session in loaded_sessions:
    print_session(session)

print()
print("Total minutes:", total_minutes(loaded_sessions))

if total_minutes(loaded_sessions) >= 60:
    print("You studied for at least one hour.")
else:
    print("You made progress. Keep going.")

DATA_FILE.unlink()
print()
print("Temporary study-tracker-data.json was removed after the demo.")
