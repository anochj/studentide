# Module 8: Conditionals

Welcome back.

In this module, you will learn how Python makes decisions.

Programs often need to choose what to do next.

For example:

- if the user says yes, show one message
- if the user says no, show a different message
- if the score is high, print a celebration

Python uses conditionals for that.

## Table of Contents
1. [What you will learn](#what-you-will-learn)
2. [How to run this module](#how-to-run-this-module)
3. [What is a conditional](#what-is-a-conditional)
4. [Open the file](#open-the-file)
5. [Using `if`](#using-if)
6. [Using `else`](#using-else)
7. [Using `elif`](#using-elif)
8. [Comparing values](#comparing-values)
9. [Indentation matters](#indentation-matters)
10. [Common mistakes](#common-mistakes)
11. [Try it yourself](#try-it-yourself)
12. [Wrap up](#wrap-up)

## What you will learn

By the end of this module, you will know:

- what a conditional is
- how to use `if`
- how to use `else`
- how to use `elif`
- how to compare values with `==`
- why indentation matters

## How to run this module

To run this module, open the terminal and type:

```bash
python3 08_conditionals
```

Then press Enter.

This module asks a few questions, so be ready to type answers.

## What is a conditional

A conditional lets your program make a decision.

In normal language, it sounds like this:

> If this is true, do this.

In Python, it can look like this:

```python
if favourite_colour == "blue":
    print("Blue is a calm colour.")
```

The indented line only runs if the condition is true.

## Open the file

Open [__main__.py](__main__.py).

This is the file you will use for this module.

Inside, you should see a few small decisions using `if`, `elif`, and `else`.

Run the file more than once and try different answers.

## Using `if`

An `if` statement checks whether something is true.

```python
answer = "yes"

if answer == "yes":
    print("Great.")
```

The condition is:

```python
answer == "yes"
```

If that is true, Python runs the indented line.

## Using `else`

`else` gives Python something to do when the `if` condition is not true.

```python
answer = "no"

if answer == "yes":
    print("Great.")
else:
    print("No problem.")
```

This means:

- if the answer is `"yes"`, print `"Great."`
- otherwise, print `"No problem."`

## Using `elif`

`elif` means "else if".

It lets you check another condition.

```python
colour = "green"

if colour == "blue":
    print("Blue is calm.")
elif colour == "green":
    print("Green is fresh.")
else:
    print("That is a nice colour.")
```

You can use `elif` when there are several possible answers.

## Comparing values

To compare two values, use `==`.

```python
name == "Alex"
```

This asks:

> Is `name` equal to `"Alex"`?

This is different from one equals sign.

One equals sign stores a value:

```python
name = "Alex"
```

Two equals signs compare values:

```python
name == "Alex"
```

That difference is very important.

## Indentation matters

The lines under `if`, `elif`, and `else` must be indented.

```python
if answer == "yes":
    print("This line is indented.")
```

The indentation tells Python which lines belong inside the decision.

This will not work:

```python
if answer == "yes":
print("This line should be indented.")
```

You saw indentation earlier.

Now it is doing real work.

## Common mistakes

Here are a few common mistakes.

### Using one equals sign in a condition

```python
if answer = "yes":
    print("Great.")
```

Use `==` when comparing:

```python
if answer == "yes":
    print("Great.")
```

### Forgetting the colon

```python
if answer == "yes"
    print("Great.")
```

Use a colon:

```python
if answer == "yes":
    print("Great.")
```

### Forgetting indentation

```python
if answer == "yes":
print("Great.")
```

Indent the line:

```python
if answer == "yes":
    print("Great.")
```

## Try it yourself

Now try a few small experiments in [__main__.py](__main__.py).

### Challenge 1
Ask the user if they like Python.

If they type `"yes"`, print a happy message.

Otherwise, print a friendly message anyway.

### Challenge 2
Ask for a favourite colour.

Use `if`, `elif`, and `else` to print different responses.

### Challenge 3
Create a variable called `weather`.

If it is `"rainy"`, print one message.

Otherwise, print a different message.

### Challenge 4
Change the answers and run the file several times.

Notice which lines run and which lines do not.

## Wrap up

That is it for this module.

You learned that conditionals let Python make decisions.

You also saw:

- `if`
- `elif`
- `else`
- `==`
- indentation

This is a huge step.

Your programs can now choose different paths.
