# Module 2: Python Syntax

Welcome back.

In this module, you will learn about Python syntax.

Syntax is the set of rules that tells Python how code should be written. If the syntax is wrong, Python gets confused and your program will not run.

That might sound scary, but it is actually very normal. Everyone messes up syntax. Everyone forgets a quote or bracket sometimes. That is part of learning.

## Table of Contents
1. [What you will learn](#what-you-will-learn)
2. [How to run this module](#how-to-run-this-module)
3. [What is syntax](#what-is-syntax)
4. [Open the file](#open-the-file)
5. [A few new words](#a-few-new-words)
6. [Quotes and text](#quotes-and-text)
7. [Brackets and punctuation](#brackets-and-punctuation)
8. [Indentation](#indentation)
9. [Comments](#comments)
10. [Common syntax mistakes](#common-syntax-mistakes)
11. [Try it yourself](#try-it-yourself)
12. [Wrap up](#wrap-up)

## What you will learn

By the end of this module, you will know:

- what syntax means
- why quotes matter
- why brackets matter
- what indentation is
- how to write comments
- how to spot a few common syntax mistakes

## How to run this module

To run this module, open the terminal and type:

```bash
python3 02_python_syntax
```

Then press Enter.

## What is syntax

Syntax is the way code must be written so Python can understand it.

Think of it like English grammar.

For example, this sentence sounds fine:

> I am going to the store.

But this sounds broken:

> going store I the to am

The words are all there, but the order and structure are messed up.

Python is the same way. You can have the right idea, but if the code is written in the wrong shape, Python cannot understand it.

That is what syntax is. It is the grammar of code.

## Open the file

Open [__main__.py](__main__.py).

This is the file you will use for this module.

Inside, you should see a few small examples of Python code.

As you go through this module, you can change the code, run it, and see what happens.

## A few new words

You may see a couple of new words in this module.

Do not worry, you are not expected to fully know them yet.

### Function

A function is a command that tells Python to do something.

For example:

```python
print("Hello")
```

Here, `print()` is a function. Its job is to show text in the console.

You will learn more about functions later. For now, just think of them as built-in tools you can use.

### If statement

An `if` statement lets Python make a decision.

For example, it can mean:

- if something is true, do this
- otherwise, do not

You will learn `if` statements properly in a later module.

In this module, you may see one only to help show indentation.

## Quotes and text

In Python, text is usually written inside quotes.

For example:

```python
print("Hello, World!")
print('Python is fun')
```

Both double quotes and single quotes work for text.

The important part is that you close them properly.

This works:

```python
print("Hello")
```

This does not:

```python
print("Hello)
```

If you forget the ending quote, Python will show an error.

## Brackets and punctuation

Python also cares about symbols like brackets.

For example, the `print()` function needs brackets:

```python
print("Hello")
```

If you forget them, the code is not correct:

```python
print"Hello"
```

Tiny symbols can make a big difference. That can feel a little annoying at first, but it gets easier fast. Once your eyes get used to it, you will start spotting these mistakes almost instantly.

## Indentation

Indentation means the spaces at the start of a line.

In Python, indentation is very important. It is not just for making code look nice. It helps Python understand which lines belong together.

Here is an example:

```python
if True:
    print("This line is indented")
```

You do not need to fully understand `if True:` yet.

For now, just notice this:

- the first line ends with a colon
- the second line is pushed a little to the right
- that space at the start matters

That space tells Python that the second line belongs under the first one.

You will learn this properly when you reach conditionals and logic. Right now, just get used to the idea that spacing matters in Python.

## Comments

Comments are notes for humans.

Python ignores them when the program runs.

A comment starts with a `#`:

```python
# This is a comment
print("Hello")
```

Comments are useful when you want to explain your code to yourself or someone else.

## Common syntax mistakes

Here are some very common mistakes beginners make:

### Missing quote

```python
print("Hello)
```

### Missing bracket

```python
print("Hello"
```

### Missing colon

```python
if True
    print("Hi")
```

You do not need to know `if` yet. This is just here to show that Python expects a colon in certain places.

### Wrong indentation

```python
if True:
print("Hi")
```

Again, you do not need to understand `if` yet. Just notice that the second line should be indented.

These mistakes are completely normal. Seriously. They happen to everyone.

## Try it yourself

Now try a few small experiments in [__main__.py](__main__.py).

### Challenge 1
Write two correct `print()` lines using different quotes:

```python
print("Hello")
print('Welcome to Python')
```

### Challenge 2
Add a comment above one of your lines:

```python
# This line prints a greeting
print("Hi")
```

### Challenge 3
Purposely break one line by removing a quote or a bracket.

Run the file and look at the error.

Then fix it and run it again.

This is actually a great exercise. It helps you see how small syntax mistakes affect the program.

## Wrap up

That is it for this module.

You learned that syntax is the grammar of Python.

You also saw that small things matter, like:

- quotes
- brackets
- colons
- indentation
- comments

Do not worry about mastering all of this right away.

Right now, the goal is just to notice the shape of Python code and get more comfortable reading it.

You are doing great.