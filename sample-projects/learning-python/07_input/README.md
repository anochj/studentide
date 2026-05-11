# Module 7: Input

Nice, now your programs are about to become more interactive.

So far, your code has shown messages in the console.

In this module, your program will ask the user a question and wait for an answer.

That is what `input()` does.

## Table of Contents
1. [What you will learn](#what-you-will-learn)
2. [How to run this module](#how-to-run-this-module)
3. [What is input](#what-is-input)
4. [Open the file](#open-the-file)
5. [Using `input()`](#using-input)
6. [Storing the answer](#storing-the-answer)
7. [Printing the answer back](#printing-the-answer-back)
8. [Input starts as text](#input-starts-as-text)
9. [Common mistakes](#common-mistakes)
10. [Try it yourself](#try-it-yourself)
11. [Wrap up](#wrap-up)

## What you will learn

By the end of this module, you will know:

- what input is
- how to ask the user a question
- how to store an answer in a variable
- how to print the answer back
- why input starts as text

## How to run this module

To run this module, open the terminal and type:

```bash
python3 07_input
```

Then press Enter.

This module will pause and wait for you to type answers.

## What is input

Input is information the user gives to the program.

For example, a program might ask:

```text
What is your name?
```

Then the user types:

```text
Alex
```

The program can store that answer and use it later.

So far, your programs have mostly talked to you.

With input, you can talk back.

## Open the file

Open [__main__.py](__main__.py).

This is the file you will use for this module.

Inside, you should see a few questions that use `input()`.

Run the file, answer the questions, and watch how the program uses your answers.

## Using `input()`

The `input()` function asks the user a question.

```python
input("What is your name? ")
```

The question inside the brackets is called the prompt.

The space before the ending quote is helpful:

```python
"What is your name? "
```

It gives the user a little room to type after the question.

## Storing the answer

Usually, you store the answer in a variable.

```python
name = input("What is your name? ")
```

This means:

> Ask the question, wait for the answer, and store the answer in `name`.

Now you can use `name` later in the program.

## Printing the answer back

Once you store input in a variable, you can print it.

```python
name = input("What is your name? ")
print("Hello,", name)
```

You can also use an f-string:

```python
name = input("What is your name? ")
print(f"Hello, {name}!")
```

Both are useful.

Use whichever feels clearer right now.

## Input starts as text

One important thing:

`input()` gives you text.

Even if the user types a number, Python receives it as text at first.

For example:

```python
age = input("How old are you? ")
```

If the user types `14`, Python stores it like `"14"`.

That is okay for now.

In this beginner course, you can print it and use it in sentences.

Later, you can learn how to convert text into real numbers when you need math.

## Common mistakes

Here are a few common mistakes.

### Forgetting to store the answer

```python
input("What is your name? ")
print(name)
```

This will not work because `name` was never created.

Use:

```python
name = input("What is your name? ")
print(name)
```

### Forgetting the brackets

```python
name = input "What is your name? "
```

`input()` needs brackets, just like `print()`.

### Expecting input to be a number right away

```python
age = input("How old are you? ")
```

The answer starts as text.

That is normal.

## Try it yourself

Now try a few small experiments in [__main__.py](__main__.py).

### Challenge 1
Ask the user for their name.

Print a greeting that uses the name.

### Challenge 2
Ask the user for their favourite food.

Print a sentence about it.

### Challenge 3
Ask the user what they want to build one day.

Print an encouraging message using their answer.

### Challenge 4
Ask one more question of your own.

Store the answer in a variable and print it back.

## Wrap up

That is it for this module.

You learned that `input()` lets your program ask questions.

You also saw how to:

- ask a question
- store the answer
- print the answer back
- use answers inside f-strings

This is a big step.

Your programs can now respond to the person using them.
