# Final Project: Profile Quiz
# This project uses printing, variables, strings, input, conditionals, lists, and loops.

# To run this file in the terminal, use the command: python3 10_final_project_profile_quiz

print("Welcome to the Profile Quiz.")
print("Answer a few questions and I will build a profile for you.")
print()

# Ask questions and store the answers in variables.
name = input("What is your name? ")
age = input("How old are you? ")
food = input("What is your favourite food? ")
colour = input("What is your favourite colour? ")
goal = input("What do you want to build one day? ")
likes_python = input("Do you like Python? ")

print()

# Use conditionals to respond to an answer.
if likes_python == "yes":
    print("Great. You are in the right place.")
else:
    print("No problem. You can still learn a lot by practicing.")

if colour == "blue":
    print("Blue is a calm choice.")
elif colour == "green":
    print("Green feels fresh.")
elif colour == "red":
    print("Red is bold.")
else:
    print(f"{colour} is a nice colour.")

print()
print("Now tell me three things you are interested in.")

# Store several related answers in a list.
interest_one = input("Interest 1: ")
interest_two = input("Interest 2: ")
interest_three = input("Interest 3: ")

interests = [interest_one, interest_two, interest_three]

# Add one more item to the list.
interests.append("learning Python")

print()
print("Profile Summary")
print("---------------")
print("Name:", name)
print("Age:", age)
print("Favourite food:", food)
print("Favourite colour:", colour)
print("Goal:", goal)

print()
print("Interests:")

# Use a loop to print each interest.
for interest in interests:
    print("-", interest)

print()
print(f"{name} wants to build {goal}.")
print("Nice work. You finished the final project starter.")

# Challenge idea:
# 1. Add two more input() questions.
# 2. Add the answers to the final profile.
# 3. Add another colour branch with elif.
# 4. Ask for one more interest and append it to the interests list.
# 5. Change the final messages so they sound like you.
