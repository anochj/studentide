# Input
# input() lets your program ask the user a question.

# To run this file in the terminal, use the command: python3 07_input

print("Welcome to the input module.")
print("Answer the questions below.")
print()

# input() asks a question and waits for the user to type an answer.
name = input("What is your name? ")
print("Hello,", name)

# You can store more answers in more variables.
favourite_food = input("What is your favourite food? ")
print(f"{favourite_food} sounds great.")

# Input starts as text.
age = input("How old are you? ")
print(f"You typed {age}. Python is storing that answer as text for now.")

print()
print("Practice questions:")

# Here are some lines for you to edit for the challenges.
goal = input("What do you want to build one day? ")
print(f"Building {goal} would be a great project.")

colour = input("What is your favourite colour? ")
print(f"{colour} is a nice colour.")

# Challenge idea:
# 1. Change one question to ask about something else.
# 2. Add a new input() line.
# 3. Store the answer in a new variable.
# 4. Print a sentence that uses that variable.

print()
print("Nice. Your program can now ask questions.")
