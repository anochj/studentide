# Dictionaries and Data
# A dictionary stores related values with names called keys.

session = {
    "topic": "functions",
    "minutes": 25,
    "mood": "focused",
}

print("Study Session")
print("-------------")
print("Topic:", session["topic"])
print("Minutes:", session["minutes"])
print("Mood:", session["mood"])

sessions = [
    {"topic": "strings", "minutes": 15},
    {"topic": "loops", "minutes": 20},
    {"topic": "dictionaries", "minutes": 25},
]

print()
print("All sessions:")
for item in sessions:
    print("-", item["topic"], "for", item["minutes"], "minutes")
