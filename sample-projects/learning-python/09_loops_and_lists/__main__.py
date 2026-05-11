# Loops and Lists
# Lists store multiple values.
# Loops let you repeat code.

# To run this file in the terminal, use the command: python3 09_loops_and_lists

# A list stores multiple items in one variable.
foods = ["pizza", "sushi", "tacos"]
print(foods)

print()
print("Foods one at a time:")

# A for loop repeats for each item in the list.
for food in foods:
    print(food)

# You can add to a list with append().
foods.append("pasta")

print()
print("Foods after append:")
for food in foods:
    print(food)

# Lists can store numbers too.
scores = [10, 20, 30]

print()
print("Scores:")
for score in scores:
    print(score)

# Here are some lines for you to edit for the challenges.
things_to_learn = ["variables", "strings", "loops"]

print()
print("Things to learn:")
for thing in things_to_learn:
    print(thing)

things_to_learn.append("projects")

print()
print("Updated learning list:")
for thing in things_to_learn:
    print(thing)

# Challenge idea:
# 1. Change the foods list to foods you actually like.
# 2. Create a list called favourite_games.
# 3. Use a for loop to print each game.
# 4. Use append() to add one more game.
# 5. Print the updated list.

print()
print("Nice. You can now work with groups of values.")
