# Final Project: Profile Quiz

You made it to the final project.

In this project, you will build a small profile quiz.

Your program will ask the user questions, store their answers, make a few decisions, and print a friendly profile summary at the end.

This project uses the main ideas you have practiced so far:

- printing
- variables
- strings
- numbers
- input
- conditionals
- lists
- loops

Do not worry about making it perfect.

The goal is to build something that works, then improve it.

## Table of Contents
1. [What you will build](#what-you-will-build)
2. [How to run this project](#how-to-run-this-project)
3. [Open the file](#open-the-file)
4. [Project requirements](#project-requirements)
5. [Step 1: Welcome the user](#step-1-welcome-the-user)
6. [Step 2: Ask questions](#step-2-ask-questions)
7. [Step 3: Use conditionals](#step-3-use-conditionals)
8. [Step 4: Use a list](#step-4-use-a-list)
9. [Step 5: Print the final profile](#step-5-print-the-final-profile)
10. [Extra challenges](#extra-challenges)
11. [Wrap up](#wrap-up)

## What you will build

You will build a program that asks questions like:

- What is your name?
- What is your favourite food?
- What is your favourite colour?
- What do you want to build one day?
- Do you like Python?

Then your program will print a profile summary.

For example:

```text
Profile Summary
Name: Alex
Favourite food: pizza
Favourite colour: blue
Goal: build a game

Interests:
- coding
- music
- football
```

Your version can be different.

Make it feel like your own.

## How to run this project

To run this project, open the terminal and type:

```bash
python3 10_final_project_profile_quiz
```

Then press Enter.

The program will ask questions and wait for you to type answers.

## Open the file

Open [__main__.py](__main__.py).

This is your starter file.

It already has a simple version of the project.

Run it first.

Then improve it one step at a time.

## Project requirements

Your final project should include:

- at least five `input()` questions
- variables that store the answers
- at least one `if`, `elif`, or `else`
- at least one list
- at least one `for` loop
- a final profile summary
- friendly output that is easy to read

That is enough for a strong beginner project.

## Step 1: Welcome the user

Start with a few `print()` lines.

For example:

```python
print("Welcome to the Profile Quiz.")
print("Answer a few questions and I will build a profile for you.")
```

This helps the user understand what the program does.

## Step 2: Ask questions

Use `input()` to ask questions.

Store each answer in a variable.

```python
name = input("What is your name? ")
food = input("What is your favourite food? ")
colour = input("What is your favourite colour? ")
```

Good variable names make the project easier to read.

## Step 3: Use conditionals

Use a conditional to customize the program.

For example:

```python
likes_python = input("Do you like Python? ")

if likes_python == "yes":
    print("Great. You are in the right place.")
else:
    print("No problem. You can still learn a lot.")
```

You can also respond to a favourite colour:

```python
if colour == "blue":
    print("Blue is a calm choice.")
elif colour == "green":
    print("Green feels fresh.")
else:
    print("That is a nice colour.")
```

## Step 4: Use a list

Create a list of interests.

The starter file asks for three interests and stores them in a list.

```python
interests = [interest_one, interest_two, interest_three]
```

Then use a loop to print them:

```python
for interest in interests:
    print("-", interest)
```

This is a good way to show several related answers.

## Step 5: Print the final profile

At the end, print a clean summary.

Use blank lines to make it readable.

```python
print()
print("Profile Summary")
print("Name:", name)
print("Favourite food:", food)
```

You can use commas or f-strings.

Choose the style that feels easiest to read.

## Extra challenges

If your project works and you want to keep going, try these.

### Extra Challenge 1
Ask two more questions.

Add the answers to the final profile.

### Extra Challenge 2
Add another `elif` branch for a favourite colour.

### Extra Challenge 3
Ask for one more interest and add it to the list with `.append()`.

### Extra Challenge 4
Make the final summary more personal by using an f-string.

For example:

```python
print(f"{name} wants to build {goal}.")
```

### Extra Challenge 5
Add comments that explain each section of your project.

## Wrap up

That is it.

You built a real beginner Python project.

It asked for input, stored answers, made decisions, used a list, repeated with a loop, and printed a final result.

Those are real programming skills.

Keep experimenting.
