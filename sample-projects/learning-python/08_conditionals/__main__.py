# Conditionals
# Conditionals let your program make decisions.

# To run this file in the terminal, use the command: python3 08_conditionals

print("Welcome to conditionals.")
print("Try answering with lowercase words like yes, no, blue, or green.")
print()

likes_python = input("Do you like Python? ")

if likes_python == "yes":
    print("Nice. Python likes you too.")
else:
    print("That is okay. Learning takes time.")

print()

favourite_colour = input("What is your favourite colour? ")

if favourite_colour == "blue":
    print("Blue is calm.")
elif favourite_colour == "green":
    print("Green feels fresh.")
elif favourite_colour == "red":
    print("Red is bold.")
else:
    print(f"{favourite_colour} is a nice colour.")

print()

# You can also use conditionals with variables you create yourself.
weather = "rainy"

if weather == "rainy":
    print("Bring an umbrella.")
else:
    print("Enjoy the weather.")

# Here are some lines for you to edit for the challenges.
snack = input("What snack do you like? ")

if snack == "popcorn":
    print("Popcorn is great for movie night.")
else:
    print(f"{snack} sounds tasty.")

# Challenge idea:
# 1. Change one condition to check for a different word.
# 2. Add a new elif branch for another colour.
# 3. Change the weather variable and run the program again.
# 4. Add your own input() question and conditional.

print()
print("Nice. Your program can now make decisions.")
