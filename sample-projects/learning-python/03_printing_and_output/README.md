# Module 3: Printing and Output

Nice, now we are getting into one of the most important parts of programming.

In this module, you will learn how to make Python display things in the console using `print()`.

This might seem simple, but it is a huge deal. Printing is one of the main ways you test ideas, understand what your code is doing, and catch mistakes. Even experienced programmers use it all the time.

## Table of Contents
1. [What you will learn](#what-you-will-learn)
2. [How to run this module](#how-to-run-this-module)
3. [What is output](#what-is-output)
4. [Open the file](#open-the-file)
5. [What `print()` does](#what-print-does)
6. [Printing more than one line](#printing-more-than-one-line)
7. [Printing numbers](#printing-numbers)
8. [Printing blank lines](#printing-blank-lines)
9. [Common mistakes](#common-mistakes)
10. [Try it yourself](#try-it-yourself)
11. [Wrap up](#wrap-up)

## What you will learn

By the end of this module, you will know:

- what output is
- what `print()` does
- how to print text
- how to print numbers
- how to print multiple lines
- how to make your output easier to read

## How to run this module

To run this module, open the terminal and type:

```bash
python3 03_printing_and_output
```

Then press Enter.

## What is output

Output is the information your program shows after it runs.

If you tell Python to display a message, that message is output.

For example, if your code says:

```python
print("Hello")
```

then the output will be:

```
Hello
```

Think of it like this:

- **code** is what you write
- **output** is what Python shows back to you

That is why printing is so useful. It lets you actually see what your program is doing.

## Open the file

Open [__main__.py](__main__.py).

This is the file you will use for this module.

Inside, you should see a few examples that use `print()`.

As always, do not just stare at the file. Run it, change it, run it again, and notice what happens.

## What `print()` does

The `print()` function tells Python to show something in the console.

For example:

```python
print("I am learning Python")
```

This will display:

```
I am learning Python
```

You can think of `print()` like telling Python:

> "Hey, show this to me."

That is why it is one of the first things beginners learn.

## Printing more than one line

You can use `print()` more than once.

For example:

```python
print("Hello")
print("My name is Alex")
print("I like pizza")
```

This will show:

```
Hello
My name is Alex
I like pizza
```

Each `print()` usually puts the next output on a new line.

That makes your programs easier to read.

## Printing numbers

You can also print numbers.

For example:

```python
print(5)
print(42)
```

This works too.

Text usually goes inside quotes.

Numbers do not need quotes if you want Python to treat them like numbers.

You will learn more about that later. For now, just notice that Python can print both.

## Printing blank lines

Sometimes you want space between parts of your output.

You can do that with an empty `print()`:

```python
print("Line one")
print()
print("Line two")
```

This creates a blank line between the two messages.

It is a small thing, but it can make output much cleaner.

## Common mistakes

Here are a few common mistakes to watch for.

### Forgetting quotes around text

```python
print(Hello)
```

This is a problem because Python will not understand `Hello` as plain text.

### Forgetting brackets

```python
print "Hello"
```

`print` needs brackets in Python.

### Expecting code to show something without `print()`

Just writing text like this:

```python
"Hello"
```

usually will not display anything when you run the file normally.

If you want to see it in the console, use `print()`.

These mistakes are very normal. Seriously. Everyone makes them.

## Try it yourself

Now try a few small experiments in [__main__.py](__main__.py).

### Challenge 1
Change one of the messages so it says your name.

For example:

```python
print("My name is Alex")
```

### Challenge 2
Add two new `print()` lines that say something about you.

For example:

```python
print("My favourite food is sushi")
print("I want to build cool software one day")
```

### Challenge 3
Print a number:

```python
print(100)
```

### Challenge 4
Add a blank line between two messages using:

```python
print()
```

Run the file again after each change and see how the output changes.

That is how you start building intuition.

## Wrap up

That is it for this module.

You learned that `print()` is how Python displays output in the console.

You also saw that you can use it to print:

- text
- numbers
- multiple lines
- blank lines

This might feel simple, but it is one of the most useful tools in programming.

From here, you are not just writing code.

You are starting to communicate with the computer.