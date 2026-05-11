# Module 5: Strings

Nice work so far.

In this module, you will learn more about strings.

A string is text in Python. You have already used strings many times, even if you did not know the name yet.

Every time you wrote something like `"Hello"` or `"I am learning Python"`, you were using a string.

## Table of Contents
1. [What you will learn](#what-you-will-learn)
2. [How to run this module](#how-to-run-this-module)
3. [What is a string](#what-is-a-string)
4. [Open the file](#open-the-file)
5. [Strings use quotes](#strings-use-quotes)
6. [Joining strings](#joining-strings)
7. [Printing strings with commas](#printing-strings-with-commas)
8. [F-strings](#f-strings)
9. [Common mistakes](#common-mistakes)
10. [Try it yourself](#try-it-yourself)
11. [Wrap up](#wrap-up)

## What you will learn

By the end of this module, you will know:

- what a string is
- how strings use quotes
- how to join strings together
- how to print strings with variables
- how to use a simple f-string

## How to run this module

To run this module, open the terminal and type:

```bash
python3 05_strings
```

Then press Enter.

## What is a string

A string is text.

Here are a few strings:

```python
"Hello"
"Python is fun"
"I like music"
```

Strings can contain letters, spaces, numbers, and symbols.

For example:

```python
"Room 204"
"Score: 10"
"Nice!"
```

Even if a string has a number inside it, Python still treats the whole thing as text.

## Open the file

Open [__main__.py](__main__.py).

This is the file you will use for this module.

Inside, you should see strings, variables, and a few ways to print messages.

Try changing the words and running the file again.

## Strings use quotes

Python usually needs quotes around text.

You can use double quotes:

```python
message = "Hello"
```

You can also use single quotes:

```python
message = 'Hello'
```

Both are fine.

The important part is that the string starts and ends with matching quotes.

This works:

```python
print("Hello")
```

This does not:

```python
print("Hello')
```

The quotes do not match.

## Joining strings

You can join strings with `+`.

```python
first_name = "Alex"
last_name = "Lee"

full_name = first_name + " " + last_name
print(full_name)
```

This prints:

```text
Alex Lee
```

The `" "` in the middle is a space.

Without it, the name would become:

```text
AlexLee
```

Tiny details matter, but you are getting used to that now.

## Printing strings with commas

You can also use commas inside `print()`.

```python
name = "Alex"
print("Hello,", name)
```

This prints:

```text
Hello, Alex
```

This is often easier than joining strings with `+`.

Python automatically adds a space between the pieces when you use commas in `print()`.

## F-strings

An f-string is a nice way to put variables inside text.

Here is an example:

```python
name = "Alex"
food = "pizza"

print(f"My name is {name} and I like {food}.")
```

This prints:

```text
My name is Alex and I like pizza.
```

The `f` before the quote tells Python:

> Look inside this string for variables in curly brackets.

You do not need to memorize this yet.

Just try it a few times and notice the pattern.

## Common mistakes

Here are a few common string mistakes.

### Forgetting quotes

```python
message = Hello
```

Python does not know that `Hello` is supposed to be text.

Use quotes:

```python
message = "Hello"
```

### Forgetting spaces when joining

```python
first_name = "Alex"
last_name = "Lee"
print(first_name + last_name)
```

This prints `AlexLee`.

Add a space string:

```python
print(first_name + " " + last_name)
```

### Forgetting the `f` in an f-string

```python
name = "Alex"
print("Hello, {name}")
```

This prints `{name}` instead of the value.

Use:

```python
print(f"Hello, {name}")
```

## Try it yourself

Now try a few small experiments in [__main__.py](__main__.py).

### Challenge 1
Create two variables:

```python
first_name = "..."
last_name = "..."
```

Join them into one full name and print it.

### Challenge 2
Use commas in `print()` to show a message with your name.

### Challenge 3
Use an f-string to print your favourite food.

### Challenge 4
Create a string that includes a number, like `"Grade 9"` or `"Room 12"`.

Print it.

## Wrap up

That is it for this module.

You learned that strings are text.

You also saw a few ways to work with them:

- using quotes
- joining strings with `+`
- printing strings with commas
- putting variables inside f-strings

Strings are everywhere in programming.

Any time your program needs names, messages, questions, labels, or sentences, strings are probably involved.
