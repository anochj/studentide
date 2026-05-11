# Strings
# A string is text in Python.
# Strings usually go inside quotes.

# To run this file in the terminal, use the command: python3 05_strings

message = "Welcome to strings."
print(message)

# Single quotes work too.
another_message = 'Python can use single quotes too.'
print(another_message)

# You can join strings with +.
first_name = "Alex"
last_name = "Lee"
full_name = first_name + " " + last_name
print(full_name)

# You can print text and variables with commas.
favourite_food = "pizza"
print("My favourite food is", favourite_food)

# F-strings let you put variables inside a string.
city = "Toronto"
print(f"I live in {city}.")

# Strings can include numbers and symbols.
room = "Room 204"
score_text = "Score: 10"
print(room)
print(score_text)

# Here are some lines for you to edit for the challenges.
your_first_name = "???"
your_last_name = "???"
your_food = "???"
your_goal = "???"

your_full_name = your_first_name + " " + your_last_name

print()
print("Practice output:")
print(your_full_name)
print("Favourite food:", your_food)
print(f"One day, I want to build {your_goal}.")

# Challenge idea:
# 1. Change the variables above so they are about you.
# 2. Add a new string variable called favourite_song.
# 3. Print that variable with a friendly sentence.
# 4. Try one line with + and one line with an f-string.

print()
print("Nice. You are getting more comfortable with text.")
