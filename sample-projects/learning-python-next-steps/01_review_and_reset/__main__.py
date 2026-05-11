# Review and Reset
# To run this file in the terminal, use: python3 01_review_and_reset

name = "Alex"
goal = "practice Python"
minutes = 20

print("Welcome back to Python.")
print("Name:", name)
print("Goal:", goal)
print("Minutes planned:", minutes)

if minutes >= 20:
    print("That is a solid practice session.")
else:
    print("A small session still counts.")

steps = ["run the code", "change one thing", "run it again"]

print()
print("Practice steps:")
for step in steps:
    print("-", step)
